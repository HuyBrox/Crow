import express from 'express';
import {getLogin, postLogin, getRegister, postRegister, getLogout, getHome,getprofile,getAbout,getListUser} 
from '../controller/user.controller.js';
import { auth, requireAuth } from '../middleware/auth.js';



const router = express.Router();


router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/register', getRegister);
router.post('/register', postRegister);
router.get('/logout', getLogout);
router.get('/', auth, getHome);
router.get('/profile', auth, getprofile);
router.get('/about', requireAuth, getAbout)
router.get('/getUsers', requireAuth, getListUser);
export default router;