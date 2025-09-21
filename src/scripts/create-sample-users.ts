/**
 * Script to create sample users for each role type
 * This creates real authenticated users with corresponding profiles
 */

import { supabase } from '@/integrations/supabase/client';

interface SampleUser {
  email: string;
  password: string;
  full_name: string;
  handle: string;
  role: 'admin' | 'coach' | 'psychologist' | 'staff' | 'client';
  display_name: string;
  bio: string;
  phone: string;
}

const sampleUsers: SampleUser[] = [
  {
    email: 'admin@maestrocoach.com',
    password: 'admin123456',
    full_name: 'María Rodríguez',
    handle: 'maria_admin',
    role: 'admin',
    display_name: 'María R.',
    bio: 'Administradora del sistema de coaching',
    phone: '+34 600 123 456'
  },
  {
    email: 'coach@maestrocoach.com',
    password: 'coach123456',
    full_name: 'Carlos Sánchez',
    handle: 'carlos_coach',
    role: 'coach',
    display_name: 'Carlos S.',
    bio: 'Coach especializado en liderazgo y desarrollo personal con 10 años de experiencia',
    phone: '+34 600 234 567'
  },
  {
    email: 'psychologist@maestrocoach.com',
    password: 'psych123456',
    full_name: 'Dr. Ana López',
    handle: 'ana_psychologist',
    role: 'psychologist',
    display_name: 'Dra. Ana L.',
    bio: 'Psicóloga clínica especializada en terapia cognitivo-conductual',
    phone: '+34 600 345 678'
  },
  {
    email: 'staff@maestrocoach.com',
    password: 'staff123456',
    full_name: 'Laura Martín',
    handle: 'laura_staff',
    role: 'staff',
    display_name: 'Laura M.',
    bio: 'Coordinadora de servicios de apoyo al cliente',
    phone: '+34 600 456 789'
  },
  {
    email: 'client@maestrocoach.com',
    password: 'client123456',
    full_name: 'Juan Pérez',
    handle: 'juan_client',
    role: 'client',
    display_name: 'Juan P.',
    bio: 'Cliente interesado en coaching de carrera profesional',
    phone: '+34 600 567 890'
  }
];

export async function createSampleUsers() {
  console.log('🚀 Creando usuarios de ejemplo...');

  for (const userData of sampleUsers) {
    try {
      console.log(`📧 Creando usuario: ${userData.email}`);

      // Create user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (authError) {
        if (authError.message.includes('already been registered')) {
          console.log(`⚠️ Usuario ${userData.email} ya existe, actualizando perfil...`);
          
          // Sign in to get the user
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: userData.email,
            password: userData.password
          });

          if (signInError) {
            console.error(`❌ Error al iniciar sesión con ${userData.email}:`, signInError);
            continue;
          }

          if (signInData.user) {
            // Update existing profile
            const { error: updateError } = await supabase
              .from('profiles')
              .update({
                full_name: userData.full_name,
                handle: userData.handle,
                role: userData.role,
                display_name: userData.display_name,
                bio: userData.bio,
                phone: userData.phone,
                timezone: 'Europe/Madrid',
                is_active: true
              })
              .eq('user_id', signInData.user.id);

            if (updateError) {
              console.error(`❌ Error actualizando perfil para ${userData.email}:`, updateError);
            } else {
              console.log(`✅ Perfil actualizado para ${userData.email}`);
            }
          }
        } else {
          console.error(`❌ Error creando usuario ${userData.email}:`, authError);
        }
        continue;
      }

      if (authData.user) {
        console.log(`✅ Usuario creado: ${userData.email}`);
        
        // Wait a bit for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Update the profile with additional data
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            full_name: userData.full_name,
            handle: userData.handle,
            role: userData.role,
            display_name: userData.display_name,
            bio: userData.bio,
            phone: userData.phone,
            timezone: 'Europe/Madrid',
            is_active: true
          })
          .eq('user_id', authData.user.id);

        if (updateError) {
          console.error(`❌ Error actualizando perfil para ${userData.email}:`, updateError);
        } else {
          console.log(`✅ Perfil configurado para ${userData.email} como ${userData.role}`);
        }
      }

    } catch (error) {
      console.error(`❌ Error general creando ${userData.email}:`, error);
    }
  }

  console.log('🎉 ¡Usuarios de ejemplo creados!');
  console.log('📝 Puedes usar estos credenciales para probar:');
  sampleUsers.forEach(user => {
    console.log(`${user.role.toUpperCase()}: ${user.email} / ${user.password}`);
  });
}

// Export individual functions for testing specific roles
export async function createAdminUser() {
  return createSampleUsers();
}

// Helper function to clean up test users
export async function cleanupSampleUsers() {
  console.log('🧹 Limpiando usuarios de ejemplo...');
  
  for (const userData of sampleUsers) {
    try {
      const { data: signInData } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: userData.password
      });

      if (signInData.user) {
        // Delete user profile
        await supabase
          .from('profiles')
          .delete()
          .eq('user_id', signInData.user.id);
        
        console.log(`✅ Perfil eliminado para ${userData.email}`);
      }
    } catch (error) {
      console.log(`⚠️ No se pudo limpiar ${userData.email}`);
    }
  }
}

// Auto-execute in development
if (import.meta.env.DEV) {
  // Expose functions to window for manual execution
  (window as any).createSampleUsers = createSampleUsers;
  (window as any).cleanupSampleUsers = cleanupSampleUsers;
  
  console.log('🔧 Funciones disponibles en consola:');
  console.log('- createSampleUsers() - Crear usuarios de ejemplo');
  console.log('- cleanupSampleUsers() - Limpiar usuarios de ejemplo');
}