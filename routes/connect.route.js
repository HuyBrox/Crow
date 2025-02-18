import express from 'express';
import { callPage, chatPage, sendMessage } from '../controller/connect.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();


router.get('/call', auth, callPage);
router.get('/chat', auth, chatPage);
router.post('/chat', auth, sendMessage);
export default router;