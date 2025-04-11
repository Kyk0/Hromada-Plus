const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { makeDecision } = require('../controllers/InitiativeModerationController');

router.patch('/:id/decision', auth, makeDecision);

module.exports = router;