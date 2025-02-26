import express from 'express';
import { getCommunity } from '../controller/community.controller.js';
import { auth } from '../middleware/auth.js'; 
import { requireAuth } from "../middleware/auth.js";
import multer from 'multer';
import Post from "../models/post.model.js";  
import { createPost } from '../controller/community.controller.js';

const router = express.Router();

router.get('/community', requireAuth, getCommunity);

const upload = multer({ storage: multer.memoryStorage() });

router.post('/community/create-post', requireAuth, upload.single('img'), createPost);

export default router;




