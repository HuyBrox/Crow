import express from 'express';
import {
    getLogin, postLogin, getRegister, postRegister, getLogout, getHome,
    getAbout
} from '../controller/user.controller.js';
import { auth, requireAuth } from '../middleware/auth.js';

import { getflashcards } from '../controller/flashcards.controller.js';

const router = express.Router();


router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/register', getRegister);
router.post('/register', postRegister);
router.get('/logout', getLogout);
router.get('/', auth, getHome);
router.get('/about', requireAuth, getAbout)
export default router;