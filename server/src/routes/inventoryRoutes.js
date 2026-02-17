const express = require('express');
const passport = require('passport');
const inventoryController = require('../controllers/inventoryController');

const router = express.Router();

router.get('/', inventoryController.getAllInventories);
router.get('/:id', inventoryController.getInventory);

router.use(passport.authenticate('jwt', { session: false }));

router.post('/', inventoryController.createInventory);
router.delete('/:id', inventoryController.deleteInventory);
router.patch('/:id', inventoryController.updateInventory);

module.exports = router;
