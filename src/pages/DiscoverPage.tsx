import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CoachList } from '@/components/CoachList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Star, MapPin, Users } from 'lucide-react';
import { coaches, getFeaturedCoaches, getCoachesByCategory } from '@/data/coaches';

export function DiscoverPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || '';

  const handleViewProfile = (coachId: string) => {
    navigate(`/coaches/${coachId}`);
  };

  const handleBook = (coachId: string) => {
    navigate(`/coaches/${coachId}/book`);
  };

  // Get coaches based on category selection
  const getCoachesForTab = (tab: string) => {
    switch (tab) {
      case 'featured':
        return getFeaturedCoaches();
      case 'carrera':
        return getCoachesByCategory('Carrera');
      case 'bienestar':
        return getCoachesByCategory('Hábitos');
      case 'ansiedad':
        return coaches.filter(c => c.specialties.includes('Ansiedad') || c.specialties.includes('Estrés'));
      default:
        return coaches;
    }
  };

  const categories = [
    { 
      id: 'featured', 
      name: 'Destacados', 
      icon: Star, 
      count: getFeaturedCoaches().length,
      description: 'Los coaches mejor valorados de la plataforma'
    },
    { 
      id: 'carrera', 
      name: 'Carrera', 
      icon: TrendingUp, 
      count: getCoachesByCategory('Carrera').length,
      description: 'Desarrollo profesional y liderazgo'
    },
    { 
      id: 'bienestar', 
      name: 'Bienestar', 
      icon: Users, 
      count: getCoachesByCategory('Hábitos').length,
      description: 'Hábitos saludables y bienestar personal'
    },
    { 
      id: 'ansiedad', 
      name: 'Ansiedad', 
      icon: MapPin, 
      count: coaches.filter(c => c.specialties.includes('Ansiedad')).length,
      description: 'Especialistas en ansiedad y manejo del estrés',
      isProfessional: true
    },
  ];

  const [activeTab, setActiveTab] = useState(selectedCategory || 'featured');

  useEffect(() => {
    if (selectedCategory && selectedCategory !== activeTab) {
      setActiveTab(selectedCategory);
    }
  }, [selectedCategory]);

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <section className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Descubrir Coaches</h1>
        <p className="text-muted-foreground">
          Encuentra el coach perfecto para tus objetivos de crecimiento personal y profesional
        </p>
        {searchQuery && (
          <div className="flex items-center gap-2 mt-4">
            <span className="text-sm text-muted-foreground">Buscando:</span>
            <Badge variant="outline" className="font-normal">
              "{searchQuery}"
            </Badge>
          </div>
        )}
      </section>

      {/* Category Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Card 
              key={category.id} 
              className={`notion-card hover:notion-card-hover cursor-pointer transition-all duration-200 ${
                activeTab === category.id ? 'ring-2 ring-primary/20 bg-primary/5' : ''
              }`}
              onClick={() => setActiveTab(category.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${
                        category.isProfessional 
                          ? 'bg-purple-100 text-purple-600' 
                          : 'bg-primary/10 text-primary'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="font-medium">{category.name}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                  <Badge variant="secondary" className="ml-2 flex-shrink-0">
                    {category.count}
                  </Badge>
                </div>
                {category.isProfessional && (
                  <div className="mt-3">
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                      🏥 Profesionales sanitarios
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Category Tabs */}
      <section>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:inline-grid">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-2"
              >
                <category.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <category.icon className="h-5 w-5" />
                    Coaches de {category.name}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.description}
                  </p>
                </div>
                {category.isProfessional && (
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                    Profesionales colegiados
                  </Badge>
                )}
              </div>

              <CoachList
                coaches={getCoachesForTab(category.id)}
                onViewProfile={handleViewProfile}
                onBook={handleBook}
                variant="grid"
                showFilters={true}
                showSearch={true}
              />
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Professional Notice for Psychology Services */}
      {activeTab === 'ansiedad' && (
        <Card className="notion-card border-purple-200 bg-purple-50/50">
          <CardHeader>
            <CardTitle className="text-purple-800 flex items-center gap-2">
              🏥 Servicios Profesionales de Salud Mental
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-purple-700 space-y-2">
            <p>
              Los psicólogos mostrados en esta sección son profesionales colegiados que ofrecen 
              servicios de salud mental regulados.
            </p>
            <p>
              <strong>Importante:</strong> Estos servicios están sujetos a normativas sanitarias específicas 
              y requieren consentimientos clínicos adicionales.
            </p>
            <div className="pt-2">
              <Button variant="outline" size="sm" className="text-purple-700 border-purple-300">
                Más información sobre servicios sanitarios
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}