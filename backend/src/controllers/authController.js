import * as authService from '../services/authService.js';

export const handleRegister = async (req, res) => {
  try {
    const { name, email, password, semester, branch, account_type } = req.body;

    if (!name || !email || !password || !semester || !branch || !account_type) {
      return res.status(400).json({ message: 'All basic fields are required' });
    }

    if (account_type !== 'STUDENT' && account_type !== 'TUTOR') {
      return res.status(400).json({ message: 'Invalid account type' });
    }

    if (account_type === 'STUDENT' && !req.body.interests) {
      return res.status(400).json({ message: 'Interests field is required for students' });
    }

    if (account_type === 'TUTOR' && (!req.body.subjects || !req.body.preferred_time)) {
      return res.status(400).json({ message: 'Subjects and preferred time are required for tutors' });
    }

    const user = await authService.registerUser(req.body);

    res.status(201).json({
      message: 'Registration successful',
      user
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server Error' });
  }
};

export const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await authService.loginUser(email, password);

    res.status(200).json({
      message: 'Login successful',
      user
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server Error' });
  }
};
