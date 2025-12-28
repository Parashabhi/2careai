# 2care.ai - Digital Health Wallet

A secure, accessible Digital Health Wallet built with ReactJS, Node.js, and SQLite.

## 🚀 Key Features
- **Health Reports:** Upload PDF/Images with vital metadata (BP, Sugar, Heart Rate).
- **Vitals Tracking:** Trend visualization using Recharts with date filtering.
- **Report Retrieval:** Search and filter by Date, Vital type, or Category.
- **Access Control:** Share specific records with Doctors/Family with Read-Only permissions.

## 🛠️ Tech Stack
- **Frontend:** ReactJS, Tailwind CSS, Recharts, Lucide-react.
- **Backend:** Node.js (Express), Multer (File Handling).
- **Database:** SQLite (Relational Data Modeling).

## 🔐 Security & Access Control
- **Protection:** User data is linked to unique IDs. 
- **Permissions:** A dedicated `permissions` table manages report sharing.
- **Read-Only:** Shared users are restricted from modifying or deleting records.

## ⚙️ Setup Instructions
1. **Backend:**
   - `cd backend`
   - `npm install`
   - `node server.js`
2. **Frontend:**
   - `cd frontend`
   - `npm install`
   - `npm run dev`