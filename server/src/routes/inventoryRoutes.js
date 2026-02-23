const express = require('express');
const passport = require('passport');
const inventoryController = require('../controllers/inventoryController');
const commentController = require('../controllers/commentController');

const router = express.Router();

router.get('/', inventoryController.getAllInventories);

router.get('/me', passport.authenticate('jwt', { session: false }), inventoryController.getMyInventories);
router.get('/shared', passport.authenticate('jwt', { session: false }), inventoryController.getSharedInventories);
router.get('/popular', inventoryController.getPopularInventories);
router.get('/tags', inventoryController.getAllTags);

router.get('/:id', inventoryController.getInventory);
router.get('/:id/comments', commentController.getComments);

router.use(passport.authenticate('jwt', { session: false }));

router.post('/:id/comments', commentController.createComment);
router.post('/', inventoryController.createInventory);
router.delete('/:id', inventoryController.deleteInventory);
router.patch('/:id', inventoryController.updateInventory);

module.exports = router;
