import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '3rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', background: '#ffffff', padding: '3rem 2rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>
          PeerConnect
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Learn from your peers. Share your knowledge.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', margin: '0 auto' }}>
          <Link to="/student/login" className="btn btn-primary" style={{ padding: '0.85rem' }}>
            Login as Student
          </Link>

          <Link to="/tutor/login" className="btn btn-secondary" style={{ padding: '0.85rem' }}>
            Login as Tutor
          </Link>

          <Link to="/register" style={{ marginTop: '0.5rem', fontWeight: '600' }}>
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
