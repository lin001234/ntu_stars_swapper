// routes/auth.js
const express = require('express');
const authController = require('./authController');
const passport = require('passport');
const router = express.Router();
// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);


// OAuth callback handler
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  authController.handleOauthCallback
);

// Logout route
router.post('/logout', authController.logout);

// Check authentication status
router.get('/status', authController.status);

module.exports = router;