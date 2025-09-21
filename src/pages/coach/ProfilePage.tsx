import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Camera, 
  Save,
  Star,
  Calendar,
  Users,
  Award,
  MapPin,
  Phone,
  Mail,
  Globe,
  Plus
} from 'lucide-react';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Ana García',
    email: 'ana.garcia@coachwave.com',
    phone: '+34 600 123 456',
    location: 'Madrid, España',
    website: 'www.anagarcia.coach',
    bio: 'Coach profesional especializada en desarrollo de liderazgo y crecimiento personal con más de 8 años de experiencia ayudando a profesionales a alcanzar su máximo potencial.',
    specializations: ['Liderazgo', 'Desarrollo Personal', 'Coaching Ejecutivo'],
    languages: ['Español', 'Inglés', 'Francés'],
    experience: '8 años',
    certification: 'ICF ACC Certified',
    hourlyRate: '75'
  });

  const stats = [
    { label: 'Clientes Atendidos', value: '142', icon: Users },
    { label: 'Sesiones Realizadas', value: '1,248', icon: Calendar },
    { label: 'Valoración Promedio', value: '4.9', icon: Star },
    { label: 'Años de Experiencia', value: '8', icon: Award }
  ];

  const testimonials = [
    {
      id: '1',
      clientName: 'Carlos Mendoza',
      content: 'Excelente profesional. Me ayudó a desarrollar mis habilidades de liderazgo.',
      rating: 5,
      date: 'Hace 1 semana'
    },
    {
      id: '2',
      clientName: 'Laura Sánchez',
      content: 'Su enfoque personalizado y empatía son excepcionales.',
      rating: 5,
      date: 'Hace 2 semanas'
    }
  ];

  const handleSave = () => {
    // Aquí guardarías los datos del perfil
    console.log('Guardando perfil:', profileData);
    setIsEditing(false);
  };

  const addSpecialization = () => {
    // Lógica para agregar especialización
    console.log('Agregar especialización');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground">
            Gestiona tu información profesional
          </p>
        </div>
        <Button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          variant={isEditing ? 'default' : 'outline'}
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </>
          ) : (
            'Editar Perfil'
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/api/placeholder/96/96" />
                  <AvatarFallback className="text-2xl">AG</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button 
                    size="sm" 
                    className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-bold">{profileData.name}</h2>
                <p className="text-muted-foreground">{profileData.certification}</p>
                <div className="flex items-center justify-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">4.9</span>
                  <span className="text-muted-foreground">(142 reseñas)</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{profileData.location}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{profileData.experience} de experiencia</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {profileData.specializations.map((spec, index) => (
                  <Badge key={index} variant="secondary">{spec}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-4 text-center">
                  <stat.icon className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Profile Tabs */}
          <Tabs defaultValue="information" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="information">Información</TabsTrigger>
              <TabsTrigger value="testimonials">Reseñas</TabsTrigger>
              <TabsTrigger value="settings">Configuración</TabsTrigger>
            </TabsList>

            <TabsContent value="information" className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          value={profileData.email}
                          disabled={!isEditing}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={profileData.phone}
                          disabled={!isEditing}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Ubicación</Label>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="location"
                          value={profileData.location}
                          disabled={!isEditing}
                          onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Sitio Web</Label>
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="website"
                          value={profileData.website}
                          disabled={!isEditing}
                          onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Información Profesional</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biografía</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      disabled={!isEditing}
                      rows={4}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Especializaciones</Label>
                    <div className="flex flex-wrap gap-2">
                      {profileData.specializations.map((spec, index) => (
                        <Badge key={index} variant="outline">{spec}</Badge>
                      ))}
                      {isEditing && (
                        <Button variant="outline" size="sm" onClick={addSpecialization}>
                          <Plus className="h-3 w-3 mr-1" />
                          Agregar
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="experience">Años de Experiencia</Label>
                      <Input
                        id="experience"
                        value={profileData.experience}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rate">Tarifa por Hora (€)</Label>
                      <Input
                        id="rate"
                        value={profileData.hourlyRate}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, hourlyRate: e.target.value})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="testimonials" className="space-y-4">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{testimonial.clientName}</h4>
                          <div className="flex space-x-1">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground">{testimonial.content}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{testimonial.date}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">
                    Configuración del perfil - En desarrollo
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;