import express from 'express';
import { coursePage, courseDetailPage, lessonDetailPage } from '../controller/course.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();


router.get('/course', auth, coursePage);
router.get('/course/detail/:id', auth, courseDetailPage);
router.get('/course/:courseId/lesson/:lessonId', auth, lessonDetailPage);
export default router;