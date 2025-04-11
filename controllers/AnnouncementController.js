const Announcement = require('../models/Announcement');
const User = require('../models/User');
const Attachment = require('../models/Attachment');
const { isContentAppropriate } = require('../utils/contentCheck');
const { attachImagesToAnnouncements } = require('../utils/withAttachments');
const { isGovUser } = require('../utils/isGovUser');

const createAnnouncement = async (req, res) => {
    const { title, description, image_urls } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const isGov = await isGovUser(user);

    if (!isGov) {
        return res.status(403).json({ error: 'Тільки представники влади можуть створювати оголошення' });
    }

    if (!title || !description) {
        return res.status(400).json({ error: 'Поле title і description обовʼязкові' });
    }

    const appropriate = await isContentAppropriate(`${title} ${description}`);
    if (!appropriate) {
        return res.status(400).json({ error: 'Оголошення містить неприйнятний зміст' });
    }

    const [announcementId] = await Announcement.create({
        title,
        description,
        user_id: userId,
        hromada_id: user.hromada_id
    });

    const maxImages = parseInt(process.env.MAX_ANNOUNCEMENT_IMAGES || '7', 10);

    if (Array.isArray(image_urls)) {
        if (image_urls.length > maxImages) {
            return res.status(400).json({ error: `Максимум ${maxImages} зображень дозволено` });
        }

        for (const url of image_urls) {
            await Attachment.create({
                target_type: 'announcement',
                target_id: announcementId,
                uploaded_by: userId,
                url
            });
        }
    }

    res.status(201).json({ message: 'Оголошення успішно створено' });
};

const getOne = async (req, res) => {
    const { id } = req.params;
    const announcement = await Announcement.findById(id);
    if (!announcement) return res.status(404).json({ error: 'Оголошення не знайдено' });

    const attachments = await Attachment.findByTarget('announcement', id);
    announcement.image_urls = attachments.map(a => a.url);
    res.json(announcement);
};

const getAll = async (req, res) => {
    const announcements = await Announcement.findAll();
    const withImages = await attachImagesToAnnouncements(announcements);
    res.json(withImages);
};

const getMyHromadaAnnouncements = async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Користувача не знайдено' });

    const announcements = await Announcement.findByHromada(user.hromada_id);
    const withImages = await attachImagesToAnnouncements(announcements);
    res.json(withImages);
};



module.exports = {
    createAnnouncement,
    getOne,
    getAll,
    getMyHromadaAnnouncements
};