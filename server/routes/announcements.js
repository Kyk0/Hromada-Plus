const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const AnnouncementController = require('../controllers/AnnouncementController');

router.post('/create', auth, AnnouncementController.createAnnouncement);
router.get('/', AnnouncementController.getAll);
router.get('/:id', AnnouncementController.getOne);
router.get('/user/hromada', auth, AnnouncementController.getMyHromadaAnnouncements);

module.exports = router;