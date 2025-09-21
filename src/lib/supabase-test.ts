import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export async function testSupabaseConnection() {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase.from('profiles').select('count');
    
    if (error) {
      console.error('❌ Supabase connection failed:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful:', { data });
    
    // Test authentication state
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.warn('⚠️ Auth check failed:', authError);
    } else {
      console.log('👤 Current user:', user ? user.email : 'No user logged in');
    }
    
    // Test coaches table
    const { data: coachData, error: coachError } = await supabase
      .from('coaches')
      .select('count');
      
    if (coachError) {
      console.error('❌ Coaches table error:', coachError);
    } else {
      console.log('✅ Coaches table accessible:', { coachData });
    }
    
    return true;
  } catch (err) {
    console.error('❌ Supabase connection failed with exception:', err);
    return false;
  }
}

// Test individual table access
export async function testTableAccess(tableName: keyof Database['public']['Tables']) {
  try {
    const { data, error } = await supabase.from(tableName).select('count');
    
    if (error) {
      console.error(`❌ Table '${tableName}' access failed:`, error);
      return false;
    }
    
    console.log(`✅ Table '${tableName}' accessible:`, data);
    return true;
  } catch (err) {
    console.error(`❌ Table '${tableName}' access failed with exception:`, err);
    return false;
  }
}

// Test all CoachWave tables
export async function testAllTables() {
  console.log('🔍 Testing all CoachWave tables...');
  
  const tables: (keyof Database['public']['Tables'])[] = [
    'profiles',
    'coaches', 
    'bookings',
    'reviews',
    'offerings',
    'faq'
  ];
  
  const results: Record<string, boolean> = {};
  
  for (const table of tables) {
    results[table] = await testTableAccess(table);
  }
  
  console.log('📊 Table access summary:', results);
  
  const allSuccess = Object.values(results).every(result => result);
  console.log(allSuccess ? '✅ All tables accessible!' : '⚠️ Some tables have issues');
  
  return results;
}

// Comprehensive connection test
export async function runFullDiagnostic() {
  console.log('🚀 Running full CoachWave diagnostic...');
  
  const connectionOk = await testSupabaseConnection();
  const tableResults = await testAllTables();
  
  console.log('📋 Diagnostic Summary:');
  console.log('- Connection:', connectionOk ? '✅ OK' : '❌ Failed');
  console.log('- Tables:', Object.entries(tableResults).map(([table, ok]) => 
    `  ${table}: ${ok ? '✅' : '❌'}`
  ).join('\n'));
  
  return {
    connectionOk,
    tableResults,
    allGood: connectionOk && Object.values(tableResults).every(r => r)
  };
}

// Auto-run diagnostic in development
if (import.meta.env.DEV && import.meta.env.VITE_DEBUG) {
  console.log('🔧 Development mode: Auto-running Supabase diagnostic...');
  setTimeout(() => runFullDiagnostic(), 1000);
}