/**
 * Exemples concrets d'implémentation des services backend
 * pour l'espace client entreprise
 */

import axios from 'axios';

// Types temporaires pour les données manquantes
interface EntrepriseUpdateData {
  nom?: string;
  description?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  site_web?: string;
  [key: string]: unknown;
}

interface RegisterData {
  email: string;
  password: string;
  nom?: string;
  prenom?: string;
  [key: string]: unknown;
}

// ============================================
// 1. CONFIGURATION DE BASE
// ============================================

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================
// 2. SERVICE CLIENT
// ============================================

export const clientService = {
  /**
   * Récupère les statistiques du dashboard
   */
  getDashboardStats: async () => {
    const response = await api.get('/api/client/dashboard-stats');
    return response.data;
    /* 
    Exemple de réponse attendue :
    {
      impressions: 1247,
      impressionsChange: 12.1,
      clicks: 89,
      clicksChange: 8.5,
      averageRating: 4.5,
      totalReviews: 23
    }
    */
  },

  /**
   * Récupère les informations de l'entreprise
   */
  getEntreprise: async () => {
    const response = await api.get('/api/client/entreprise');
    return response.data;
  },

  /**
   * Met à jour les informations de l'entreprise
   */
  updateEntreprise: async (data: EntrepriseUpdateData) => {
    const response = await api.put('/api/client/entreprise', data);
    return response.data;
  },

  /**
   * Récupère les stats de visibilité
   */
  getVisibilityStats: async () => {
    const response = await api.get('/api/client/visibility');
    return response.data;
    /*
    Exemple de réponse :
    {
      isSponsored: false,
      currentPosition: 5,
      totalCompetitors: 12,
      categories: ['Restaurants'],
      cities: ['Paris 1er'],
      stats: {
        impressions: { current: 1247, previous: 1112, change: 12.1 },
        clicks: { current: 89, previous: 82, change: 8.5 },
        clickRate: { current: 7.1, previous: 7.4, change: -4.1 }
      }
    }
    */
  },
};

// ============================================
// 3. SERVICE BILLING (STRIPE)
// ============================================

export const billingService = {
  /**
   * Crée une session Checkout Stripe pour un abonnement
   * ⚠️ Le frontend reçoit uniquement l'URL de redirection
   */
  createCheckoutSession: async (data: {
    pro_localisation_id: string;
    duration_months?: number;
    success_url: string;
    cancel_url: string;
  }) => {
    const response = await api.post('/api/billing/create-checkout', data);
    return response.data;
    /*
    Exemple de réponse :
    {
      checkout_url: "https://checkout.stripe.com/c/pay/cs_...",
      session_id: "cs_..."
    }
    
    Utilisation :
    const { checkout_url } = await billingService.createCheckoutSession({...});
    window.location.href = checkout_url;
    */
  },

  /**
   * Crée une session pour passer en mode sponsorisé
   */
  createSponsoredSession: async () => {
    const response = await api.post('/api/billing/upgrade-sponsored', {
      success_url: `${window.location.origin}/client/abonnement?success=true`,
      cancel_url: `${window.location.origin}/client/abonnement?canceled=true`,
    });
    return response.data;
  },

  /**
   * Récupère l'abonnement actuel
   */
  getSubscription: async () => {
    const response = await api.get('/api/billing/subscription');
    return response.data;
    /*
    Exemple de réponse :
    {
      id: "sub_...",
      status: "active",
      plan: "Standard",
      current_period_start: 1704067200,
      current_period_end: 1706745600,
      cancel_at_period_end: false,
      price: 29.99,
      isSponsored: false
    }
    */
  },

  /**
   * Annule l'abonnement (résiliation à la fin de la période)
   */
  cancelSubscription: async () => {
    const response = await api.post('/api/billing/cancel-subscription');
    return response.data;
  },

  /**
   * Récupère l'historique des factures
   */
  getInvoices: async () => {
    const response = await api.get('/api/billing/invoices');
    return response.data;
    /*
    Exemple de réponse :
    {
      invoices: [
        {
          id: "in_...",
          number: "INV-2024-001",
          amount: 29.99,
          currency: "EUR",
          status: "paid",
          created: 1704067200,
          paid_at: 1704067200,
          invoice_pdf: "https://...",
          hosted_invoice_url: "https://..."
        }
      ],
      total_count: 3
    }
    */
  },

  /**
   * Obtient l'URL du portail client Stripe
   * Permet au client de gérer ses moyens de paiement
   */
  getCustomerPortalUrl: async () => {
    const response = await api.get('/api/billing/customer-portal');
    return response.data;
    /*
    Exemple de réponse :
    {
      url: "https://billing.stripe.com/p/session/..."
    }
    
    Utilisation :
    const { url } = await billingService.getCustomerPortalUrl();
    window.location.href = url;
    */
  },
};

// ============================================
// 4. SERVICE AVIS
// ============================================

export const avisService = {
  /**
   * Récupère l'avis actuellement affiché
   */
  getCurrentAvis: async () => {
    const response = await api.get('/api/client/avis');
    return response.data;
    /*
    Exemple de réponse :
    {
      hasAvis: true,
      avis: {
        id: "1",
        text: "...",
        source: "Google Reviews",
        rating: 4.5,
        date: "2024-01-15",
        author: "Marie D.",
        verified: true
      }
    }
    */
  },

  /**
   * Upload un nouvel avis (fichier PDF, PNG, JPG)
   */
  uploadAvis: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/client/avis/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
    /*
    Exemple de réponse :
    {
      success: true,
      message: "Avis uploadé avec succès. Vérification en cours.",
      file_id: "file_..."
    }
    */
  },

  /**
   * Récupère l'historique des uploads
   */
  getUploadHistory: async () => {
    const response = await api.get('/api/client/avis/history');
    return response.data;
  },
};

// ============================================
// 5. SERVICE AUTH
// ============================================

export const authService = {
  /**
   * Connexion
   */
  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post('/api/auth/login', credentials);
    const { token, user } = response.data;
    
    // Stocker le token
    localStorage.setItem('auth_token', token);
    
    return { token, user };
  },

  /**
   * Inscription
   */
  register: async (data: RegisterData) => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },

  /**
   * Mot de passe oublié
   */
  forgotPassword: async (email: string) => {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Changement de mot de passe
   */
  changePassword: async (data: {
    current_password: string;
    new_password: string;
  }) => {
    const response = await api.post('/api/auth/change-password', data);
    return response.data;
  },

  /**
   * Déconnexion
   */
  logout: () => {
    localStorage.removeItem('auth_token');
  },
};

// ============================================
// 6. HOOKS REACT QUERY (EXEMPLE)
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Hook pour récupérer les stats du dashboard
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: clientService.getDashboardStats,
  });
}

/**
 * Hook pour récupérer l'abonnement
 */
export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: billingService.getSubscription,
  });
}

/**
 * Hook pour mettre à jour l'entreprise
 */
export function useUpdateEntreprise() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: clientService.updateEntreprise,
    onSuccess: () => {
      // Invalider le cache pour recharger les données
      queryClient.invalidateQueries({ queryKey: ['entreprise'] });
    },
  });
}

/**
 * Hook pour créer une session Checkout
 */
export function useCreateCheckout() {
  return useMutation({
    mutationFn: billingService.createCheckoutSession,
    onSuccess: (data) => {
      // Redirection automatique vers Stripe
      window.location.href = data.checkout_url;
    },
  });
}

// ============================================
// 7. UTILISATION DANS LES COMPOSANTS
// ============================================

/*
// Dans Dashboard.tsx
import { useDashboardStats } from '@/services/client.service';

export function ClientDashboard() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) return <Loader />;
  if (error) return <Alert>Erreur</Alert>;

  return (
    <div>
      <StatCard value={stats.impressions} />
      ...
    </div>
  );
}

// Dans Subscription.tsx
import { useCreateCheckout, useSubscription } from '@/services/billing.service';

export function Subscription() {
  const { data: subscription } = useSubscription();
  const createCheckout = useCreateCheckout();

  const handleUpgrade = () => {
    createCheckout.mutate({
      pro_localisation_id: '...',
      success_url: window.location.origin + '/client/abonnement?success=true',
      cancel_url: window.location.origin + '/client/abonnement',
    });
  };

  return <Button onClick={handleUpgrade}>Passer en sponsorisé</Button>;
}
*/

// ============================================
// 8. VARIABLES D'ENVIRONNEMENT
// ============================================

/*
# .env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=FOX-Reviews

# .env.production
VITE_API_URL=https://api.fox-reviews.fr
VITE_APP_NAME=FOX-Reviews
*/
