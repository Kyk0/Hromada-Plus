const Comment = require('../models/Comment');

async function attachCommentsToOne(targetType, targetId) {
    const comments = await Comment.findByTarget(targetType, targetId);
    return comments;
}

module.exports = { attachCommentsToOne };