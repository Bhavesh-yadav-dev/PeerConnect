import React, { useState, useEffect } from 'react';
import api from '../services/api';

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const studentId = user ? user.id : '';
        const response = await api.get(`/students/requests?student_id=${studentId}`);
        setRequests(response.data);
      } catch (err) {
        setError('Failed to load your requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user]);

  return (
    <div className="container">
      <h2 style={{ marginBottom: '0.5rem' }}>My Help Requests</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Track the status of help requests you have sent to tutors.
      </p>

      {error && <div className="error-msg">{error}</div>}

      {loading ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            You haven't sent any help requests yet.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {requests.map((req) => (
            <div key={req.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                    {req.tutor_name}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {req.tutor_semester} Semester • {req.tutor_branch}
                  </p>
                </div>

                <span className={`badge badge-${req.status.toLowerCase()}`}>
                  {req.status}
                </span>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Topic / Message:
                </strong>
                <p style={{ marginTop: '0.25rem', whiteSpace: 'pre-line', color: 'var(--text-main)' }}>
                  "{req.message}"
                </p>
              </div>

              {req.status === 'ACCEPTED' && (
                <div className="contact-box">
                  <h4 style={{ color: '#166534', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    Request Accepted ✓
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: '#15803d', marginBottom: '0.75rem' }}>
                    Use these contact details to communicate directly with the tutor:
                  </p>
                  <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                    📧 Gmail: <a href={`mailto:${req.contact_email}`}>{req.contact_email}</a>
                  </p>
                  {req.instagram && (
                    <p style={{ fontWeight: '600' }}>
                      📸 Instagram: <span style={{ color: 'var(--primary-color)' }}>{req.instagram}</span>
                    </p>
                  )}
                </div>
              )}

              {req.status === 'REJECTED' && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '0.75rem 1rem', borderRadius: '6px', color: '#991b1b', fontSize: '0.9rem' }}>
                  Your request was rejected. You can try reaching out to other tutors.
                </div>
              )}

              {req.status === 'PENDING' && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', italic: 'true' }}>
                  ⏳ Status: Pending tutor response.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRequests;
