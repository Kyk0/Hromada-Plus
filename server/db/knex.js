const knex = require('knex');
const path = require('path');

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: path.join(__dirname, 'hromada.sqlite3')
    },
    useNullAsDefault: true
});

module.exports = db;