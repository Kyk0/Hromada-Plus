const db = require('../db/knex');

const Announcement = {
    async create(data) {
        return db('announcements').insert(data);
    },

    async findById(id) {
        return db('announcements').where({ id }).first();
    },

    async findAll() {
        return db('announcements').orderBy('created_at', 'desc');
    },

    async findByHromada(hromadaId) {
        return db('announcements').where({ hromada_id: hromadaId }).orderBy('created_at', 'desc');
    },

    async findByUser(userId) {
        return db('announcements').where({ user_id: userId }).orderBy('created_at', 'desc');
    }
};

module.exports = Announcement;