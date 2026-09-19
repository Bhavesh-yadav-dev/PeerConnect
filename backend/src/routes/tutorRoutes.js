import express from 'express';
import { handleGetProfile, handleUpdateProfile } from '../controllers/tutorController.js';
import { handleGetTutorRequests } from '../controllers/requestController.js';

const router = express.Router();

router.get('/profile', handleGetProfile);
router.put('/profile', handleUpdateProfile);
router.get('/requests', handleGetTutorRequests);

export default router;
