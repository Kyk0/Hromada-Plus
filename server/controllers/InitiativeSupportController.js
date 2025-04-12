const InitiativeSupport = require('../models/InitiativeSupport');
const User = require('../models/User');
const Initiative = require('../models/Initiative');

const supportInitiative = async (req, res) => {
    const userId = req.user.id;
    const initiativeId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Користувача не знайдено' });

    const initiative = await Initiative.findById(initiativeId);
    if (!initiative) return res.status(404).json({ error: 'Ініціативу не знайдено' });

    if (initiative.hromada_id !== user.hromada_id) {
        return res.status(403).json({ error: 'Можна підтримувати лише ініціативи своєї громади' });
    }

    const alreadyVoted = await InitiativeSupport.hasUserVoted(userId, initiativeId);
    if (alreadyVoted) {
        return res.status(400).json({ error: 'Ви вже підтримали цю ініціативу' });
    }

    const maxVotesPerDay = parseInt(process.env.MAX_VOTES_PER_DAY || '3', 10);
    const todayVotes = await InitiativeSupport.countTodayVotes(userId);
    if (todayVotes >= maxVotesPerDay) {
        return res.status(429).json({ error: `Максимум ${maxVotesPerDay} голосів на день` });
    }

    await InitiativeSupport.create(userId, initiativeId);
    await User.addPoints(userId, 1);

    res.status(201).json({ message: 'Ініціативу підтримано' });
};

const unsupportInitiative = async (req, res) => {
    const userId = req.user.id;
    const initiativeId = req.params.id;

    const alreadyVoted = await InitiativeSupport.hasUserVoted(userId, initiativeId);
    if (!alreadyVoted) {
        return res.status(404).json({ error: 'Ви ще не підтримували цю ініціативу' });
    }

    await InitiativeSupport.remove(userId, initiativeId);
    res.json({ message: 'Підтримку знято' });
};

const getMySupportedInitiatives = async (req, res) => {
    const userId = req.user.id;
    const initiatives = await InitiativeSupport.getUserSupportedInitiatives(userId);
    res.json(initiatives);
};

module.exports = {
    supportInitiative,
    unsupportInitiative,
    getMySupportedInitiatives
};
