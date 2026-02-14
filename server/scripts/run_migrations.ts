/**
 * Run Database Migrations
 *
 * Applies SQL migrations directly to Supabase using the service role key.
 * Use this when the Supabase CLI is not available or authenticated.
 *
 * Usage: npx ts-node scripts/run_migrations.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Migrations to run (in order)
const MIGRATIONS = [
    '20260206_create_roofing_followup_attempts.sql',
    '20260206_create_roofing_analytics.sql',
    '20260206_alter_roofing_leads_address.sql',
    '20260206_create_roofing_training_sessions.sql'
];

async function runMigrations() {
    console.log("\n📦 RUNNING DATABASE MIGRATIONS");
    console.log("══════════════════════════════════════════════════\n");

    const migrationsDir = path.resolve(__dirname, '../../supabase/migrations');

    for (const migrationFile of MIGRATIONS) {
        const filePath = path.join(migrationsDir, migrationFile);

        console.log(`\n📄 Running: ${migrationFile}`);

        try {
            // Check if file exists
            if (!fs.existsSync(filePath)) {
                console.log(`   ⚠️  File not found, skipping`);
                continue;
            }

            // Read SQL file
            const sql = fs.readFileSync(filePath, 'utf8');

            // Execute SQL
            const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

            if (error) {
                // Try direct query approach
                const statements = sql
                    .split(';')
                    .map(s => s.trim())
                    .filter(s => s.length > 0 && !s.startsWith('--'));

                let success = true;
                for (const statement of statements) {
                    try {
                        const { error: stmtError } = await supabase.from('_migrations_temp').select('*').limit(0);
                        // If we get here, we can try a workaround
                    } catch (e) {
                        // Expected - table doesn't exist
                    }
                }

                // If exec_sql doesn't work, migrations need to be run via dashboard
                console.log(`   ⚠️  Cannot run via API - use Supabase Dashboard SQL Editor`);
                console.log(`   📋 Copy SQL from: ${filePath}`);
            } else {
                console.log(`   ✅ Success`);
            }

        } catch (error: any) {
            console.log(`   ⚠️  Error: ${error.message}`);
            console.log(`   📋 Run manually in Supabase Dashboard SQL Editor`);
        }
    }

    console.log("\n══════════════════════════════════════════════════");
    console.log("📝 If migrations failed, run them manually:");
    console.log("   1. Go to https://supabase.com/dashboard");
    console.log("   2. Select project: exteehwwpcbibttpvswx");
    console.log("   3. Go to SQL Editor");
    console.log("   4. Copy/paste each migration file and run");
    console.log("\n📁 Migration files:");
    for (const file of MIGRATIONS) {
        console.log(`   - supabase/migrations/${file}`);
    }
}

// Alternative: Print SQL for manual execution
async function printMigrationSQL() {
    console.log("\n📋 SQL MIGRATIONS TO RUN MANUALLY");
    console.log("══════════════════════════════════════════════════\n");
    console.log("Copy each section and run in Supabase SQL Editor:\n");

    const migrationsDir = path.resolve(__dirname, '../../supabase/migrations');

    for (const migrationFile of MIGRATIONS) {
        const filePath = path.join(migrationsDir, migrationFile);

        if (!fs.existsSync(filePath)) {
            console.log(`-- ${migrationFile} - FILE NOT FOUND\n`);
            continue;
        }

        const sql = fs.readFileSync(filePath, 'utf8');

        console.log(`-- =====================================================`);
        console.log(`-- ${migrationFile}`);
        console.log(`-- =====================================================\n`);
        console.log(sql);
        console.log(`\n`);
    }
}

// Check command line args
if (process.argv.includes('--print')) {
    printMigrationSQL();
} else {
    runMigrations();
}
