import { supabase } from '@/integrations/supabase/client';
import { testSupabaseConnection, runFullDiagnostic } from './supabase-test';
import { createTestUser, cleanupTestUser } from '@/scripts/create-test-user';
import { createSampleUsers, cleanupSampleUsers } from '@/scripts/create-sample-users';

// Comandos de debugging para la consola del navegador
export const debugCommands = {
  // Verificaciones básicas
  async checkSession() {
    console.log('📱 Verificando sesión actual...');
    const { data, error } = await supabase.auth.getSession();
    console.log('Sesión:', { 
      user: data.session?.user?.email || 'No user', 
      expires: data.session?.expires_at,
      error: error?.message 
    });
    return { data, error };
  },

  async checkUser() {
    console.log('👤 Verificando usuario actual...');
    const { data, error } = await supabase.auth.getUser();
    console.log('Usuario:', { 
      user: data.user?.email || 'No user',
      id: data.user?.id,
      error: error?.message 
    });
    return { data, error };
  },

  async testConnection() {
    console.log('🔗 Probando conexión a Supabase...');
    return await testSupabaseConnection();
  },

  async runDiagnostic() {
    console.log('🚀 Ejecutando diagnóstico completo...');
    return await runFullDiagnostic();
  },

  // Gestión de usuario de prueba
  async createTestUser() {
    console.log('👤 Creando usuario de prueba...');
    return await createTestUser();
  },

  async cleanupTestUser() {
    console.log('🧹 Limpiando usuario de prueba...');
    return await cleanupTestUser();
  },

  // Gestión de usuarios de muestra con roles
  async createSampleUsers() {
    console.log('👥 Creando usuarios de muestra con todos los roles...');
    return await createSampleUsers();
  },

  async cleanupSampleUsers() {
    console.log('🧹 Limpiando usuarios de muestra...');
    return await cleanupSampleUsers();
  },

  async checkAllUsers() {
    console.log('👥 Verificando todos los usuarios y roles...');
    const { data, error } = await supabase
      .from('profiles')
      .select('email, role, full_name, display_name, created_at')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error obteniendo usuarios:', error);
      return { data: null, error };
    }
    
    console.log('📊 Usuarios existentes:');
    console.table(data);
    
    // Contar usuarios por rol
    const roleCount = data.reduce((acc: Record<string, number>, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});
    
    console.log('📈 Usuarios por rol:');
    console.table(roleCount);
    
    return { data, error: null };
  },

  // Verificaciones de base de datos
  async checkTables() {
    console.log('📋 Verificando tablas principales...');
    
    const tables = ['profiles', 'coach_profiles', 'sessions', 'reviews', 'categories'];
    const results: Record<string, any> = {};
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table as any).select('*').limit(1);
        results[table] = { 
          accessible: !error, 
          error: error?.message,
          sampleCount: data?.length || 0
        };
      } catch (err) {
        results[table] = { accessible: false, error: err };
      }
    }
    
    console.table(results);
    return results;
  },

  async checkCoachProfiles() {
    console.log('🎯 Verificando perfiles de coach...');
    const { data, error } = await supabase
      .from('coaches')
      .select(`
        id,
        display_name,
        bio,
        is_published,
        whatsapp_enabled,
        profiles (
          full_name,
          role
        )
      `)
      .limit(10);
    
    console.log('Coach profiles:', { data, error });
    return { data, error };
  },

  async checkBookings() {
    console.log('📅 Verificando reservas...');
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .limit(10);
    
    console.log('Bookings:', { data, error });
    return { data, error };
  },

  // Verificaciones de autenticación
  async testLogin(email = 'coach@test.com', password = 'test123456') {
    console.log('🔐 Probando login con credenciales de prueba...');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    console.log('Login result:', {
      success: !!data.user,
      user: data.user?.email,
      error: error?.message
    });
    
    return { data, error };
  },

  async logout() {
    console.log('🚪 Cerrando sesión...');
    const { error } = await supabase.auth.signOut();
    console.log('Logout:', { success: !error, error: error?.message });
    return { error };
  },

  // Verificaciones de entorno
  checkEnvVars() {
    console.log('🔧 Verificando variables de entorno...');
    
    const vars = {
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
      NODE_ENV: import.meta.env.MODE,
      DEV: import.meta.env.DEV,
      VITE_DEBUG: import.meta.env.VITE_DEBUG
    };
    
    console.table(vars);
    return vars;
  },

  // Helper para mostrar ayuda
  help() {
    console.log(`
🔧 COMANDOS DE DEBUG DISPONIBLES:

📱 Sesión y Usuario:
  debugCommands.checkSession()     - Ver sesión actual
  debugCommands.checkUser()        - Ver usuario actual
  debugCommands.testLogin()        - Probar login con usuario test
  debugCommands.logout()           - Cerrar sesión

🔗 Conexión y Diagnóstico:
  debugCommands.testConnection()   - Probar conexión a Supabase
  debugCommands.runDiagnostic()    - Diagnóstico completo
  debugCommands.checkEnvVars()     - Verificar variables de entorno

📋 Base de Datos:
  debugCommands.checkTables()      - Verificar todas las tablas
  debugCommands.checkCoachProfiles() - Ver perfiles de coach
  debugCommands.checkBookings()    - Ver reservas

👥 Usuarios y Roles:
  debugCommands.checkAllUsers()    - Ver todos los usuarios y roles
  debugCommands.createSampleUsers() - Crear usuarios de muestra (TODOS LOS ROLES)
  debugCommands.cleanupSampleUsers() - Limpiar usuarios de muestra

👤 Usuario de Prueba:
  debugCommands.createTestUser()   - Crear usuario coach@test.com
  debugCommands.cleanupTestUser()  - Limpiar usuario de prueba

❓ Ayuda:
  debugCommands.help()             - Mostrar esta ayuda

🎯 USUARIOS DE MUESTRA INCLUYE:
  • admin@maestrocoach.com (admin123456) - Administrador
  • coach@maestrocoach.com (coach123456) - Coach 
  • client@maestrocoach.com (client123456) - Cliente
  • psychologist@maestrocoach.com (psych123456) - Psicólogo
  • staff@maestrocoach.com (staff123456) - Staff
    `);
  }
};

// Exponer comandos globalmente en desarrollo
if (import.meta.env.DEV) {
  (window as any).debugCommands = debugCommands;
  (window as any).supabase = supabase;
  (window as any).createSampleUsers = createSampleUsers;
  (window as any).cleanupSampleUsers = cleanupSampleUsers;
  
  console.log('🔧 Debug commands disponibles en la consola:');
  console.log('👉 Ejecuta debugCommands.help() para ver todos los comandos');
  console.log('👉 Crear usuarios con roles: debugCommands.createSampleUsers()');
  console.log('👉 Verificar usuarios: debugCommands.checkAllUsers()');
  console.log('👉 Diagnóstico completo: debugCommands.runDiagnostic()');
}