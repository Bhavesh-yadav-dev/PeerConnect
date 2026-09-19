import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    semester: '1st',
    branch: 'CSE',
    account_type: 'STUDENT',
    interests: '',
    subjects: '',
    preferred_time: '',
    contact_email: '',
    instagram: '',
    bio: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      const user = response.data.user;

      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect to appropriate dashboard
      if (user.account_type === 'STUDENT') {
        navigate('/student/dashboard');
      } else {
        navigate('/tutor/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-card" style={{ maxWidth: '600px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create an Account</h2>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Bhavesh Yadav"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Gmail / Email</label>
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Semester</label>
              <select name="semester" value={formData.semester} onChange={handleChange}>
                <option value="1st">1st Semester</option>
                <option value="2nd">2nd Semester</option>
                <option value="3rd">3rd Semester</option>
                <option value="4th">4th Semester</option>
                <option value="5th">5th Semester</option>
                <option value="6th">6th Semester</option>
                <option value="7th">7th Semester</option>
                <option value="8th">8th Semester</option>
              </select>
            </div>

            <div className="form-group">
              <label>Branch</label>
              <select name="branch" value={formData.branch} onChange={handleChange}>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="ME">ME</option>
                <option value="CE">CE</option>
                <option value="EE">EE</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Account Type</label>
            <select name="account_type" value={formData.account_type} onChange={handleChange}>
              <option value="STUDENT">Student (I want help)</option>
              <option value="TUTOR">Tutor (I can teach/guide)</option>
            </select>
          </div>

          {formData.account_type === 'STUDENT' ? (
            <div className="form-group">
              <label>What are you interested in learning?</label>
              <textarea
                name="interests"
                rows="3"
                placeholder="e.g. Data Structures, React, C++, Machine Learning"
                value={formData.interests}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label>What subjects/topics can you teach?</label>
                <input
                  type="text"
                  name="subjects"
                  placeholder="e.g. DSA, C++, React, Node.js"
                  value={formData.subjects}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Preferred Teaching Time</label>
                <input
                  type="text"
                  name="preferred_time"
                  placeholder="e.g. 5 PM – 8 PM"
                  value={formData.preferred_time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Gmail for Communication (Shared when request accepted)</label>
                <input
                  type="email"
                  name="contact_email"
                  placeholder="e.g. bhavesh.tutor@gmail.com"
                  value={formData.contact_email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Instagram Username (Optional)</label>
                <input
                  type="text"
                  name="instagram"
                  placeholder="e.g. @bhaveshyadav"
                  value={formData.instagram}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Short Bio / Introduction (Optional)</label>
                <textarea
                  name="bio"
                  rows="3"
                  placeholder="Tell students a bit about your teaching experience..."
                  value={formData.bio}
                  onChange={handleChange}
                ></textarea>
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
          Already registered? <Link to="/student/login">Login as Student</Link> or <Link to="/tutor/login">Login as Tutor</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
