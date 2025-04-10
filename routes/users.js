const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const auth = require('../middleware/auth');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/me', auth, UserController.getMe);
router.post('/change-password', auth, UserController.changePassword);

module.exports = router;