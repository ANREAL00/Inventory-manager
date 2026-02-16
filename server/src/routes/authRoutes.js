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

router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  authController.getMe
);

module.exports = router;
