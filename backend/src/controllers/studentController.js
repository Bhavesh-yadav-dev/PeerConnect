import * as tutorService from '../services/tutorService.js';

export const handleGetTutors = async (req, res) => {
  try {
    const studentId = req.query.student_id ? parseInt(req.query.student_id, 10) : null;
    const tutors = await tutorService.getAllTutors(studentId);
    res.status(200).json(tutors);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server Error' });
  }
};

export const handleGetTutorById = async (req, res) => {
  try {
    const tutorId = parseInt(req.params.id, 10);
    const tutor = await tutorService.getTutorById(tutorId);
    res.status(200).json(tutor);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server Error' });
  }
};
