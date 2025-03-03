import express from 'express';
import { coursePage, courseDetailPage, lessonDetailPage, createCourse, addLessonVideo, deleteLesson, deleteCourse } from '../controller/course.controller.js';
import { auth, requireAuth } from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import { deleteMediaById } from "../helper/upload-media.js";

const router = express.Router();


router.get('/course', requireAuth, coursePage);
router.get('/course/detail/:id', requireAuth, courseDetailPage);
router.get('/course/:courseId/lesson/:lessonId', requireAuth, lessonDetailPage);
router.post('/course/create', createCourse);
router.post('/course/addLessonVideo', upload.single('file'), addLessonVideo);




// Sửa tuyến xóa khóa học từ POST -> DELETE
router.delete('/course/:courseId', deleteCourse);
// Thêm tuyến xóa bài học
router.delete('/course/:courseId/lesson/:lessonId', deleteLesson);

export default router;