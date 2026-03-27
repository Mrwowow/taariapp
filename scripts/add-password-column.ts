import pool from '../lib/db';

async function run() {
  try {
    await pool.execute('ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) AFTER avatar');
    console.log('Added password_hash column');
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === 'ER_DUP_FIELDNAME') console.log('password_hash column already exists');
    else throw e;
  }
  await pool.end();
}
run();
