const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const db = require('./knex');

async function importHromadas() {
  const results = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, 'hromadas.csv'))
        .pipe(csv())
        .on('data', (row) => {
          results.push({
            name: row.name.trim(),
            district: row.district.trim(),
            type: row.type.trim()
          });
        })
        .on('end', async () => {
          try {
            await db('hromadas').del();

            const chunkSize = 100; // можно поменять
            for (let i = 0; i < results.length; i += chunkSize) {
              const chunk = results.slice(i, i + chunkSize);
              await db('hromadas').insert(chunk);
            }

            console.log('Громади імпортовано успішно');
            resolve();
          } catch (err) {
            console.error('Помилка імпорту громад:', err);
            reject(err);
          }
        });
  });
}

async function setup() {
  if (!(await db.schema.hasTable('hromadas'))) {
    await db.schema.createTable('hromadas', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('district').notNullable();
      table.string('type').notNullable();
    });
  }

  if (!(await db.schema.hasTable('users'))) {
    await db.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('surname').notNullable();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.string('account_type').notNullable();
      table.integer('hromada_id').notNullable().references('id').inTable('hromadas');
      table.integer('points').defaultTo(0);
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
  }

  if (!(await db.schema.hasTable('initiatives'))) {
    await db.schema.createTable('initiatives', (table) => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.text('description');
      table.integer('user_id').notNullable().references('id').inTable('users');
      table.integer('hromada_id').notNullable().references('id').inTable('hromadas');
      table.string('status').notNullable();
      table.string('size').notNullable();
      table.string('address');
      table.text('keywords');
      table.text('moderation_comment');
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
  }

  if (!(await db.schema.hasTable('initiative_supports'))) {
    await db.schema.createTable('initiative_supports', (table) => {
      table.increments('id').primary();
      table.integer('user_id').notNullable().references('id').inTable('users');
      table.integer('initiative_id').notNullable().references('id').inTable('initiatives');
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
  }

  if (!(await db.schema.hasTable('announcements'))) {
    await db.schema.createTable('announcements', (table) => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.text('description');
      table.integer('user_id').notNullable().references('id').inTable('users');
      table.integer('hromada_id').notNullable().references('id').inTable('hromadas');
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
  }

  if (!(await db.schema.hasTable('comments'))) {
    await db.schema.createTable('comments', (table) => {
      table.increments('id').primary();
      table.integer('user_id').notNullable().references('id').inTable('users');
      table.string('target_type').notNullable();
      table.integer('target_id').notNullable();
      table.text('text').notNullable();
      table.boolean('visible').defaultTo(true);
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
  }

  if (!(await db.schema.hasTable('attachments'))) {
    await db.schema.createTable('attachments', (table) => {
      table.increments('id').primary();
      table.string('target_type').notNullable();
      table.integer('target_id').notNullable();
      table.integer('uploaded_by').notNullable().references('id').inTable('users');
      table.string('url').notNullable();
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
  }

  await importHromadas();

  console.log('Усі таблиці створено. Імпорт завершено.');
  process.exit();
}

setup();