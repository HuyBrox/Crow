import express from 'express';
import { callPage } from '../controller/connect.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();


router.get('/call', auth, callPage);


export default router;