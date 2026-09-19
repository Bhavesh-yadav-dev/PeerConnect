import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to={!user ? '/' : user.account_type === 'STUDENT' ? '/student/dashboard' : '/tutor/dashboard'}>
          PeerConnect
        </Link>
      </div>

      <div className="navbar-links">
        {user ? (
          <>
            <span className="user-badge">
              {user.name} ({user.account_type})
            </span>

            {user.account_type === 'STUDENT' ? (
              <>
                <Link to="/student/dashboard">Dashboard</Link>
                <Link to="/student/requests">My Requests</Link>
              </>
            ) : (
              <>
                <Link to="/tutor/dashboard">Dashboard</Link>
                <Link to="/tutor/profile">My Profile</Link>
                <Link to="/tutor/requests">Requests</Link>
              </>
            )}

            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/student/login">Login as Student</Link>
            <Link to="/tutor/login">Login as Tutor</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', color: '#fff' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
