const db = require('../db/knex');

const InitiativeSupport = {
    async hasUserVoted(userId, initiativeId) {
        const record = await db('initiative_supports')
            .where({ user_id: userId, initiative_id: initiativeId })
            .first();
        return !!record;
    },

    async countTodayVotes(userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return db('initiative_supports')
            .where('user_id', userId)
            .andWhere('created_at', '>=', today)
            .count('id as count')
            .first()
            .then(r => r.count || 0);
    },

    async create(userId, initiativeId) {
        return db('initiative_supports').insert({
            user_id: userId,
            initiative_id: initiativeId
        });
    },

    async remove(userId, initiativeId) {
        return db('initiative_supports')
            .where({ user_id: userId, initiative_id: initiativeId })
            .del();
    },

    async getUserSupportedInitiatives(userId) {
        return db('initiatives')
            .join('initiative_supports', 'initiatives.id', 'initiative_supports.initiative_id')
            .where('initiative_supports.user_id', userId)
            .select('initiatives.*')
            .orderBy('initiative_supports.created_at', 'desc');
    }
};

module.exports = InitiativeSupport;