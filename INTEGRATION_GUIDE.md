# Guide d'intégration de l'espace client

## ✅ Composants créés

### 1. Pages d'authentification (100% shadcn/ui)
- ✅ Login (Login.tsx)
- ✅ Register (Register.tsx)  
- ✅ ForgotPassword (ForgotPassword.tsx)

### 2. Layout de l'espace client
- ✅ ClientLayout.tsx - Navigation par onglets avec toutes les sections

### 3. Pages de l'espace client
- ✅ Dashboard.tsx - Vue d'ensemble avec KPIs
- ✅ Entreprise.tsx - Gestion des infos entreprise et utilisateur
- ✅ Subscription.tsx - Gestion abonnement et sponsorisation
- ✅ Billing.tsx - Historique des factures
- ✅ Visibility.tsx - Statistiques et positionnement
- ✅ Avis.tsx - Gestion des avis décryptés

## 🎨 Composants shadcn/ui utilisés

- Button
- Card (+ Header, Content, Footer, Title, Description)
- Input
- Label
- Badge
- Table (+ Header, Body, Row, Cell, Head)
- Tabs (+ TabsList, TabsTrigger, TabsContent)
- Separator
- Progress
- Alert (+ AlertTitle, AlertDescription)
- AlertDialog (+ tous les sous-composants)

## 📋 Prochaines étapes pour l'intégration

### 1. Configuration du routing

Ajoutez les routes dans votre fichier de routing principal :

```tsx
import { ClientLayout } from '@/layout/ClientLayout';
import {
  ClientDashboard,
  EntrepriseManagement,
  Subscription,
  Billing,
  Visibility,
  AvisManagement
} from '@/pages/Client';

// Dans votre router
<Route path="/client" element={<ClientLayout />}>
  <Route path="dashboard" element={<ClientDashboard />} />
  <Route path="entreprise" element={<EntrepriseManagement />} />
  <Route path="abonnement" element={<Subscription />} />
  <Route path="facturation" element={<Billing />} />
  <Route path="visibilite" element={<Visibility />} />
  <Route path="avis" element={<AvisManagement />} />
</Route>
```

### 2. Intégration avec le backend

Chaque page contient des `// TODO:` indiquant où appeler les services backend :

**Exemples à implémenter :**

```tsx
// Dans Dashboard.tsx
const { data: stats } = useQuery({
  queryKey: ['dashboard-stats'],
  queryFn: () => clientService.getDashboardStats()
});

// Dans Subscription.tsx
const handleUpgradeToSponsored = async () => {
  const { checkout_url } = await billingService.createSponsoredSession();
  window.location.href = checkout_url;
};

// Dans Billing.tsx
const { data: invoices } = useQuery({
  queryKey: ['invoices'],
  queryFn: () => billingService.getInvoices()
});
```

### 3. Connexion Stripe (IMPORTANT)

**Tous les appels Stripe passent par le backend :**

```tsx
// ❌ JAMAIS comme ça
import { loadStripe } from '@stripe/stripe-js';

// ✅ TOUJOURS comme ça
const response = await billingService.createCheckoutSession({
  pro_localisation_id: '...',
  success_url: window.location.origin + '/client/abonnement?success=true',
  cancel_url: window.location.origin + '/client/abonnement?canceled=true'
});
window.location.href = response.checkout_url;
```

### 4. Tailwind CSS Configuration

Ajoutez les variables CSS pour les couleurs dans votre fichier CSS global :

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }
}
```

### 5. Services backend à créer/compléter

Les services suivants doivent être implémentés :

**authService.ts**
- changePassword(data)
- resetPassword(email)

**clientService.ts**
- getDashboardStats()
- getEntreprise()
- updateEntreprise(data)

**billingService.ts**
- createCheckoutSession(data)
- createSponsoredSession()
- cancelSubscription()
- getInvoices()
- getSubscription()

**avisService.ts**
- uploadAvis(file)
- getCurrentAvis()

## 🎯 Points clés de l'implémentation

### Design
- ✅ 100% shadcn/ui - Aucun composant custom
- ✅ Design premium SaaS B2B
- ✅ Responsive sur tous les écrans
- ✅ États loading/error/success gérés partout
- ✅ Feedback visuel immédiat

### Sécurité
- ✅ Aucune clé Stripe côté frontend
- ✅ Tous les paiements via backend
- ✅ Redirection vers Stripe Checkout sécurisé

### UX
- ✅ Navigation claire par onglets
- ✅ Confirmations pour actions critiques (résiliation)
- ✅ Guides et infobulles contextuelles
- ✅ Messages d'encouragement pour la sponsorisation

## 🚀 Lancement rapide

1. Installer les dépendances manquantes (déjà fait)
2. Configurer le routing
3. Connecter les services backend
4. Tester chaque page
5. Déployer !

## 📞 Support

Toutes les pages sont prêtes à l'emploi. Il suffit de :
1. Remplacer les données mockées par de vrais appels API
2. Gérer l'authentification (redirection si non connecté)
3. Tester les flux complets

Bon développement ! 🎉
