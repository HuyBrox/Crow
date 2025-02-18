import express from 'express';
import { getcourse } from '../controller/course.controller.js';
const router = express.Router();
router.get('/course', getcourse);
export default router;