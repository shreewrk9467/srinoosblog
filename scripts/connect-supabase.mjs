import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { createClient } from '@supabase/supabase-js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

async function main() {
  console.log('\n======================================================');
  console.log('🚀 SRINOOS - SUPABASE CLOUD DATABASE INTEGRATION TOOL');
  console.log('======================================================\n');

  let supabaseUrl = process.argv[2];
  let supabaseKey = process.argv[3];

  if (!supabaseUrl) {
    supabaseUrl = await ask('Enter your Supabase Project URL (e.g. https://xyz.supabase.co): ');
  }

  if (!supabaseKey) {
    supabaseKey = await ask('Enter your Supabase public anon key (starts with eyJ...): ');
  }

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Both Supabase URL and Anon Key are required.');
    process.exit(1);
  }

  // Clean URL
  supabaseUrl = supabaseUrl.trim().replace(/\/+$/, '');
  if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
    supabaseUrl = `https://${supabaseUrl}`;
  }

  console.log(`\n⏳ Testing connection to: ${supabaseUrl}...`);

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    const { data, error } = await supabase.from('categories').select('id').limit(1);

    if (error && error.code !== '42P01' && !error.message.includes('relation') && !error.message.includes('does not exist')) {
      console.error('❌ Supabase connection failed:', error.message);
      process.exit(1);
    }

    console.log('✅ Successfully connected to Supabase PostgreSQL!');

    if (error && (error.code === '42P01' || error.message.includes('does not exist'))) {
      console.log('ℹ️  Note: Tables not created yet. Please execute supabase-schema.sql in your Supabase SQL Editor.');
    } else {
      console.log('✅ Tables verified in database.');
    }

    // Save to .env.local
    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Remove old keys if present
    envContent = envContent
      .split('\n')
      .filter((line) => !line.startsWith('NEXT_PUBLIC_SUPABASE_URL=') && !line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY='))
      .join('\n');

    envContent += `\nNEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}\nNEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseKey}\n`;

    fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf8');
    console.log('💾 Saved credentials to .env.local');

    console.log('\n🎉 SUPABASE INTEGRATION COMPLETE!');
    console.log('Your website will now automatically use Supabase Cloud Database.');
    console.log('======================================================\n');
  } catch (err) {
    console.error('❌ Connection test error:', err.message);
  } finally {
    rl.close();
  }
}

main();
