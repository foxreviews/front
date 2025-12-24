import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import './App.css'
import MainLayout from './layout/MainLayout';
import { Loader } from './components/common';

// Pages critiques chargées immédiatement
import Home from './pages/Home/Home';
import SearchResults from './pages/SearchPage/SearchResults';

// Lazy loading pour les autres pages
const ProDetail = lazy(() => import('./pages/Pro/ProDetail').then(m => ({ default: m.default })));
const Categories = lazy(() => import('./pages/Categories/Categories').then(m => ({ default: m.Categories })));
const SousCategories = lazy(() => import('./pages/SousCategories/SousCategories').then(m => ({ default: m.SousCategories })));
const Villes = lazy(() => import('./pages/Villes/Villes').then(m => ({ default: m.Villes })));

// Pages Auth lazy
const Login = lazy(() => import('./pages/Auth').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Auth').then(m => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('./pages/Auth').then(m => ({ default: m.ForgotPassword })));

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

// Sponsorisation
const Subscribe = lazy(() => import('./pages/Sponsorship/Subscribe').then(m => ({ default: m.default })));

function App() {
 
  return (
     <MainLayout>
      <Suspense fallback={<Loader size="large" text="Chargement..." />}>
        <Routes>
          {/* Pages publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/pro/:id" element={<ProDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/sous-categories" element={<SousCategories />} />
          <Route path="/villes" element={<Villes />} />
          
          {/* Pages légales */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/cgu" element={<CGU />} />
          <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
          
          {/* Authentification */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Espace Client */}
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/client/entreprise" element={<EntrepriseManagement />} />
          <Route path="/client/upload-avis" element={<AvisUpload />} />
          <Route path="/client/billing" element={<Billing />} />

          {/* Sponsorisation */}
          <Route path="/sponsorisation/abonnement" element={<Subscribe />} />
        </Routes>
      </Suspense>
    </MainLayout>
  )
}

export default App
