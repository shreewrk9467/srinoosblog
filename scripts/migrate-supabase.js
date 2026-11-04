const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function migrate() {
  const password = process.argv[2] || process.env.SUPABASE_DB_PASSWORD;
  if (!password) {
    console.error('Usage: node tools/migrate-supabase.js <YOUR-SUPABASE-DB-PASSWORD>');
    process.exit(1);
  }

  const encodedPassword = encodeURIComponent(password);
  // Try direct connection or pooler connection
  const connectionString = `postgresql://postgres:${encodedPassword}@db.udankkjapmjuurcveube.supabase.co:5432/postgres`;

  console.log('Connecting to Supabase PostgreSQL at db.udankkjapmjuurcveube.supabase.co:5432...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    await client.connect();
    console.log('✓ Successfully connected to Supabase PostgreSQL database!');

    const sqlPath = path.join(__dirname, '../supabase/schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Executing database schema migrations...');
    await client.query(sql);
    console.log('✓ Migration executed successfully! All tables, policies, and seed data created.');

    // Verify website_settings table exists
    const res = await client.query('SELECT count(*) FROM public.website_settings');
    console.log(`✓ Verification passed: website_settings table has ${res.rows[0].count} row(s).`);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end().catch(() => {});
  }
}

migrate();

