const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const InitiativeController = require('../controllers/InitiativeController');

router.post('/create', auth, InitiativeController.createInitiative);
router.get('/user/hromada', auth, InitiativeController.getUserHromadaInitiatives);
router.get('/user/mine', auth, InitiativeController.getMyInitiatives);
router.get('/:id', InitiativeController.getOneInitiative);
router.get('/', InitiativeController.getAllInitiatives);

module.exports = router;