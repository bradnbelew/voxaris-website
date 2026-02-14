/**
 * Roofing Pros USA - Demo Reset Script
 *
 * Clears all demo data and resets the system to a clean state.
 * Run this 30 minutes before every demo.
 *
 * Usage: npx ts-node scripts/roofing/demo-reset.ts
 *
 * WARNING: This script deletes data. Only run against demo/staging environment.
 */

import dotenv from 'dotenv';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

interface ResetResult {
  step: string;
  success: boolean;
  deleted?: number;
  error?: string;
}

const results: ResetResult[] = [];

async function logResult(step: string, fn: () => Promise<{ deleted?: number }>): Promise<void> {
  try {
    const result = await fn();
    results.push({ step, success: true, deleted: result.deleted });
    console.log(`✅ ${step}: ${result.deleted || 0} records`);
  } catch (error: any) {
    results.push({ step, success: false, error: error.message });
    console.log(`❌ ${step}: ${error.message}`);
  }
}

async function main() {
  console.log('\n🧹 Roofing Pros USA - Demo Reset\n');
  console.log('═'.repeat(50));
  console.log(`📍 Supabase: ${SUPABASE_URL}`);
  console.log(`📍 Backend: ${BASE_URL}`);
  console.log('═'.repeat(50));

  // Safety check: Require confirmation
  const args = process.argv.slice(2);
  if (!args.includes('--confirm')) {
    console.log('\n⚠️  This script will DELETE all demo data!');
    console.log('   Run with --confirm to proceed.\n');
    console.log('   npx ts-node scripts/roofing/demo-reset.ts --confirm\n');
    process.exit(0);
  }

  console.log('\n📊 Clearing demo data...\n');

  // 1. Clear call_logs (keep last 24 hours of real data if any)
  await logResult('Clear call_logs (test calls)', async () => {
    const { data, error } = await supabase
      .from('call_logs')
      .delete()
      .like('call_id', 'test-%')
      .select('id');

    if (error) throw error;
    return { deleted: data?.length || 0 };
  });

  // 2. Clear test leads
  await logResult('Clear leads (test entries)', async () => {
    const { data, error } = await supabase
      .from('leads')
      .delete()
      .or('source.eq.integration_test,source.eq.demo_script,source.eq.manual_restart')
      .select('id');

    if (error) throw error;
    return { deleted: data?.length || 0 };
  });

  // 3. Clear test DNC entries
  await logResult('Clear DNC list (test entries)', async () => {
    const { data, error } = await supabase
      .from('dnc_list')
      .delete()
      .eq('source', 'integration_test')
      .select('id');

    if (error) throw error;
    return { deleted: data?.length || 0 };
  });

  // 4. Clear error logs older than 7 days
  await logResult('Clear old error logs (>7 days)', async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data, error } = await supabase
      .from('error_logs')
      .delete()
      .lt('created_at', sevenDaysAgo.toISOString())
      .select('id');

    if (error) throw error;
    return { deleted: data?.length || 0 };
  });

  // 5. Clear video sessions (test entries)
  await logResult('Clear video_sessions (test entries)', async () => {
    const { data, error } = await supabase
      .from('video_sessions')
      .delete()
      .like('session_id', 'test-%')
      .select('id');

    if (error) throw error;
    return { deleted: data?.length || 0 };
  });

  // 6. Verify health
  console.log('\n🔍 Verifying system health...\n');

  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    const health = await response.json();

    console.log(`   Status: ${health.status}`);
    console.log(`   Uptime: ${health.uptime}s`);
    console.log(`   Services:`);
    for (const [service, status] of Object.entries(health.services || {})) {
      console.log(`     - ${service}: ${status}`);
    }

    if (health.status === 'ok') {
      results.push({ step: 'Health check', success: true });
      console.log('\n✅ Health check passed');
    } else {
      results.push({ step: 'Health check', success: false, error: `Status: ${health.status}` });
      console.log('\n⚠️ System is degraded');
    }
  } catch (error: any) {
    results.push({ step: 'Health check', success: false, error: error.message });
    console.log(`\n❌ Health check failed: ${error.message}`);
  }

  // Summary
  console.log('\n' + '═'.repeat(50));
  console.log('📊 RESET SUMMARY');
  console.log('═'.repeat(50));

  const passed = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log(`\n✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);

  if (failed > 0) {
    console.log('\nFailed steps:');
    results.filter((r) => !r.success).forEach((r) => {
      console.log(`   - ${r.step}: ${r.error}`);
    });
  }

  console.log('\n🎉 Demo environment is ready!\n');
  console.log('Next steps:');
  console.log('   1. Run demo-seed.ts to add sample data');
  console.log('   2. Verify agents in Retell dashboard');
  console.log('   3. Test with a quick call\n');

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('❌ Reset failed:', err.message);
  process.exit(1);
});
