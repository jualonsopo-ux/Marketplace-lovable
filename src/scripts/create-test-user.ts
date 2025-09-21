import { supabase } from '@/integrations/supabase/client'

export async function createTestUser() {
  console.log('🔄 Creando usuario de prueba...')
  
  try {
    // 1. Crear usuario en auth
    console.log('👤 Creando usuario en auth...')
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'coach@test.com',
      password: 'test123456',
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          display_name: 'Coach Test',
          first_name: 'Coach',
          last_name: 'Test'
        }
      }
    })

    if (authError) {
      if (authError.message.includes('User already registered')) {
        console.log('⚠️ Usuario ya existe, intentando login...')
        
        // Intentar login si el usuario ya existe
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: 'coach@test.com',
          password: 'test123456'
        })
        
        if (loginError) {
          console.error('❌ Error en login:', loginError)
          return
        }
        
        console.log('✅ Login exitoso para usuario existente')
        return loginData
      }
      
      console.error('❌ Error creando usuario:', authError)
      return
    }

    console.log('✅ Usuario creado en auth:', authData.user?.id)

    // 2. Verificar si el perfil se creó automáticamente
    if (authData.user) {
      console.log('📋 Verificando perfil...')
      
      // Esperar un poco para que el trigger funcione
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', authData.user.id)
        .single()

      if (profileError && profileError.code === 'PGRST116') {
        console.log('📝 Perfil no encontrado, creando manualmente...')
        
        // Crear perfil manualmente si no existe
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            auth_user_id: authData.user.id,
            full_name: 'Coach Test',
            handle: 'coach-test',
            email: authData.user.email || 'coach@test.com',
            role: 'coach',
            is_active: true
          })

        if (insertError) {
          console.error('❌ Error creando perfil:', insertError)
          return
        } else {
          console.log('✅ Perfil creado manualmente')
        }
      } else if (profileError) {
        console.error('❌ Error verificando perfil:', profileError)
        return
      } else {
        console.log('✅ Perfil encontrado:', profile)
        
        // Actualizar rol a coach si es necesario
        if (profile.role !== 'coach') {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'coach' })
            .eq('auth_user_id', authData.user.id)
            
          if (updateError) {
            console.error('❌ Error actualizando rol:', updateError)
          } else {
            console.log('✅ Rol actualizado a coach')
          }
        }
      }

      // 3. Crear perfil de coach
      console.log('🎯 Creando perfil de coach...')
      
      // Verificar si ya existe un coach
      const { data: existingCoach } = await supabase
        .from('coaches')
        .select('id')
        .eq('profile_id', authData.user.id)
        .single()
        
      if (!existingCoach) {
        const { error: coachError } = await supabase
          .from('coaches')
          .insert({
            profile_id: authData.user.id,
            display_name: 'Coach de Prueba',
            bio: 'Este es un coach de prueba para testing del sistema CoachWave. Especializado en coaching personal y ejecutivo.',
            specialties: ['coaching-personal', 'coaching-ejecutivo'],
            languages: ['es', 'en'],
            is_published: true,
            whatsapp_enabled: true
          })

        if (coachError) {
          console.error('❌ Error creando perfil de coach:', coachError)
        } else {
          console.log('✅ Perfil de coach creado')
        }
      } else {
        console.log('ℹ️ Perfil de coach ya existe')
      }
      
      // 4. Skip session creation for now due to schema complexity
      console.log('ℹ️ Sesiones de prueba omitidas (schema complejo)')
      console.log('💡 Puedes crear sesiones manualmente desde el dashboard')
    }

    console.log('🎉 ¡Usuario de prueba creado exitosamente!')
    console.log('📧 Email: coach@test.com')
    console.log('🔑 Password: test123456')
    console.log('👤 Rol: coach')
    
    return authData
    
  } catch (error) {
    console.error('💥 Error inesperado:', error)
    throw error
  }
}

// Función para limpiar el usuario de prueba
export async function cleanupTestUser() {
  console.log('🧹 Limpiando usuario de prueba...')
  
  try {
    // Intentar login primero
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'coach@test.com',
      password: 'test123456'
    })
    
    if (loginData.user) {
      // Eliminar coaches
      await supabase
        .from('coaches')
        .delete()
        .eq('profile_id', loginData.user.id)
      
      // Eliminar bookings relacionadas
      await supabase
        .from('bookings')
        .delete()
        .eq('coach_id', loginData.user.id)
      
      // Eliminar profiles
      await supabase
        .from('profiles')
        .delete()
        .eq('auth_user_id', loginData.user.id)
      
      console.log('✅ Datos del usuario de prueba eliminados')
    }
  } catch (error) {
    console.error('❌ Error en cleanup:', error)
  }
}

// Auto-ejecutar en desarrollo si está habilitado
if (import.meta.env.DEV && import.meta.env.VITE_DEBUG) {
  // Exponer funciones globalmente para fácil acceso
  (window as any).createTestUser = createTestUser;
  (window as any).cleanupTestUser = cleanupTestUser;
  console.log('🔧 Funciones de test disponibles: createTestUser(), cleanupTestUser()');
}