import express from 'express';
import { coursePage } from '../controller/course.controller.js';
import { auth, requireAuth } from '../middleware/auth.js';

const router = express.Router();


router.get('/course', requireAuth, coursePage);

export default router;