import express from 'express';
import { getCommunity } from '../controller/community.controller.js';
import { auth } from '../middleware/auth.js'; 
import { requireAuth } from "../middleware/auth.js";


const router = express.Router();
//router.get('/community', auth, getCommunity);
router.get('/community', requireAuth, getCommunity);

export default router;