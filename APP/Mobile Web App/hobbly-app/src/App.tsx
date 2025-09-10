/**
 * Hobbly App
 * 
 * Main application component with routing setup.
 * Provides navigation between all application pages:
 * - Welcome/Landing page
 * - Authentication pages (Login, SignUp)
 * - Dashboard and main application pages (Activities, Personal Info)
 * 
 * @module App
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Welcome, Login, Dashboard, SignUp, Activities, PersonalInfo, Unauthorized } from './pages';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import './App.css';

/**
 * Main App Component
 * 
 * Sets up routing for the Hobbly application.
 * Default route redirects to Welcome page.
 * 
 * @component
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Welcome page - default route */}
            <Route path="/" element={<Welcome />} />
            <Route path="/welcome" element={<Welcome />} />
            
            {/* Authentication routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Protected admin panel routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute requiredRole="organizer">
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="activities" element={<Activities />} />
                  <Route path="activities/new" element={<Activities />} /> {/* Activity creation form */}
                  <Route path="activities/:id/edit" element={<Activities />} /> {/* Activity edit form */}
                  <Route path="users" element={<Activities />} /> {/* Users management - admin only */}
                  <Route path="trash" element={<Activities />} /> {/* Deleted activities */}
                  <Route path="personal-info" element={<PersonalInfo />} />
                  <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
                </Routes>
              </ProtectedRoute>
            } />
            
            {/* Legacy routes - redirect to admin panel */}
            <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/activities" element={<Navigate to="/admin/activities" replace />} />
            <Route path="/personal-info" element={<Navigate to="/admin/personal-info" replace />} />
            
            {/* Unauthorized access page */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Redirect any unknown routes to welcome */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
