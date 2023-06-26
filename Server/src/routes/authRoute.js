import express from 'express';
import { userInfo } from '../controlllers/userController.js';
const router = express.Router();


router.post('/register', userInfo.userRegister);

export default router