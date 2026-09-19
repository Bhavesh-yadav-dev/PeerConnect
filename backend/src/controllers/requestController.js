import * as requestService from '../services/requestService.js';

export const handleCreateRequest = async (req, res) => {
  try {
    const { student_id, tutor_id, message } = req.body;
    const request = await requestService.createHelpRequest({ student_id, tutor_id, message });
    res.status(201).json({
      message: 'Help request sent successfully',
      request
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server Error' });
  }
};

export const handleGetStudentRequests = async (req, res) => {
  try {
    const studentId = req.query.student_id ? parseInt(req.query.student_id, 10) : null;
    if (!studentId) {
      return res.status(400).json({ message: 'student_id query parameter is required' });
    }
    const requests = await requestService.getStudentRequests(studentId);
    res.status(200).json(requests);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server Error' });
  }
};

export const handleGetTutorRequests = async (req, res) => {
  try {
    const tutorId = req.query.tutor_id ? parseInt(req.query.tutor_id, 10) : null;
    if (!tutorId) {
      return res.status(400).json({ message: 'tutor_id query parameter is required' });
    }
    const requests = await requestService.getTutorRequests(tutorId);
    res.status(200).json(requests);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server Error' });
  }
};

export const handleAcceptRequest = async (req, res) => {
  try {
    const requestId = parseInt(req.params.id, 10);
    const { tutor_id } = req.body;
    if (!tutor_id) {
      return res.status(400).json({ message: 'tutor_id is required' });
    }
    const result = await requestService.updateRequestStatus(requestId, tutor_id, 'ACCEPTED');
    res.status(200).json({
      message: 'Help request accepted',
      request: result
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server Error' });
  }
};

export const handleRejectRequest = async (req, res) => {
  try {
    const requestId = parseInt(req.params.id, 10);
    const { tutor_id } = req.body;
    if (!tutor_id) {
      return res.status(400).json({ message: 'tutor_id is required' });
    }
    const result = await requestService.updateRequestStatus(requestId, tutor_id, 'REJECTED');
    res.status(200).json({
      message: 'Help request rejected',
      request: result
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server Error' });
  }
};
