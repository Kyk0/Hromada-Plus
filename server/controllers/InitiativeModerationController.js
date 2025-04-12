const Initiative = require('../models/Initiative');
const { isGovUser } = require('../utils/isGovUser');

const makeDecision = async (req, res) => {
    const { id } = req.params;
    const { status, moderation_comment } = req.body;

    const user = req.user;
    if (!(await isGovUser(user))) {
        return res.status(403).json({ error: 'Недостатньо прав для прийняття рішень' });
    }

    if (!['прийнято', 'відхилено'].includes(status)) {
        return res.status(400).json({ error: 'Статус має бути або "прийнято", або "відхилено"' });
    }

    const initiative = await Initiative.findById(id);
    if (!initiative) {
        return res.status(404).json({ error: 'Ініціативу не знайдено' });
    }

    await Initiative.updateStatus(id, status, moderation_comment || null);

    res.json({ message: 'Статус ініціативи оновлено', status, moderation_comment });
};

module.exports = { makeDecision };