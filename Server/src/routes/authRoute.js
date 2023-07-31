import express from 'express';
import { userInfo } from '../controllers/userController.js';
import {protect, isAdmin} from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/register', userInfo.userRegister);

router.get('/verify/:userId/:uniqueString', userInfo.verifyRegisterEmail);

router.post('/login', userInfo.userLogin);

router.get('/refresh-token', userInfo.handleRefreshToken);

router.get('/alluser', userInfo.getAllUser);

router.get('/:id', protect, isAdmin, userInfo.getUserById);

router.put('/edit-user', protect, userInfo.updatedUser);

router.delete('/:id', userInfo.deleteUser);

router.put('/block-user/:id', protect, isAdmin, userInfo.blockUser);

router.put('/unblock-user/:id', protect, isAdmin, userInfo.unBlockUser);

router.post('/logout', userInfo.Logout);

router.get('/reset-password/:userId/:uniqueToken', userInfo.verifyResetToken);

router.post('/update-password', protect, userInfo.updatePassword);

router.post('/forgot-password', userInfo.forgotPasswordToken);

router.post('/reset-password/:userId/:uniqueToken', userInfo.resetPassword);

export default router