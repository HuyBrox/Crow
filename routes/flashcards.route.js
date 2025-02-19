import express from 'express';
import { getflashcards } from '../controllers/flashcards.controller.js';

const router = express.Router();
router.get('/flashcards', getflashcards);
export default router;