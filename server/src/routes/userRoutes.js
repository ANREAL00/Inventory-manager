const express = require('express');
const passport = require('passport');
const userController = require('../controllers/userController');

const router = express.Router();

router.use(passport.authenticate('jwt', { session: false }));

const restrictToAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

router.patch('/me/language', userController.updateLanguage);
router.patch('/me/theme', userController.updateTheme);

router.use(restrictToAdmin);

router.get('/', userController.getAllUsers);
router.patch('/:id/block', userController.blockUser);
router.patch('/:id/unblock', userController.unblockUser);
router.patch('/:id/role', userController.changeRole);
router.delete('/:id', userController.deleteUser);

module.exports = router;
