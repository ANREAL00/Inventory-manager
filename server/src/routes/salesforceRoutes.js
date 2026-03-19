const express = require('express');
const passport = require('passport');
const salesforceController = require('../controllers/salesforceController');

const router = express.Router();

router.post(
    '/users/:id/create-account-contact',
    passport.authenticate('jwt', { session: false }),
    salesforceController.createAccountAndContact
);

module.exports = router;

