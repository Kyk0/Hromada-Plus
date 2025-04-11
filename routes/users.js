const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const auth = require('../middleware/auth');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/me', auth, UserController.getMe);
router.post('/change-password', auth, UserController.changePassword);
router.put('/me', auth, UserController.updateProfile);

module.exports = router;