import React, { useState, useEffect } from 'react';
import api from '../services/api';

function TutorDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  const fetchRequests = async () => {
    try {
      const tutorId = user ? user.id : '';
      const response = await api.get(`/tutors/requests?tutor_id=${tutorId}`);
      setRequests(response.data);
    } catch (err) {
      setError('Failed to load student help requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const handleAccept = async (requestId) => {
    try {
      await api.put(`/requests/${requestId}/accept`, { tutor_id: user.id });
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await api.put(`/requests/${requestId}/reject`, { tutor_id: user.id });
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject request');
    }
  };

  return (
    <div className="container">
      <h2 style={{ marginBottom: '0.5rem' }}>Help Requests</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Review requests received from students needing technical guidance.
      </p>

      {error && <div className="error-msg">{error}</div>}

      {loading ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            No help requests received yet.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {requests.map((req) => (
            <div key={req.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                    {req.student_name}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>
                    {req.student_semester} Semester • {req.student_branch}
                  </p>
                </div>

                <span className={`badge badge-${req.status.toLowerCase()}`}>
                  {req.status}
                </span>
              </div>

              <div style={{ marginBottom: '1.25rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Topic / Message:
                </strong>
                <p style={{ marginTop: '0.25rem', color: 'var(--text-main)', whiteSpace: 'pre-line' }}>
                  "{req.message}"
                </p>
              </div>

              {req.status === 'PENDING' ? (
                <div className="btn-group">
                  <button
                    className="btn btn-success"
                    onClick={() => handleAccept(req.id)}
                  >
                    Accept
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => handleReject(req.id)}
                  >
                    Reject
                  </button>
                </div>
              ) : req.status === 'ACCEPTED' ? (
                <p style={{ color: '#166534', fontWeight: '600', fontSize: '0.9rem' }}>
                  ✓ You accepted this request. Student can now see your contact details.
                </p>
              ) : (
                <p style={{ color: '#991b1b', fontWeight: '500', fontSize: '0.9rem' }}>
                  You rejected this request.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TutorDashboard;
