/**
 * Exemple d'intégration des routes de l'espace client
 * À adapter selon votre configuration de routing existante
 */

import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ClientLayout } from '@/layout/ClientLayout';
import {
  ClientDashboard,
  EntrepriseManagement,
  Subscription,
  Billing,
  Visibility,
  AvisManagement
} from '@/pages/Client';

// Pages d'authentification
import { Login, Register, ForgotPassword } from '@/pages/Auth';

// Composant pour protéger les routes (à adapter selon votre logique d'auth)
function ProtectedRoute() {
  // TODO: Implémenter votre logique d'authentification
  const isAuthenticated = true; // Remplacer par useAuth() ou similaire
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Routes publiques d'authentification */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Routes protégées de l'espace client */}
      <Route path="/client" element={<ProtectedRoute />}>
        <Route element={<ClientLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          
          {/* Pages de l'espace client */}
          <Route path="dashboard" element={<ClientDashboard />} />
          <Route path="entreprise" element={<EntrepriseManagement />} />
          <Route path="abonnement" element={<Subscription />} />
          <Route path="facturation" element={<Billing />} />
          <Route path="visibilite" element={<Visibility />} />
          <Route path="avis" element={<AvisManagement />} />
        </Route>
      </Route>

      {/* Route 404 */}
      <Route path="*" element={<Navigate to="/client/dashboard" replace />} />
    </Routes>
  );
}

/**
 * Utilisation dans App.tsx :
 * 
 * import { BrowserRouter } from 'react-router-dom';
 * import { AppRoutes } from './routes/client.routes';
 * import { QueryClientProvider } from '@tanstack/react-query';
 * import { queryClient } from '@/config/queryClient';
 * 
 * function App() {
 *   return (
 *     <QueryClientProvider client={queryClient}>
 *       <BrowserRouter>
 *         <AppRoutes />
 *       </BrowserRouter>
 *     </QueryClientProvider>
 *   );
 * }
 */
