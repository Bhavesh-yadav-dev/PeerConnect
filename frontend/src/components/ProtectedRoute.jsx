import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRole }) {
  const userJson = localStorage.getItem('user');
  if (!userJson) {
    return <Navigate to="/" replace />;
  }

  const user = JSON.parse(userJson);

  if (allowedRole && user.account_type !== allowedRole) {
    const redirectPath = user.account_type === 'STUDENT' ? '/student/dashboard' : '/tutor/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

export default ProtectedRoute;
