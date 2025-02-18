import express from 'express';
import {
    getLogin, postLogin, getRegister, postRegister, getLogout, getHome,
    addCourses
} from '../controller/user.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();


router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/register', getRegister);
router.post('/register', postRegister);
router.get('/logout', getLogout);
router.get('/', auth, getHome);
router.get('/add-courses', auth, addCourses);
export default router;