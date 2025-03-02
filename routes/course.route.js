import express from 'express';
import { coursePage, courseDetailPage, lessonDetailPage, createCourse, addLessonVideo } from '../controller/course.controller.js';
import { auth, requireAuth } from '../middleware/auth.js';
import upload from '../middleware/multer.js';
const router = express.Router();


router.get('/course', requireAuth, coursePage);
router.get('/course/detail/:id', requireAuth, courseDetailPage);
router.get('/course/:courseId/lesson/:lessonId', requireAuth, lessonDetailPage);
router.post('/course/create', createCourse);
router.post('/course/addLessonVideo', upload.single('file'), addLessonVideo);
export default router;