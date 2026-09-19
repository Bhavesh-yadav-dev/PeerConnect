import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

function RequestHelp() {
  const { tutorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [tutorName, setTutorName] = useState(location.state?.tutorName || 'Tutor');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  useEffect(() => {
    if (!location.state?.tutorName) {
      // Fetch tutor name if accessed directly
      api.get(`/students/tutors/${tutorId}`)
        .then((res) => setTutorName(res.data.name))
        .catch(() => setTutorName('Tutor'));
    }
  }, [tutorId, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!message.trim()) {
      setError('Please write a message explaining what you need help with.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/requests', {
        student_id: user.id,
        tutor_id: parseInt(tutorId, 10),
        message: message.trim()
      });

      navigate('/student/requests');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send help request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-card" style={{ maxWidth: '600px' }}>
        <h2 style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
          Request Help from {tutorName}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Tell the tutor what you need help with.
        </p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Message / Topics Needed</label>
            <textarea
              rows="5"
              placeholder="e.g. I need help understanding recursion and backtracking in DSA."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="btn-group" style={{ marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? 'Sending Request...' : 'Send Request'}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RequestHelp;
