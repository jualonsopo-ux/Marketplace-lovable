import { useState } from 'react';
import { CoachCard } from './CoachCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, X, Star, Languages, MapPin } from 'lucide-react';
import { searchCoaches, getFeaturedCoaches } from '@/data/coaches';
import type { Coach } from '@/types/coaching';

interface CoachListProps {
  coaches?: Coach[];
  onViewProfile: (coachId: string) => void;
  onBook: (coachId: string) => void;
  variant?: 'grid' | 'list' | 'compact';
  showFilters?: boolean;
  showSearch?: boolean;
}

interface Filters {
  category?: string;
  minRating?: number;
  languages?: string[];
  specializations?: string[];
  priceRange?: string;
}

export function CoachList({ 
  coaches: initialCoaches, 
  onViewProfile, 
  onBook, 
  variant = 'grid',
  showFilters = true,
  showSearch = true 
}: CoachListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Use provided coaches or get featured coaches as default
  const baseCoaches = initialCoaches || getFeaturedCoaches();
  
  // Apply search and filters
  const filteredCoaches = searchCoaches(searchQuery, {
    category: filters.category,
    minRating: filters.minRating,
    languages: filters.languages,
    specializations: filters.specializations,
  }).filter(coach => baseCoaches.some(bc => bc.id === coach.id));

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;
  const hasActiveFilters = activeFiltersCount > 0 || searchQuery.length > 0;

  // Get unique values for filter options
  const categories = [...new Set(baseCoaches.map(c => c.category))].filter(Boolean);
  const allLanguages = [...new Set(baseCoaches.flatMap(c => c.languages))].filter(Boolean);
  const allSpecialties = [...new Set(baseCoaches.flatMap(c => c.specialties))].filter(Boolean);

  const getGridClassName = () => {
    switch (variant) {
      case 'list':
        return 'space-y-4';
      case 'compact':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <Card className="notion-card">
          <CardContent className="p-6 space-y-4">
            {/* Search bar */}
            {showSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar coaches por nombre, especialidad..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}

            {/* Quick filters */}
            {showFilters && (
              <div className="flex flex-wrap items-center gap-3">
                <Select value={filters.category || 'all'} onValueChange={(value) => handleFilterChange('category', value === 'all' ? undefined : value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filters.minRating?.toString() || 'all'} onValueChange={(value) => handleFilterChange('minRating', value === 'all' ? undefined : parseFloat(value))}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Cualquier rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Cualquier rating</SelectItem>
                    <SelectItem value="4.5">4.5+ ⭐</SelectItem>
                    <SelectItem value="4.0">4.0+ ⭐</SelectItem>
                    <SelectItem value="3.5">3.5+ ⭐</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Más filtros
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>

                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                    <X className="h-4 w-4" />
                    Limpiar
                  </Button>
                )}
              </div>
            )}

            {/* Advanced filters */}
            {showAdvancedFilters && (
              <div className="border-t pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Idiomas</label>
                    <div className="flex flex-wrap gap-2">
                      {allLanguages.map(lang => (
                        <Button
                          key={lang}
                          variant={filters.languages?.includes(lang) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const current = filters.languages || [];
                            const updated = current.includes(lang)
                              ? current.filter(l => l !== lang)
                              : [...current, lang];
                            handleFilterChange('languages', updated.length ? updated : undefined);
                          }}
                          className="gap-1"
                        >
                          <Languages className="h-3 w-3" />
                          {lang}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Especialidades</label>
                    <div className="flex flex-wrap gap-2">
                      {allSpecialties.slice(0, 6).map(specialty => (
                        <Button
                          key={specialty}
                          variant={filters.specializations?.includes(specialty) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const current = filters.specializations || [];
                            const updated = current.includes(specialty)
                              ? current.filter(s => s !== specialty)
                              : [...current, specialty];
                            handleFilterChange('specializations', updated.length ? updated : undefined);
                          }}
                        >
                          {specialty}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {filteredCoaches.length} coach{filteredCoaches.length !== 1 ? 'es' : ''} encontrado{filteredCoaches.length !== 1 ? 's' : ''}
          {hasActiveFilters && ' (filtrados)'}
        </div>
        
        {/* Sort options */}
        <Select defaultValue="rating">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Mejor valorados</SelectItem>
            <SelectItem value="reviews">Más reseñas</SelectItem>
            <SelectItem value="price-low">Precio: menor a mayor</SelectItem>
            <SelectItem value="price-high">Precio: mayor a menor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Coaches list */}
      {filteredCoaches.length > 0 ? (
        <div className={getGridClassName()}>
          {filteredCoaches.map((coach) => (
            <CoachCard
              key={coach.id}
              coach={coach}
              onViewProfile={onViewProfile}
              onBook={onBook}
              variant={variant === 'list' ? 'default' : variant === 'compact' ? 'compact' : 'default'}
            />
          ))}
        </div>
      ) : (
        <Card className="notion-card">
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground space-y-2">
              <Search className="h-12 w-12 mx-auto mb-4" />
              <h3 className="font-medium text-foreground">No se encontraron coaches</h3>
              <p className="text-sm">
                Intenta ajustar los filtros o términos de búsqueda
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters} className="mt-4">
                  Limpiar filtros
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}