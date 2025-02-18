import express from 'express';
import { coursePage } from '../controller/course.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();


router.get('/course', auth, coursePage);

export default router;