import { Outlet } from 'react-router-dom';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">CoachWave</h1>
            <div className="flex items-center gap-4">
              <a href="/discover" className="text-sm hover:underline">
                Descubrir Coaches
              </a>
              <a href="/auth" className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                Iniciar Sesión
              </a>
            </div>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}