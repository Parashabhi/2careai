import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MyReportsPage from './pages/MyReportsPage';
import SharedReports from './pages/SharedReports';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  // Check if user is logged in (Simple check for demonstration)
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div className="flex h-screen w-screen bg-white justify-center overflow-hidden">
        
        {/* Only show Sidebar if authenticated and NOT on login/register pages */}
        <Routes>
          {/* Auth Routes: No Sidebar here */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected App Routes: Inside the centered layout with Sidebar */}
          <Route 
            path="/*" 
            element={
              <div className="flex w-full max-w-[1440px] bg-white border-x border-slate-100 overflow-hidden">
      
                <main className="flex-1 h-full overflow-y-auto bg-white">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/reports" element={<MyReportsPage />} />
                    <Route path="/shared" element={<SharedReports />} />
                    {/* Redirect unknown routes to dashboard */}
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </main>
              </div>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;