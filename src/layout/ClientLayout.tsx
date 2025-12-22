import { Link, useLocation, Outlet } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  Building2, 
  CreditCard, 
  FileText, 
  BarChart3, 
  Star,
  LogOut,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ClientLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navigation = [
    { path: '/client/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { path: '/client/entreprise', label: 'Mon entreprise', icon: Building2 },
    { path: '/client/abonnement', label: 'Abonnement', icon: CreditCard },
    { path: '/client/facturation', label: 'Facturation', icon: FileText },
    { path: '/client/visibilite', label: 'Visibilité', icon: BarChart3 },
    { path: '/client/avis', label: 'Avis', icon: Star },
  ];

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logout');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">FOX-Reviews</h1>
            <span className="text-sm text-muted-foreground">| Espace Client</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4 mr-2" />
              Mon profil
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b bg-white">
        <div className="container px-4">
          <Tabs value={currentPath} className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b-0 bg-transparent p-0 h-auto">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.path} to={item.path}>
                    <TabsTrigger
                      value={item.path}
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </TabsTrigger>
                  </Link>
                );
              })}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <main className="container px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-auto">
        <div className="container px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2024 FOX-Reviews. Tous droits réservés.</p>
            <div className="flex gap-4">
              <Link to="/legal/cgu" className="hover:text-foreground transition-colors">
                CGU
              </Link>
              <Link to="/legal/mentions-legales" className="hover:text-foreground transition-colors">
                Mentions légales
              </Link>
              <Link to="/legal/confidentialite" className="hover:text-foreground transition-colors">
                Confidentialité
              </Link>
              <Link to="/contact" className="hover:text-foreground transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
