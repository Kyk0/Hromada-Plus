const db = require('../db/knex');

const Attachment = {
    async create(data) {
        return db('attachments').insert(data);
    },

    async findByTarget(targetType, targetId) {
        return db('attachments')
            .where({ target_type: targetType, target_id: targetId });
    },

    async findManyByTarget(targetType, targetIds) {
        return db('attachments')
            .whereIn('target_id', targetIds)
            .andWhere('target_type', targetType);
    }
};

module.exports = Attachment;