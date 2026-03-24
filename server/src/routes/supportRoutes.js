const express = require('express');
const passport = require('passport');
const supportController = require('../controllers/supportController');

const router = express.Router();

router.get(
  '/config',
  passport.authenticate('jwt', { session: false }),
  supportController.getSupportConfig
);

router.post(
  '/tickets',
  passport.authenticate('jwt', { session: false }),
  supportController.createSupportTicket
);

module.exports = router;
