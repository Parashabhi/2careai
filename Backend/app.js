const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = "your_medical_data_secret_key";


const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Database Initialization
const db = new sqlite3.Database('./health_wallet.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'Owner' -- 'Owner' or 'Viewer'
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS reports (id INTEGER PRIMARY KEY, user_id INTEGER, title TEXT, type TEXT, date TEXT, file_url TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS vitals (id INTEGER PRIMARY KEY, user_id INTEGER, report_id INTEGER, bp_sys INTEGER, bp_dia INTEGER, sugar INTEGER, heart_rate INTEGER, date TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS permissions (id INTEGER PRIMARY KEY, report_id INTEGER, shared_with_email TEXT)`);
  
});

// File Upload Config
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid or expired token." });
        req.user = user; // Adds the logged-in user's data (id, role, email) to the request
        next();
    });
};
// API Endpoints

// Registration
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
        [name, email, hashedPassword, role || 'Owner'],
        function(err) {
            if (err) return res.status(400).json({ error: "Email already exists" });
            res.json({ message: "User registered successfully" });
        }
    );
});

// Login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id,email:user.email, name: user.name, role: user.role } });
    });
});

app.post('/api/upload', upload.single('report'), (req, res) => {
    const { userId, title, type, date, bp_sys, bp_dia, sugar, heart_rate } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;

    db.run(`INSERT INTO reports (user_id, title, type, date, file_url) VALUES (?, ?, ?, ?, ?)`,
        [userId, title, type, date, fileUrl], function (err) {
            if (err) return res.status(500).json(err);
            const reportId = this.lastID;

            db.run(`INSERT INTO vitals (user_id, report_id, bp_sys, bp_dia, sugar, heart_rate, date) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [userId, reportId, bp_sys, bp_dia, sugar, heart_rate, date]);

            res.json({ message: "Upload successful", reportId });
        });
});
// This tells Express to serve files from the 'uploads' folder at the /uploads path
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Protect Vitals: Only the owner should see their own vitals
app.get('/api/vitals/:userId', authenticateToken, (req, res) => {
    // Extra Check: Ensure the logged-in user is requesting THEIR OWN data
    if (req.user.id != req.params.userId) {
        return res.status(403).json({ error: "Unauthorized access to these vitals." });
    }
    
    db.all(`SELECT * FROM vitals WHERE user_id = ? ORDER BY date ASC`, [req.params.userId], (err, rows) => {
        res.json(rows);
    });
});


app.get('/api/reports/:userId', (req, res) => {
    db.all(`SELECT * FROM reports WHERE user_id = ? ORDER BY date DESC`, [req.params.userId], (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});
app.post('/api/share', (req, res) => {
    const { reportId, sharedWithEmail, permission } = req.body;

    db.run(
        `INSERT INTO permissions (report_id, shared_with_email) VALUES (?, ?)`,
        [reportId, sharedWithEmail],
        function (err) {
            if (err) return res.status(500).json({ error: "Already shared or DB error" });
            res.json({ message: "Access granted successfully" });
        }
    );
});

// Protect Shared Reports: Ensure the email matches the logged-in user
app.get('/api/shared-with-me', authenticateToken, (req, res) => {
    const userEmail = req.user.email; // Use email from the verified token

    const query = `
        SELECT reports.* FROM reports
        JOIN permissions ON reports.id = permissions.report_id
        WHERE permissions.shared_with_email = ?
    `;

    db.all(query, [userEmail], (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});
app.listen(5000, () => console.log('Server running on port 5000'));