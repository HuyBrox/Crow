import express from 'express';
import {
    getLogin, postLogin, getRegister, postRegister, getLogout, getHome
} from '../controller/user.controller.js';
import { auth } from '../middleware/auth.js';
import { getcourse} from '../controller/course.controller.js';
import { getflashcards } from '../controller/flashcards.controller.js';
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes

const router = express.Router();


router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/register', getRegister);
router.post('/register', postRegister);
router.get('/logout', getLogout);
router.get('/', auth, getHome);
router.get('/course', getcourse);
router.get('/flashcards', getflashcards);
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
export default router;