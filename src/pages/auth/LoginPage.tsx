import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { supabase } from '@/integrations/supabase/client'
import { Loader2, Eye, EyeOff } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: LoginForm) => {
    console.log('🔄 Iniciando proceso de login...', { email: values.email })
    setIsLoading(true)
    setError(null)
    setDebugInfo(null)

    try {
      // 1. Verificar conexión a Supabase
      console.log('🔗 Verificando conexión a Supabase...')
      const { data: testData, error: testError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)
      
      if (testError) {
        console.error('❌ Error de conexión a Supabase:', testError)
        throw new Error('Error de conexión a la base de datos')
      }
      console.log('✅ Conexión a Supabase exitosa')

      // 2. Intentar autenticación
      console.log('🔐 Intentando autenticación...')
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      console.log('📊 Resultado de autenticación:', { 
        user: authData.user?.id, 
        session: !!authData.session,
        error: authError 
      })

      if (authError) {
        console.error('❌ Error de autenticación:', authError)
        
        // Mensajes de error más amigables
        switch (authError.message) {
          case 'Invalid login credentials':
            setError('Email o contraseña incorrectos')
            break
          case 'Email not confirmed':
            setError('Por favor, confirma tu email antes de iniciar sesión')
            break
          case 'Too many requests':
            setError('Demasiados intentos. Intenta de nuevo en unos minutos')
            break
          default:
            setError(authError.message)
        }
        return
      }

      if (!authData.user) {
        console.error('❌ No se recibió información del usuario')
        setError('Error en la autenticación. Intenta de nuevo.')
        return
      }

      console.log('✅ Autenticación exitosa, usuario:', authData.user.id)

      // 3. Obtener perfil del usuario
      console.log('👤 Obteniendo perfil del usuario...')
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authData.user.id)
        .single()

      if (profileError) {
        console.error('❌ Error obteniendo perfil:', profileError)
        if (profileError.code === 'PGRST116') {
          console.log('📝 Perfil no encontrado, redirigiendo a completar perfil')
          navigate('/auth')
          return
        }
        setError('Error obteniendo datos del perfil')
        return
      }

      console.log('✅ Perfil obtenido:', { id: profile.id, role: profile.role })

      setDebugInfo({
        user: authData.user.id,
        profile: profile,
        session: !!authData.session
      })

      // 4. Redireccionar según rol
      const from = (location.state as any)?.from?.pathname || '/'
      let redirectPath = from

      if (from === '/') {
        switch (profile.role) {
          case 'coach':
            redirectPath = '/coach/dashboard'
            break
          case 'client':
            redirectPath = '/client/dashboard'
            break
          case 'admin':
            redirectPath = '/admin/dashboard'
            break
          default:
            redirectPath = '/'
        }
      }

      console.log('🚀 Redirigiendo a:', redirectPath)
      navigate(redirectPath, { replace: true })

    } catch (err: any) {
      console.error('💥 Error inesperado:', err)
      setError(err.message || 'Error inesperado. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
            <CardDescription className="text-center">
              Ingresa tu email y contraseña para acceder
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="tu@email.com"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Tu contraseña"
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </Button>
              </form>
            </Form>

            {/* Debug Info - Solo en desarrollo */}
            {debugInfo && import.meta.env.DEV && (
              <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
                <strong>Debug Info:</strong>
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            )}

            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">¿No tienes cuenta? </span>
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => navigate('/auth')}
              >
                Regístrate aquí
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Botones de testing - Solo en desarrollo */}
        {import.meta.env.DEV && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Testing (Solo desarrollo)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  const { data, error } = await supabase.auth.getSession()
                  console.log('Sesión actual:', { data, error })
                }}
                className="w-full"
              >
                Ver Sesión Actual
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  const { data, error } = await supabase.from('profiles').select('*').limit(5)
                  console.log('Test DB:', { data, error })
                }}
                className="w-full"
              >
                Test Database
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  form.setValue('email', 'coach@test.com')
                  form.setValue('password', 'test123456')
                }}
                className="w-full"
              >
                Llenar Datos Test
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}