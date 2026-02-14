/**
 * Run Supabase Migration
 *
 * Applies the 001_initial_schema.sql migration to create all tables.
 *
 * Usage: npx ts-node scripts/run-migration.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
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

async function runMigration() {
  console.log('🚀 Running Supabase Migration...\n');

  // Read the migration file
  const migrationPath = path.resolve(__dirname, '../supabase/migrations/001_initial_schema.sql');

  if (!fs.existsSync(migrationPath)) {
    console.error('❌ Migration file not found:', migrationPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationPath, 'utf-8');
  console.log('📄 Read migration file:', migrationPath);
  console.log(`   Size: ${(sql.length / 1024).toFixed(1)} KB\n`);

  // Split SQL into individual statements (basic split on semicolons outside strings)
  // For complex migrations, use proper SQL parser
  const statements = sql
    .split(/;(?=(?:[^']*'[^']*')*[^']*$)/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`📊 Found ${statements.length} SQL statements\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const preview = stmt.substring(0, 60).replace(/\n/g, ' ');

    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: stmt + ';' });

      if (error) {
        // Try direct execution for DDL statements
        const { error: directError } = await supabase.from('_migrations').select('*').limit(0);

        // If it's a "relation does not exist" error for the table we're creating, that's expected
        if (error.message.includes('already exists') || error.message.includes('duplicate')) {
          console.log(`⏭️  [${i + 1}/${statements.length}] Skipped (already exists): ${preview}...`);
          successCount++;
        } else {
          console.error(`❌ [${i + 1}/${statements.length}] Error: ${preview}...`);
          console.error(`   ${error.message}`);
          errorCount++;
        }
      } else {
        console.log(`✅ [${i + 1}/${statements.length}] Success: ${preview}...`);
        successCount++;
      }
    } catch (err: any) {
      console.error(`❌ [${i + 1}/${statements.length}] Exception: ${preview}...`);
      console.error(`   ${err.message}`);
      errorCount++;
    }
  }

  console.log('\n📊 Migration Summary:');
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);

  if (errorCount === 0) {
    console.log('\n✅ Migration completed successfully!');
  } else {
    console.log('\n⚠️  Migration completed with some errors.');
    console.log('   You may need to run the SQL manually in Supabase dashboard.');
  }
}

runMigration().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
