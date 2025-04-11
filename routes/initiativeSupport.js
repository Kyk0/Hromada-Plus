const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SupportController = require('../controllers/InitiativeSupportController');

router.post('/:id', auth, SupportController.supportInitiative);
router.delete('/:id', auth, SupportController.unsupportInitiative);
router.get('/mine', auth, SupportController.getMySupportedInitiatives);

module.exports = router;