import express from 'express';
import { handleGetTutors, handleGetTutorById } from '../controllers/studentController.js';
import { handleGetStudentRequests } from '../controllers/requestController.js';

const router = express.Router();

router.get('/tutors', handleGetTutors);
router.get('/tutors/:id', handleGetTutorById);
router.get('/requests', handleGetStudentRequests);

export default router;
