import express from 'express';
import { registerLocal, googleAuth, googleAuthCallback, verifyOTP, loginLocal, logoutUser, refreshAccessToken, resendOTP, updateProfile, updateAvatar } from '../controllers/auth.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const router = express.Router();

router.post('/register', registerLocal);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginLocal);
router.post('/resend-otp', resendOTP);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', verifyJWT, logoutUser);
router.get('/google', googleAuth);
router.get('/callback', googleAuthCallback);

router.get('/me', verifyJWT, (req, res) => {
    res.status(200).json(new ApiResponse(200, req.user, "User profile fetched successfully"));
});

router.patch('/profile', verifyJWT, updateProfile);
router.post('/profile-photo', verifyJWT, upload.single('avatar'), updateAvatar);

export default router;
