const db = require('../db/knex');

async function attachSupportCountsToInitiatives(initiatives) {
    const ids = initiatives.map(i => i.id);
    const rows = await db('initiative_supports')
        .whereIn('initiative_id', ids)
        .select('initiative_id')
        .count('id as count')
        .groupBy('initiative_id');

    const counts = {};
    for (const row of rows) {
        counts[row.initiative_id] = parseInt(row.count);
    }

    return initiatives.map(i => ({
        ...i,
        support_count: counts[i.id] || 0
    }));
}

async function attachSupportCountToOne(initiativeId) {
    const row = await db('initiative_supports')
        .where({ initiative_id: initiativeId })
        .count('id as count')
        .first();
    return parseInt(row?.count || 0);
}

module.exports = {
    attachSupportCountsToInitiatives,
    attachSupportCountToOne
};