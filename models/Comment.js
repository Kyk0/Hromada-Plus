const db = require('../db/knex');

const Comment = {
    async create(data) {
        return db('comments').insert(data);
    },

    async findById(id) {
        return db('comments').where({ id }).first();
    },

    async softDelete(id) {
        return db('comments').where({ id }).update({ visible: false });
    },

    async findByTarget(type, targetId) {
        return db('comments')
            .where({ target_type: type, target_id: targetId, visible: true })
            .orderBy('created_at', 'desc');
    },

    async findByUser(userId) {
        return db('comments')
            .where({ user_id: userId, visible: true })
            .orderBy('created_at', 'desc');
    },

    async findLastByUser(userId) {
        return db('comments')
            .where({ user_id: userId })
            .orderBy('created_at', 'desc')
            .first();
    },


};



module.exports = Comment;