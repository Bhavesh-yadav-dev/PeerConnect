import express from 'express';
import { handleCreateRequest, handleAcceptRequest, handleRejectRequest } from '../controllers/requestController.js';

const router = express.Router();

router.post('/', handleCreateRequest);
router.put('/:id/accept', handleAcceptRequest);
router.put('/:id/reject', handleRejectRequest);

export default router;
