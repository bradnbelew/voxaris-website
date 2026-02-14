/**
 * Verify Supabase Tables Exist
 *
 * Checks if the migration has been applied by querying each table.
 *
 * Usage: npx ts-node scripts/verify-supabase-tables.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const EXPECTED_TABLES = [
  'clients',
  'call_logs',
  'video_sessions',
  'leads',
  'error_logs',
  'dnc_list',
];

async function verifyTables() {
  console.log('🔍 Verifying Supabase Tables...\n');

  let allExist = true;

  for (const table of EXPECTED_TABLES) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);

      if (error) {
        if (error.message.includes('does not exist') || error.code === '42P01') {
          console.log(`❌ ${table} - NOT FOUND`);
          allExist = false;
        } else {
          console.log(`⚠️  ${table} - Error: ${error.message}`);
          allExist = false;
        }
      } else {
        const count = data?.length || 0;
        console.log(`✅ ${table} - EXISTS (${count} rows)`);
      }
    } catch (err: any) {
      console.log(`❌ ${table} - Exception: ${err.message}`);
      allExist = false;
    }
  }

  console.log('');

  if (allExist) {
    console.log('✅ All tables exist! Migration has been applied.');

    // Check for Roofing Pros seed data
    console.log('\n🔍 Checking for Roofing Pros USA seed data...');
    const { data: client } = await supabase
      .from('clients')
      .select('*')
      .eq('client_id', 'roofing-pros')
      .single();

    if (client) {
      console.log('✅ Roofing Pros USA client found:');
      console.log(`   Company: ${client.company_name}`);
      console.log(`   Owner: ${client.owner_name}`);
      console.log(`   Inbound Agent: ${client.retell_agent_id}`);
      console.log(`   Outbound Agent: ${client.retell_outbound_agent_id}`);
    } else {
      console.log('⚠️  Roofing Pros USA client not found in seed data');
    }
  } else {
    console.log('❌ Some tables are missing. Run the migration:');
    console.log('');
    console.log('   1. Go to: https://supabase.com/dashboard');
    console.log('   2. Select your project');
    console.log('   3. Go to SQL Editor');
    console.log('   4. Paste contents of: supabase/migrations/001_initial_schema.sql');
    console.log('   5. Click "Run"');
  }
}

verifyTables().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
