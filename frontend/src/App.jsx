import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Register from './pages/Register';
import StudentLogin from './pages/StudentLogin';
import TutorLogin from './pages/TutorLogin';
import StudentDashboard from './pages/StudentDashboard';
import TutorProfile from './pages/TutorProfile';
import RequestHelp from './pages/RequestHelp';
import MyRequests from './pages/MyRequests';
import TutorDashboard from './pages/TutorDashboard';
import TutorProfileEdit from './pages/TutorProfileEdit';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/tutor/login" element={<TutorLogin />} />

        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/requests"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <MyRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutors/:id"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <TutorProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/request-help/:tutorId"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <RequestHelp />
            </ProtectedRoute>
          }
        />

        {/* Tutor Routes */}
        <Route
          path="/tutor/dashboard"
          element={
            <ProtectedRoute allowedRole="TUTOR">
              <TutorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutor/requests"
          element={
            <ProtectedRoute allowedRole="TUTOR">
              <TutorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutor/profile"
          element={
            <ProtectedRoute allowedRole="TUTOR">
              <TutorProfileEdit />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
