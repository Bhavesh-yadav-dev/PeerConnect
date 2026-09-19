import * as tutorService from '../services/tutorService.js';

export const handleGetProfile = async (req, res) => {
  try {
    const userId = req.query.user_id ? parseInt(req.query.user_id, 10) : null;
    if (!userId) {
      return res.status(400).json({ message: 'user_id query parameter is required' });
    }
    const profile = await tutorService.getTutorProfile(userId);
    res.status(200).json(profile);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server Error' });
  }
};

export const handleUpdateProfile = async (req, res) => {
  try {
    const updatedProfile = await tutorService.updateTutorProfile(req.body);
    res.status(200).json({
      message: 'Profile updated successfully',
      profile: updatedProfile
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server Error' });
  }
};
