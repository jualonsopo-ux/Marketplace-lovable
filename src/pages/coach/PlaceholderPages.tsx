import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  BookOpen, 
  BarChart3, 
  FileText, 
  CreditCard, 
  Settings, 
  Shield, 
  HelpCircle 
} from 'lucide-react';

// Client Detail Page
export const ClientDetailPage = () => (
  <div className="p-6 space-y-6">
    <div className="flex items-center space-x-4">
      <Button variant="outline" size="sm">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver
      </Button>
      <div>
        <h1 className="text-3xl font-bold">Detalle del Cliente</h1>
        <p className="text-muted-foreground">Información completa del cliente</p>
      </div>
    </div>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          Cliente - En desarrollo
        </CardTitle>
        <CardDescription>Esta página está en construcción</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Aquí se mostrará la información detallada del cliente, su historial de sesiones,
          progreso, objetivos y más funcionalidades.
        </p>
      </CardContent>
    </Card>
  </div>
);

// New Session Page
export const NewSessionPage = () => (
  <div className="p-6 space-y-6">
    <div className="flex items-center space-x-4">
      <Button variant="outline" size="sm">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver
      </Button>
      <div>
        <h1 className="text-3xl font-bold">Nueva Sesión</h1>
        <p className="text-muted-foreground">Programa una nueva sesión de coaching</p>
      </div>
    </div>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Programar Sesión - En desarrollo
        </CardTitle>
        <CardDescription>Esta página está en construcción</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Aquí podrás programar nuevas sesiones, seleccionar cliente, fecha, hora,
          tipo de sesión y configurar recordatorios.
        </p>
      </CardContent>
    </Card>
  </div>
);

// Session Detail Page
export const SessionDetailPage = () => (
  <div className="p-6 space-y-6">
    <div className="flex items-center space-x-4">
      <Button variant="outline" size="sm">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver
      </Button>
      <div>
        <h1 className="text-3xl font-bold">Detalle de Sesión</h1>
        <p className="text-muted-foreground">Información completa de la sesión</p>
      </div>
    </div>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Sesión - En desarrollo
        </CardTitle>
        <CardDescription>Esta página está en construcción</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Aquí se mostrará el detalle de la sesión, notas, objetivos trabajados,
          recursos utilizados y seguimiento del progreso.
        </p>
      </CardContent>
    </Card>
  </div>
);

// New Program Page
export const NewProgramPage = () => (
  <div className="p-6 space-y-6">
    <div className="flex items-center space-x-4">
      <Button variant="outline" size="sm">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver
      </Button>
      <div>
        <h1 className="text-3xl font-bold">Nuevo Programa</h1>
        <p className="text-muted-foreground">Crea un nuevo programa de coaching</p>
      </div>
    </div>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          Crear Programa - En desarrollo
        </CardTitle>
        <CardDescription>Esta página está en construcción</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Aquí podrás crear programas personalizados de coaching con objetivos,
          módulos, recursos y seguimiento estructurado.
        </p>
      </CardContent>
    </Card>
  </div>
);

// Program Detail Page
export const ProgramDetailPage = () => (
  <div className="p-6 space-y-6">
    <div className="flex items-center space-x-4">
      <Button variant="outline" size="sm">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver
      </Button>
      <div>
        <h1 className="text-3xl font-bold">Detalle del Programa</h1>
        <p className="text-muted-foreground">Información completa del programa</p>
      </div>
    </div>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          Programa - En desarrollo
        </CardTitle>
        <CardDescription>Esta página está en construcción</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Aquí se mostrará el detalle completo del programa, módulos, progreso
          de los participantes y métricas de efectividad.
        </p>
      </CardContent>
    </Card>
  </div>
);

// Analytics Page
export const AnalyticsPage = () => (
  <div className="p-6 space-y-6">
    <div>
      <h1 className="text-3xl font-bold">Analytics Avanzados</h1>
      <p className="text-muted-foreground">Métricas detalladas de tu práctica de coaching</p>
    </div>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Analytics - En desarrollo
        </CardTitle>
        <CardDescription>Esta página está en construcción</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Aquí encontrarás métricas avanzadas sobre tus clientes, sesiones,
          efectividad de programas y insights para mejorar tu práctica.
        </p>
      </CardContent>
    </Card>
  </div>
);

// Resources Page
export const ResourcesPage = () => (
  <div className="p-6 space-y-6">
    <div>
      <h1 className="text-3xl font-bold">Recursos</h1>
      <p className="text-muted-foreground">Biblioteca de recursos para coaching</p>
    </div>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Recursos - En desarrollo
        </CardTitle>
        <CardDescription>Esta página está en construcción</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Aquí podrás gestionar recursos, plantillas, ejercicios y materiales
          para usar en tus sesiones de coaching.
        </p>
      </CardContent>
    </Card>
  </div>
);

// Billing Page
export const BillingPage = () => (
  <div className="p-6 space-y-6">
    <div>
      <h1 className="text-3xl font-bold">Facturación</h1>
      <p className="text-muted-foreground">Gestiona tus ingresos y facturación</p>
    </div>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Facturación - En desarrollo
        </CardTitle>
        <CardDescription>Esta página está en construcción</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Aquí podrás ver tus ingresos, generar facturas, gestionar pagos
          y configurar tarifas para tus servicios.
        </p>
      </CardContent>
    </Card>
  </div>
);

// Settings Page
export const SettingsPage = () => (
  <div className="p-6 space-y-6">
    <div>
      <h1 className="text-3xl font-bold">Configuración</h1>
      <p className="text-muted-foreground">Ajustes generales de la aplicación</p>
    </div>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Configuración - En desarrollo
        </CardTitle>
        <CardDescription>Esta página está en construcción</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Aquí podrás configurar notificaciones, preferencias de la aplicación,
          integraciones y otros ajustes generales.
        </p>
      </CardContent>
    </Card>
  </div>
);

// Security Page
export const SecurityPage = () => (
  <div className="p-6 space-y-6">
    <div>
      <h1 className="text-3xl font-bold">Seguridad</h1>
      <p className="text-muted-foreground">Configuración de seguridad y privacidad</p>
    </div>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Seguridad - En desarrollo
        </CardTitle>
        <CardDescription>Esta página está en construcción</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Aquí podrás gestionar tu contraseña, autenticación de dos factores,
          permisos de acceso y configuración de privacidad.
        </p>
      </CardContent>
    </Card>
  </div>
);

// Help Page
export const HelpPage = () => (
  <div className="p-6 space-y-6">
    <div>
      <h1 className="text-3xl font-bold">Ayuda y Soporte</h1>
      <p className="text-muted-foreground">Centro de ayuda y documentación</p>
    </div>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <HelpCircle className="h-5 w-5 mr-2" />
          Ayuda - En desarrollo
        </CardTitle>
        <CardDescription>Esta página está en construcción</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Aquí encontrarás guías de uso, preguntas frecuentes, tutoriales
          y opciones para contactar con el soporte técnico.
        </p>
      </CardContent>
    </Card>
  </div>
);