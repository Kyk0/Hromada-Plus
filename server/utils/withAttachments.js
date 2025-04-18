const Attachment = require('../models/Attachment');

async function attachImagesToInitiatives(initiatives) {
    const ids = initiatives.map(i => i.id);
    const attachments = await Attachment.findManyByTarget('initiative', ids);

    const grouped = {};
    for (const att of attachments) {
        if (!grouped[att.target_id]) grouped[att.target_id] = [];
        grouped[att.target_id].push(att.url);
    }

    return initiatives.map(init => ({
        ...init,
        image_urls: grouped[init.id] || []
    }));
}

async function attachImagesToOne(initiative) {
    const attachments = await Attachment.findByTarget('initiative', initiative.id);
    return {
        ...initiative,
        image_urls: attachments.map(a => a.url)
    };
}
async function attachImagesToAnnouncements(announcements) {
    const ids = announcements.map(a => a.id);
    const attachments = await Attachment.findManyByTarget('announcement', ids);

    const grouped = {};
    for (const att of attachments) {
        if (!grouped[att.target_id]) grouped[att.target_id] = [];
        grouped[att.target_id].push(att.url);
    }

    return announcements.map(announcement => ({
        ...announcement,
        image_urls: grouped[announcement.id] || []
    }));
}

module.exports = {
    attachImagesToInitiatives,
    attachImagesToAnnouncements,
    attachImagesToOne,
};