import express from 'express';
import { getCommunity } from '../controller/community.controller.js';
import { requireAuth } from "../middleware/auth.js";
import multer from 'multer';
import { createPost } from '../controller/community.controller.js';
import { likePost } from '../controller/community.controller.js';
//import { upload } from '../middleware/multer.js';
import { deletePost } from '../controller/community.controller.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/community', requireAuth, getCommunity);

router.post('/community/create-post', requireAuth, upload.single('img'), createPost);

router.post('/community/like/:postId', requireAuth, likePost);

router.delete('/community/delete/:postId', requireAuth, deletePost);

export default router;




