
const express = require('express');
const routes = express.Router();
const passport = require('passport');
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  verifyEmail
} = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.get('/verify/:userId', verifyEmail);

// Google OAuth
router.get(
  '/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email']
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login'
  }),
  (req, res) => {
    // Successful authentication, redirect or send token
    const token = req.user.getSignedJwtToken();
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

// Facebook OAuth
router.get(
  '/facebook',
  passport.authenticate('facebook', {
    session: false,
    scope: ['email']
  })
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    session: false,
    failureRedirect: '/login'
  }),
  (req, res) => {
    // Successful authentication, redirect or send token
    const token = req.user.getSignedJwtToken();
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

module.exports = router;
const express = require('express');
const Routes = express.Router();
const { register, login } = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

module.exports = router;
const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google Auth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth.html' }),
  (req, res) => {
    // Successful authentication
    const token = generateToken(req.user);
    res.redirect(`/dashboard.html?token=${token}`);
  }
);

// Facebook Auth (similar to Google)