const express = require('express');
const externalController = require('../controllers/externalController');

const router = express.Router();

router.get('/inventory-export', externalController.getInventoryExportByToken);

module.exports = router;
