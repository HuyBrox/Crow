import express from 'express';
import UserRouter from './user.route.js';
import ConnectRouter from './connect.route.js';
import CourseRouter from './course.route.js';
import FlashCardRouter from './flashcards.route.js';
const router = express.Router();

router.use('', UserRouter);
router.use('', ConnectRouter);
router.use('', CourseRouter);
router.use('', FlashCardRouter);
export default router;