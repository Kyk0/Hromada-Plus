const Comment = require('../models/Comment');
const User = require('../models/User');
const { isContentAppropriate } = require('../utils/contentCheck');

const createComment = async (req, res) => {
    const { target_type, target_id, text } = req.body;
    const userId = req.user.id;

    if (!target_type || !target_id || !text) {
        return res.status(400).json({ error: 'Усі поля є обовʼязковими' });
    }

    if (!['initiative', 'announcement'].includes(target_type)) {
        return res.status(400).json({ error: 'Невірний тип цілі' });
    }

    if (text.trim().length < 3) {
        return res.status(400).json({ error: 'Коментар повинен містити щонайменше 3 символи' });
    }

    const appropriate = await isContentAppropriate(text);
    if (!appropriate) {
        return res.status(400).json({ error: 'Коментар містить неприйнятний зміст' });
    }

    const last = await Comment.findLastByUser(userId);

    if (last) {
        const now = Date.now();
        const lastTime = new Date(last.created_at).getTime();
        const intervalSec = parseInt(process.env.MIN_COMMENT_INTERVAL || '60', 10);
        const intervalMs = intervalSec * 1000;

        if (now - lastTime < intervalMs) {
            const waitSec = Math.ceil((intervalMs - (now - lastTime)) / 1000);
            return res.status(429).json({
                error: `Почекайте ще ${waitSec} сек. перед наступним коментарем`
            });
        }
    }

    const [commentId] = await Comment.create({
        target_type,
        target_id,
        text,
        user_id: userId
    });

    await User.addPoints(userId, 1);

    res.status(201).json({ message: 'Коментар додано', id: commentId });
};

const deleteComment = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(id);
    if (!comment || !comment.visible) {
        return res.status(404).json({ error: 'Коментар не знайдено' });
    }

    if (comment.user_id !== userId && req.user.account_type !== 'gov') {
        return res.status(403).json({ error: 'Ви не можете видалити цей коментар' });
    }

    await Comment.softDelete(id);
    await User.addPoints(comment.user_id, -1);

    res.json({ message: 'Коментар видалено' });
};

const getByTarget = async (req, res) => {
    const { type, id } = req.params;
    const comments = await Comment.findByTarget(type, id);
    res.json(comments);
};

const getMyComments = async (req, res) => {
    const comments = await Comment.findByUser(req.user.id);
    res.json(comments);
};

module.exports = {
    createComment,
    deleteComment,
    getByTarget,
    getMyComments
};