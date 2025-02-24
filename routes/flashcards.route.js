import express from 'express';
import { getflashcardDetail, getflashcards, getCreateCard, postCreateCard } from '../controller/flashcards.controller.js';
import { auth, requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/flashcards', requireAuth, getflashcards);
router.get('/flashcards/card/:id', requireAuth, getflashcardDetail);
router.get('/flashcards/createCard', requireAuth, getCreateCard);
router.post('/flashcards/createCard', requireAuth, postCreateCard);
export default router;