const express = require('express');
const passport = require('passport');
const multer = require('multer');
const uploadController = require('../controllers/uploadController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.use(passport.authenticate('jwt', { session: false }));

router.post('/', upload.single('image'), uploadController.uploadImage);

module.exports = router;
