import express from 'express';
import { getcourse } from '../controller/cource.controller.js';
const router = express.Router();
router.get('/cource', getCourse);
export default router;