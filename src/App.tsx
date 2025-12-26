import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { lazy, Suspense, type ReactNode } from 'react';
import './App.css'
import MainLayout from './layout/MainLayout';
import { Loader } from './components/common';
import { useAuth } from './hooks';

// Pages critiques chargées immédiatement
import Home from './pages/Home/Home';
import SearchResults from './pages/SearchPage/SearchResults';
import RedirectToSearch from './pages/SearchPage/RedirectToSearch';

// Lazy loading pour les autres pages
const ProDetail = lazy(() => import('./pages/Pro/ProDetail').then(m => ({ default: m.default })));
const Categories = lazy(() => import('./pages/Categories/Categories').then(m => ({ default: m.Categories })));
const SousCategories = lazy(() => import('./pages/SousCategories/SousCategories').then(m => ({ default: m.SousCategories })));
const Villes = lazy(() => import('./pages/Villes/Villes').then(m => ({ default: m.Villes })));

// Pages Auth lazy
const Login = lazy(() => import('./pages/Auth').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Auth').then(m => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('./pages/Auth').then(m => ({ default: m.ForgotPassword })));
const Upgrade = lazy(() => import('./pages/Auth').then(m => ({ default: m.Upgrade })));
const PaymentSuccess = lazy(() => import('./pages/Auth').then(m => ({ default: m.PaymentSuccess })));

// Pages légales lazy
const About = lazy(() => import('./pages/Legal').then(m => ({ default: m.About })));
const Contact = lazy(() => import('./pages/Legal').then(m => ({ default: m.Contact })));
const FAQ = lazy(() => import('./pages/Legal').then(m => ({ default: m.FAQ })));
const MentionsLegales = lazy(() => import('./pages/Legal').then(m => ({ default: m.MentionsLegales })));
const CGU = lazy(() => import('./pages/Legal').then(m => ({ default: m.CGU })));
const PolitiqueConfidentialite = lazy(() => import('./pages/Legal').then(m => ({ default: m.PolitiqueConfidentialite })));

// Espace Client lazy
const ClientDashboard = lazy(() => import('./pages/ClientDashboard').then(m => ({ default: m.ClientDashboard })));
const EntrepriseManagement = lazy(() => import('./pages/EntrepriseManagement').then(m => ({ default: m.EntrepriseManagement })));
const AvisUpload = lazy(() => import('./pages/AvisUpload').then(m => ({ default: m.AvisUpload })));
const Billing = lazy(() => import('./pages/Billing').then(m => ({ default: m.Billing })));
const BillingSuccess = lazy(() => import('./pages/Billing/Success').then(m => ({ default: m.BillingSuccess })));
const BillingCancel = lazy(() => import('./pages/Billing/Cancel').then(m => ({ default: m.BillingCancel })));

// Avis client (liste + détail)
const ClientAvis = lazy(() => import('./pages/ClientAvis').then(m => ({ default: m.ClientAvis })));
const ClientAvisDetail = lazy(() => import('./pages/ClientAvis/ClientAvisDetail').then(m => ({ default: m.ClientAvisDetail })));

// Sponsorisation
const Subscribe = lazy(() => import('./pages/Sponsorship/Subscribe').then(m => ({ default: m.default })));

function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

function App() {
 
  return (
     <MainLayout>
      <Suspense fallback={<Loader size="large" text="Chargement..." />}>
        <Routes>
          {/* Pages publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/pro/:id" element={<ProDetail />} />
          <Route path="/entreprise/:id" element={<ProDetail />} />
          <Route
            path="/:categorie_slug/:sous_categorie_slug/ville/:ville_slug/:entreprise_nom"
            element={<ProDetail />}
          />
          <Route path="/entreprises" element={<SearchResults />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:slug" element={<RedirectToSearch queryKey="categorie" />} />
          <Route path="/sous-categories" element={<SousCategories />} />
          <Route path="/sous-categories/:slug" element={<RedirectToSearch queryKey="sous_categorie" />} />
          <Route path="/villes" element={<Villes />} />
          <Route path="/villes/:slug" element={<RedirectToSearch queryKey="ville" />} />
          
          {/* Pages légales */}
          <Route path="/about" element={<About />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/cgu" element={<CGU />} />
          <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
          <Route path="/confidentialite" element={<PolitiqueConfidentialite />} />
          
          {/* Authentification */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          
          {/* Espace Client */}
          <Route
            path="/client/dashboard"
            element={
              <RequireAuth>
                <ClientDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/client/entreprise"
            element={
              <RequireAuth>
                <EntrepriseManagement />
              </RequireAuth>
            }
          />
          <Route
            path="/client/upload-avis"
            element={
              <RequireAuth>
                <AvisUpload />
              </RequireAuth>
            }
          />
          <Route
            path="/client/avis"
            element={
              <RequireAuth>
                <ClientAvis />
              </RequireAuth>
            }
          />
          <Route
            path="/client/avis/:id"
            element={
              <RequireAuth>
                <ClientAvisDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/client/billing"
            element={
              <RequireAuth>
                <Billing />
              </RequireAuth>
            }
          />
          <Route
            path="/client/account/billing"
            element={
              <RequireAuth>
                <Billing />
              </RequireAuth>
            }
          />
          <Route
            path="/client/billing/success"
            element={
              <RequireAuth>
                <BillingSuccess />
              </RequireAuth>
            }
          />
          <Route
            path="/client/billing/cancel"
            element={
              <RequireAuth>
                <BillingCancel />
              </RequireAuth>
            }
          />

          {/* Sponsorisation */}
          <Route
            path="/sponsorisation/abonnement"
            element={
              <RequireAuth>
                <Subscribe />
              </RequireAuth>
            }
          />
        </Routes>
      </Suspense>
    </MainLayout>
  )
}

export default App
