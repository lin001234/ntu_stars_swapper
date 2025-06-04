// routes/auth.js
const express = require('express');
const supabase = require('../config/supabase');
const passport = require('passport');
const router = express.Router();
// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);


// OAuth callback handler
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    req.session.user=req.user;
    
    req.session.save(err =>{
      if (err){
        console.error('Session save error:', err);
        return res.status(500).send('Session save failed');
      }
    })
    res.redirect( `${process.env.CLIENT_URL}/home` || 'http://localhost:3000');
  }
);

// Logout route
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Check authentication status
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
});



module.exports = router;