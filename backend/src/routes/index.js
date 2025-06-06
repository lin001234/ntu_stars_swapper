const express=require('express');
const router = express.Router();

const authRoutes = require('../features/auth/authRouter');
const profileRoutes = require('./profile');
const userRoute = require('./users');
const postRoutes = require('../features/posts/postRouter');

router.use('/auth', authRoutes);

router.use('/profile', profileRoutes)

router.use('/user', userRoute);

router.use('/posts', postRoutes);

module.exports= router;