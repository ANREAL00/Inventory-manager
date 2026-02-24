const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);

router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  authController.login
);

router.get('/me', passport.authenticate('jwt', { session: false }), authController.getMe);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', passport.authenticate('google', { session: false }), authController.login);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'], session: false }));
router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), authController.login);

module.exports = router;
