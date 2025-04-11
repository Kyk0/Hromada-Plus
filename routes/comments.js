const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const CommentController = require('../controllers/CommentController');

router.post('/create', auth, CommentController.createComment);
router.get('/mine', auth, CommentController.getMyComments);
router.delete('/:id', auth, CommentController.deleteComment);

module.exports = router;