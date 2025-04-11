const db = require('../db/knex');

const User = {
    async create(data) {
        return db('users').insert(data);
    },

    async findByEmail(email) {
        return db('users').where({ email }).first();
    },

    async findById(id) {
        return db('users').where({ id }).first();
    },

    async updatePassword(id, hashedPassword) {
        return db('users').where({ id }).update({ password: hashedPassword });
    },

    async updateProfile(id, data) {
        return db('users').where({ id }).update(data);
    }
};

module.exports = User;