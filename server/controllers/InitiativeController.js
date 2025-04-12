const Initiative = require('../models/Initiative');
const Attachment = require('../models/Attachment');
const User = require('../models/User');
const { isContentAppropriate } = require('../utils/contentCheck');
const { attachImagesToInitiatives, attachImagesToOne } = require('../utils/withAttachments');
const { attachSupportCountsToInitiatives, attachSupportCountToOne } = require('../utils/withSupportCount');
const { attachCommentsToOne } = require('../utils/withComments');

const createInitiative = async (req, res) => {
    const { title, description, size, address, keywords, image_urls } = req.body;
    const userId = req.user.id;

    if (!title || !description || !size) {
        return res.status(400).json({ error: 'Всі поля (title, description, size) є обовʼязковими' });
    }

    if (!['локальна', 'амбіційна'].includes(size)) {
        return res.status(400).json({ error: 'Тип ініціативи повинен бути або "локальна", або "амбіційна"' });
    }

    if (size === 'локальна' && !address) {
        return res.status(400).json({ error: 'Локальні ініціативи повинні містити адресу' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Користувача не знайдено' });

    const now = new Date();
    const createdAt = new Date(user.created_at);
    const minDays = parseInt(process.env.MIN_ACCOUNT_AGE_DAYS || '7', 10);
    const daysSinceRegistration = (now - createdAt) / (1000 * 60 * 60 * 24);

    if (daysSinceRegistration < minDays) {
        return res.status(403).json({ error: `Ініціативи можна створювати лише через ${minDays} днів після реєстрації` });
    }

    const requiredPoints = size === 'локальна'
        ? parseInt(process.env.LOCAL_INITIATIVE_POINTS || '10', 10)
        : parseInt(process.env.AMBITIOUS_INITIATIVE_POINTS || '50', 10);

    if (user.points < requiredPoints) {
        return res.status(403).json({ error: `Потрібно щонайменше ${requiredPoints} балів для створення цієї ініціативи` });
    }

    const limitDays = size === 'локальна'
        ? parseInt(process.env.LOCAL_INITIATIVE_DAYS_LIMIT || '7', 10)
        : parseInt(process.env.AMBITIOUS_INITIATIVE_DAYS_LIMIT || '30', 10);

    if (limitDays > 0) {
        const sinceDate = new Date(now.getTime() - limitDays * 24 * 60 * 60 * 1000);
        const count = await Initiative.countUserInitiatives(userId, size, sinceDate);
        if (count >= 1) {
            return res.status(429).json({ error: `Можна створити лише одну ${size} ініціативу кожні ${limitDays} днів` });
        }
    }

    const appropriate = await isContentAppropriate(`${title} ${description}`);
    if (!appropriate) {
        return res.status(400).json({ error: 'Зміст ініціативи не відповідає вимогам спільноти' });
    }

    const [initiativeId] = await Initiative.create({
        title,
        description,
        size,
        address: size === 'локальна' ? address : null,
        keywords,
        status: 'на розгляді',
        user_id: userId,
        hromada_id: user.hromada_id
    });

    const maxImages = parseInt(process.env.MAX_INITIATIVE_IMAGES || '7', 10);
    if (Array.isArray(image_urls)) {
        if (image_urls.length > maxImages) {
            return res.status(400).json({ error: `Максимум ${maxImages} зображень дозволено для однієї ініціативи` });
        }

        for (const url of image_urls) {
            await Attachment.create({
                target_type: 'initiative',
                target_id: initiativeId,
                uploaded_by: userId,
                url
            });
        }
    }

    res.status(201).json({ message: 'Ініціатива успішно створена' });
};

const getOneInitiative = async (req, res) => {
    const { id } = req.params;
    const initiative = await Initiative.findById(id);
    if (!initiative) return res.status(404).json({ error: 'Ініціативу не знайдено' });

    const withImages = await attachImagesToOne(initiative);
    const supportCount = await attachSupportCountToOne(id);
    const comments = await attachCommentsToOne('initiative', id);

    res.json({ ...withImages, support_count: supportCount, comments });
};

const getAllInitiatives = async (req, res) => {
    const initiatives = await Initiative.findAll();
    const withImages = await attachImagesToInitiatives(initiatives);
    const withSupport = await attachSupportCountsToInitiatives(withImages);
    res.json(withSupport);
};

const getUserHromadaInitiatives = async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Користувача не знайдено' });

    const initiatives = await Initiative.findByHromada(user.hromada_id);
    const withImages = await attachImagesToInitiatives(initiatives);
    const withSupport = await attachSupportCountsToInitiatives(withImages);
    res.json(withSupport);
};

const getMyInitiatives = async (req, res) => {
    const initiatives = await Initiative.findByUser(req.user.id);
    const withImages = await attachImagesToInitiatives(initiatives);
    const withSupport = await attachSupportCountsToInitiatives(withImages);
    res.json(withSupport);
};

module.exports = {
    createInitiative,
    getOneInitiative,
    getAllInitiatives,
    getUserHromadaInitiatives,
    getMyInitiatives
};