import express from 'express';
import { getflashcardDetail, getflashcards } from '../controller/flashcards.controller.js';
import { auth, requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/flashcards', requireAuth, getflashcards);
router.get('/flashcards/latthe', requireAuth, getflashcardDetail);

export default router;