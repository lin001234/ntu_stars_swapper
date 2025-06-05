const express=require('express');
const router = express.Router();

const authRoutes = require('../features/auth/authRouter');
const profileRoutes = require('./profile');
const userRoute = require('./users');

router.use('/auth', authRoutes);

router.use('/profile', profileRoutes)

router.use('/user', userRoute);

module.exports= router;