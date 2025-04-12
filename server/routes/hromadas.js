const express = require('express');
const router = express.Router();
const { getAllHromadas } = require('../controllers/HromadaController');

router.get('/', getAllHromadas);

module.exports = router;