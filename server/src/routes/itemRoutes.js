const express = require('express');
const passport = require('passport');
const itemController = require('../controllers/itemController');

const router = express.Router();

router.get('/:id', itemController.getItem);
router.get('/:id/likes', itemController.getLikes);
router.get('/inventory/:inventoryId', itemController.getItems);

router.use(passport.authenticate('jwt', { session: false }));

router.post('/:id/like', itemController.toggleLike);
router.post('/', itemController.createItem);
router.patch('/:id', itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

module.exports = router;