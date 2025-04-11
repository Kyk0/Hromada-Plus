const db = require('../db/knex');

const Initiative = {
    async create(data) {
        return db('initiatives').insert(data);
    },

    async countUserInitiatives(userId, size, sinceDate) {
        const result = await db('initiatives')
            .where('user_id', userId)
            .andWhere('size', size)
            .andWhere('created_at', '>=', sinceDate)
            .count('id as count')
            .first();
        return result.count || 0;
    },

    async findById(id) {
        return db('initiatives').where({ id }).first();
    },

    async findAll() {
        return db('initiatives').orderBy('created_at', 'desc');
    },

    async findByHromada(hromadaId) {
        return db('initiatives').where({ hromada_id: hromadaId }).orderBy('created_at', 'desc');
    },

    async findByUser(userId) {
        return db('initiatives').where({ user_id: userId }).orderBy('created_at', 'desc');
    }
};

module.exports = Initiative;