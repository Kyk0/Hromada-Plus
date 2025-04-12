const db = require('../db/knex');

const getAllHromadas = async (req, res) => {
    try {
        const hromadas = await db('hromadas').select('*');
        res.json(hromadas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Помилка отримання списку громад' });
    }
};

module.exports = { getAllHromadas };