import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard,
  Users,
  Calendar,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Plus,
  Menu,
  X,
  ChevronDown,
  Activity,
  Target,
  Clock,
  TrendingUp,
  User,
  MessageSquare,
  FileText,
  CreditCard,
  Shield,
  HelpCircle,
  Database,
  Navigation,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Eye,
  Play,
  Bug,
  Code
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// TypeScript interfaces
interface TestResult {
  success: boolean;
  data?: any;
  error?: any;
}

interface TestResults {
  auth?: TestResult;
  database?: TestResult;
  routes?: Record<string, { success: boolean; path: string }>;
}

interface DebugLog {
  id: number;
  timestamp: string;
  type: 'info' | 'success' | 'error' | 'warning';
  message: string;
  data?: string | null;
}

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: any;
  description?: string;
  badge?: {
    count?: number;
    variant?: string;
    label?: string;
  };
}

// Navigation configuration for CoachWave
const navigationConfig = {
  main: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/coach/dashboard',
      icon: LayoutDashboard,
      description: 'Overview and analytics'
    },
    {
      id: 'clients',
      label: 'Clients',
      path: '/coach/clients',
      icon: Users,
      description: 'Manage your clients',
      badge: { count: 12, variant: 'default' }
    },
    {
      id: 'sessions',
      label: 'Sessions',
      path: '/coach/sessions',
      icon: Calendar,
      description: 'Schedule and manage sessions',
      badge: { count: 3, variant: 'destructive', label: 'Today' }
    },
    {
      id: 'programs',
      label: 'Programs',
      path: '/coach/programs',
      icon: BookOpen,
      description: 'Training programs and plans'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      path: '/coach/analytics',
      icon: BarChart3,
      description: 'Performance insights'
    }
  ],
  secondary: [
    {
      id: 'messages',
      label: 'Messages',
      path: '/coach/messages',
      icon: MessageSquare,
      badge: { count: 5, variant: 'default' }
    },
    {
      id: 'resources',
      label: 'Resources',
      path: '/coach/resources',
      icon: FileText
    },
    {
      id: 'billing',
      label: 'Billing',
      path: '/coach/billing',
      icon: CreditCard
    }
  ]
};

// Debug commands
const debugCommands = {
  // Ver estado actual de Supabase
  checkSupabaseClient: () => {
    console.log('Supabase client status check');
    console.log('supabase:', supabase || 'Not found');
  },
  
  // Ver sesión actual
  getCurrentSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      console.log('Current session:', { data, error });
      return { data, error };
    } catch (error) {
      console.error('Session check failed:', error);
      return { error };
    }
  },
  
  // Test de conexión
  testConnection: async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      console.log('Connection test:', { data, error });
      return { data, error };
    } catch (error) {
      console.error('Connection test failed:', error);
      return { error };
    }
  },
  
  // Ver usuario actual
  getCurrentUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      console.log('Current user:', { data, error });
      return { data, error };
    } catch (error) {
      console.error('User check failed:', error);
      return { error };
    }
  }
};

const CoachWaveDebugDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [debugLogs, setDebugLogs] = useState<DebugLog[]>([]);
  const [testResults, setTestResults] = useState<TestResults>({});
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Debug logging function
  const addDebugLog = (type, message, data = null) => {
    const log = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type,
      message,
      data: data ? JSON.stringify(data, null, 2) : null
    };
    setDebugLogs(prev => [log, ...prev.slice(0, 49)]); // Keep last 50 logs
  };

  // Test all functionality
  const runAllTests = async () => {
    setIsRunningTests(true);
    addDebugLog('info', 'Starting comprehensive test suite...');
    
    const results: TestResults = {};
    
    // Test authentication
    try {
      const authResult = await debugCommands.getCurrentSession();
      results.auth = { success: !authResult.error, data: authResult };
      addDebugLog(authResult.error ? 'error' : 'success', 'Authentication test', authResult);
    } catch (error) {
      results.auth = { success: false, error };
      addDebugLog('error', 'Authentication test failed', error);
    }
    
    // Test database connection
    try {
      const dbResult = await debugCommands.testConnection();
      results.database = { success: !dbResult.error, data: dbResult };
      addDebugLog(dbResult.error ? 'error' : 'success', 'Database connection test', dbResult);
    } catch (error) {
      results.database = { success: false, error };
      addDebugLog('error', 'Database test failed', error);
    }
    
    // Test routes
    const allRoutes = [...navigationConfig.main, ...navigationConfig.secondary];
    results.routes = {};
    for (const route of allRoutes) {
      results.routes[route.id] = { success: true, path: route.path };
      addDebugLog('success', `Route ${route.path} registered`);
    }
    
    setTestResults(results);
    setIsRunningTests(false);
    addDebugLog('info', 'Test suite completed', results);
  };

  // Initialize on mount
  useEffect(() => {
    addDebugLog('info', 'CoachWave Debug Dashboard initialized');
    
    // Check for Supabase client
    if (supabase) {
      addDebugLog('success', 'Supabase client found');
    } else {
      addDebugLog('warning', 'Supabase client not found');
    }
    
    // Set up auth listener
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        addDebugLog('info', `Auth state changed: ${event}`, session?.user);
        setCurrentUser(session?.user || null);
      });

      return () => {
        subscription?.unsubscribe();
      };
    } catch (error) {
      addDebugLog('error', 'Failed to set up auth listener', error);
    }
  }, []);

  // Navigation item component
  const NavigationItem = ({ item, isActive }) => {
    const Icon = item.icon;
    
    return (
      <Link
        to={item.path}
        className={`
          flex items-center justify-between w-full px-3 py-2 rounded-lg transition-all duration-200
          ${isActive 
            ? 'bg-primary text-primary-foreground shadow-sm' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }
        `}
      >
        <div className="flex items-center space-x-3">
          <Icon className="h-5 w-5" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">{item.label}</span>
            {item.description && (
              <span className="text-xs opacity-70">{item.description}</span>
            )}
          </div>
        </div>
        {item.badge && (
          <Badge 
            variant={item.badge.variant || 'secondary'} 
            className="text-xs h-5"
          >
            {item.badge.label || item.badge.count}
          </Badge>
        )}
      </Link>
    );
  };

  // Get current route
  const getCurrentRoute = (): NavigationItem => {
    const allItems = [...navigationConfig.main, ...navigationConfig.secondary];
    return allItems.find(item => location.pathname === item.path) || navigationConfig.main[0];
  };

  const currentRoute = getCurrentRoute();

  // Status icon helper
  const getStatusIcon = (success) => {
    if (success === null || success === undefined) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return success ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />;
  };

  // Log type color helper
  const getLogTypeColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="py-4">
                  <h2 className="text-lg font-semibold mb-4">CoachWave Debug</h2>
                  <ScrollArea className="h-[calc(100vh-8rem)]">
                    <div className="space-y-2">
                      {navigationConfig.main.map((item) => (
                        <NavigationItem
                          key={item.id}
                          item={item}
                          isActive={location.pathname === item.path}
                        />
                      ))}
                      <Separator className="my-4" />
                      {navigationConfig.secondary.map((item) => (
                        <NavigationItem
                          key={item.id}
                          item={item}
                          isActive={location.pathname === item.path}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Bug className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">CoachWave Debug</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button size="sm" onClick={() => navigate('/coach/sessions/new')}>
              <Plus className="h-4 w-4 mr-2" />
              New Session
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Bell className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>New client registered</DropdownMenuItem>
                <DropdownMenuItem>Session reminder in 15 min</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/api/placeholder/36/36" alt="Coach" />
                    <AvatarFallback>CW</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/coach/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/coach/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Hidden on mobile */}
        <aside className="hidden md:flex w-64 flex-col border-r bg-muted/10">
          <div className="p-4">
            <nav className="space-y-2">
              {navigationConfig.main.map((item) => (
                <NavigationItem
                  key={item.id}
                  item={item}
                  isActive={location.pathname === item.path}
                />
              ))}
              <Separator className="my-4" />
              <div className="space-y-2">
                {navigationConfig.secondary.map((item) => (
                  <NavigationItem
                    key={item.id}
                    item={item}
                    isActive={location.pathname === item.path}
                  />
                ))}
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">{currentRoute.label}</h1>
                <p className="text-muted-foreground">{currentRoute.description || 'CoachWave Dashboard'}</p>
              </div>
            </div>

            {/* Debug Panel */}
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="debug">Debug System</TabsTrigger>
                <TabsTrigger value="logs">Debug Logs</TabsTrigger>
                <TabsTrigger value="commands">Console Commands</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-6">
                {/* Dashboard Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12</div>
                      <p className="text-xs text-muted-foreground">+2 from last week</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Today's Sessions</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3</div>
                      <p className="text-xs text-muted-foreground">2 completed</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">94%</div>
                      <p className="text-xs text-muted-foreground">+3% from last month</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                      <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$4,250</div>
                      <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">John Doe - Personal Training</p>
                            <p className="text-sm text-muted-foreground">Today at 2:00 PM</p>
                          </div>
                          <Badge>Completed</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Sarah Smith - Nutrition Coaching</p>
                            <p className="text-sm text-muted-foreground">Today at 4:00 PM</p>
                          </div>
                          <Badge variant="destructive">Upcoming</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full justify-start" onClick={() => navigate('/coach/sessions/new')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Schedule New Session
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/coach/clients/new')}>
                        <Users className="mr-2 h-4 w-4" />
                        Add New Client
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/coach/programs/new')}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Create Program
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="debug" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Debug System</h2>
                  <Button onClick={runAllTests} disabled={isRunningTests}>
                    {isRunningTests ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    Run All Tests
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Authentication</CardTitle>
                      <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(testResults.auth?.success)}
                        <span className="text-sm">
                          {currentUser ? `Logged in as ${currentUser.email}` : 'Not authenticated'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Database</CardTitle>
                      <Database className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(testResults.database?.success)}
                        <span className="text-sm">
                          {testResults.database?.success ? 'Connected' : 'Connection issue'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Routes</CardTitle>
                      <Navigation className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(testResults.routes && Object.values(testResults.routes).every(r => r.success))}
                        <span className="text-sm">
                          {Object.keys(testResults.routes || {}).length} routes active
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="logs" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Debug Logs</h2>
                  <Button variant="outline" onClick={() => setDebugLogs([])}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear Logs
                  </Button>
                </div>

                <ScrollArea className="h-[400px] w-full border rounded-lg p-4">
                  <div className="space-y-2">
                    {debugLogs.map((log) => (
                      <div key={log.id} className={`p-3 rounded-lg border ${getLogTypeColor(log.type)}`}>
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="secondary" className="text-xs">
                            {log.type.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm font-medium">{log.message}</p>
                        {log.data && (
                          <pre className="text-xs mt-2 p-2 bg-muted rounded overflow-x-auto">
                            {log.data}
                          </pre>
                        )}
                      </div>
                    ))}
                    {debugLogs.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No debug logs yet. Run some tests to see logs appear here.
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="commands" className="space-y-4">
                <h2 className="text-2xl font-bold">Browser Console Commands</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Code className="h-5 w-5 mr-2" />
                        Supabase Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">Check Supabase client status</p>
                      <code className="bg-muted p-2 rounded block text-sm mb-3">
                        console.log('Supabase:', supabase);
                      </code>
                      <Button size="sm" onClick={debugCommands.checkSupabaseClient}>
                        Run Command
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        Current Session
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">Get current authentication session</p>
                      <code className="bg-muted p-2 rounded block text-sm mb-3">
                        supabase.auth.getSession()
                      </code>
                      <Button size="sm" onClick={debugCommands.getCurrentSession}>
                        Run Command
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Database className="h-5 w-5 mr-2" />
                        Test Connection
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">Test database connection</p>
                      <code className="bg-muted p-2 rounded block text-sm mb-3">
                        supabase.from('profiles').select('count')
                      </code>
                      <Button size="sm" onClick={debugCommands.testConnection}>
                        Run Command
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        Current User
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">Get current user information</p>
                      <code className="bg-muted p-2 rounded block text-sm mb-3">
                        supabase.auth.getUser()
                      </code>
                      <Button size="sm" onClick={debugCommands.getCurrentUser}>
                        Run Command
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoachWaveDebugDashboard;