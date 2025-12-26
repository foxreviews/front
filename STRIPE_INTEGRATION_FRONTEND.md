# Guide d'Intégration Stripe - Plan Premium

## 🎯 Vue d'ensemble

Ce document décrit l'implémentation complète du système de paiement Stripe pour le plan Premium FOX-Reviews à **20€ HT/mois**.

## 📋 Flux utilisateur

1. **Inscription** → L'utilisateur crée un compte gratuit
2. **Page Upgrade** → Présentation des avantages Premium
3. **Paiement Stripe** → Checkout session sécurisé
4. **Confirmation** → Page de succès avec récapitulatif
5. **Espace Client** → Accès aux fonctionnalités Premium

## 🏗️ Architecture

### 1. Types TypeScript

**Fichier:** `src/types/billing.ts`

```typescript
export interface StripeCheckoutSessionRequest {
  success_url: string;
  cancel_url: string;
}

export interface StripeCheckoutSessionResponse {
  checkout_url: string;
  session_id: string;
}

export interface StripePortalSessionRequest {
  return_url: string;
}

export interface StripePortalSessionResponse {
  portal_url: string;
}
```

### 2. Service Stripe

**Fichier:** `src/services/stripe.service.ts`

Le service gère:
- ✅ Création de sessions checkout
- ✅ Accès au portail client
- ✅ Récupération des abonnements
- ✅ Vérification du statut Premium

**Méthodes principales:**

```typescript
// Créer une session checkout
await stripeService.createCheckoutSession({
  success_url: 'https://example.com/payment-success?session_id={CHECKOUT_SESSION_ID}',
  cancel_url: 'https://example.com/upgrade?payment=cancelled'
});

// Ouvrir le portail client
await stripeService.createPortalSession({
  return_url: 'https://example.com/client/dashboard'
});

// Vérifier si l'utilisateur est Premium
const isPremium = await stripeService.hasActiveSubscription();
```

### 3. Hook personnalisé

**Fichier:** `src/hooks/useStripe.ts`

Hook React pour faciliter l'utilisation de Stripe:

```typescript
const { 
  loading, 
  error, 
  createCheckout, 
  openPortal, 
  checkActiveSubscription 
} = useStripe();
```

### 4. Pages

#### Page Upgrade (`/upgrade`)

**Fichier:** `src/pages/Auth/Upgrade.tsx`

Page de présentation des avantages Premium affichée après l'inscription.

**Fonctionnalités:**
- 🎨 Design moderne avec gradients
- 📊 Présentation des 4 avantages principaux:
  - Sponsoring Premium (+500% visibilité)
  - Rotations Dynamiques (page d'accueil)
  - Avis Personnalisés (rédaction libre)
  - Statistiques Avancées (analytics)
- 💰 Prix clair: 20€ HT/mois
- ✨ Avantages supplémentaires (badge, support, etc.)
- 📈 Preuve sociale (+2 500 entreprises)
- 🔘 2 CTA: "Passer au Premium" / "Continuer gratuitement"

#### Page de Succès (`/payment-success`)

**Fichier:** `src/pages/Auth/PaymentSuccess.tsx`

Page affichée après un paiement réussi.

**Fonctionnalités:**
- ✅ Animation de succès
- 📋 Récapitulatif de l'abonnement
- 🎯 Liste des fonctionnalités débloquées
- 📝 Prochaines étapes suggérées
- ⏱️ Redirection automatique (10s)
- 🔗 Accès rapide: Dashboard, Factures, Gestion abonnement

### 5. Composant PremiumBadge

**Fichier:** `src/components/common/PremiumBadge.tsx`

Badge réutilisable pour identifier les comptes Premium:

```tsx
<PremiumBadge size="md" showText={true} />
```

**Props:**
- `size`: 'sm' | 'md' | 'lg'
- `showText`: boolean (afficher le texte "Premium")
- `className`: classes CSS additionnelles

## 🔄 Flux de redirection

```
1. Inscription → POST /auth/register/
   ✓ Retourne 200 + token

2. Redirection → /upgrade
   
3. Clic "Passer au Premium"
   → POST /billing/create-checkout-session/
   → Redirection vers Stripe Checkout

4. Paiement réussi sur Stripe
   → Webhook backend: checkout.session.completed
   → Redirection → /payment-success?session_id=xxx

5. Page de succès
   → Countdown 10s
   → Redirection automatique → /client/dashboard
```

## 🛠️ Configuration Backend requise

### Endpoints API nécessaires:

```python
# Création session checkout
POST /api/billing/create-checkout-session/
Body: {
  "success_url": "string",
  "cancel_url": "string"
}
Response: {
  "checkout_url": "string",
  "session_id": "string"
}

# Création session portail
POST /api/billing/create-portal-session/
Body: {
  "return_url": "string"
}
Response: {
  "portal_url": "string"
}

# Liste des abonnements
GET /api/billing/api/subscriptions/
Response: Subscription[]

# Détails d'un abonnement
GET /api/billing/api/subscriptions/<id>/
Response: Subscription
```

### Webhooks Stripe à configurer:

```
URL: https://yourdomain.com/api/webhooks/stripe/

Events à écouter:
- checkout.session.completed
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_succeeded
- invoice.payment_failed
```

## 🎨 Avantages Premium présentés

### 1. Sponsoring Premium 🎯
- Apparition en tête des résultats de recherche
- +500% de visibilité moyenne
- Ciblage par secteur d'activité

### 2. Rotations Dynamiques ⚡
- Affichage sur la page d'accueil
- Rotation régulière
- Exposition à des milliers de visiteurs

### 3. Avis Personnalisé ✍️
- Rédaction libre par l'entreprise
- Contrôle de l'image de marque
- Mise en avant des atouts

### 4. Statistiques Avancées 📊
- Vues en temps réel
- Taux de clics
- Analyse des conversions

### Avantages inclus:
- ✅ Badge "Entreprise Premium"
- ✅ Support prioritaire 7j/7
- ✅ Newsletters mensuelles
- ✅ Photos/vidéos illimitées
- ✅ Réponses aux avis clients

## 🧪 Tests

### Test du flux complet:

1. **Inscription**
   ```
   POST /auth/register/
   Vérifier redirection → /upgrade
   ```

2. **Page Upgrade**
   ```
   Vérifier affichage des avantages
   Vérifier prix: 20€ HT/mois
   Clic "Passer au Premium"
   ```

3. **Stripe Checkout**
   ```
   Utiliser carte test: 4242 4242 4242 4242
   Date: n'importe quelle date future
   CVC: n'importe quel 3 chiffres
   ```

4. **Page de succès**
   ```
   Vérifier affichage du récapitulatif
   Vérifier countdown de redirection
   Vérifier liens vers dashboard/billing
   ```

### Cartes de test Stripe:

```
Succès: 4242 4242 4242 4242
Refusée: 4000 0000 0000 0002
3D Secure: 4000 0027 6000 3184
```

## 📱 Responsive Design

Toutes les pages sont optimisées pour:
- 📱 Mobile (< 768px)
- 💻 Tablet (768px - 1024px)
- 🖥️ Desktop (> 1024px)

## 🔒 Sécurité

- ✅ Paiements gérés par Stripe (PCI-DSS compliant)
- ✅ Aucune donnée de carte stockée
- ✅ Authentification requise pour accès au portail
- ✅ Validation côté client et serveur
- ✅ Protection CSRF
- ✅ HTTPS obligatoire en production

## 🚀 Déploiement

### Variables d'environnement:

```env
# Backend (Django)
STRIPE_SECRET_KEY=sk_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_ID=price_xxx  # ID du prix 20€/mois

# Frontend (facultatif)
VITE_APP_URL=https://votre-domaine.com
```

### Checklist de déploiement:

- [ ] Configurer Stripe en mode production
- [ ] Créer le produit "Plan Premium" (20€ HT/mois)
- [ ] Configurer les webhooks Stripe
- [ ] Tester avec cartes de test
- [ ] Configurer emails de confirmation
- [ ] Vérifier les redirections HTTPS
- [ ] Tester le portail client
- [ ] Vérifier les factures PDF

## 📊 Métriques à suivre

- 📈 Taux de conversion (Upgrade → Paiement)
- 💰 MRR (Monthly Recurring Revenue)
- 📉 Taux de désabonnement (Churn)
- ⏱️ Temps moyen sur page Upgrade
- 🔄 Retour utilisateur après paiement

## 🆘 Support

En cas de problème:
1. Vérifier les logs Stripe Dashboard
2. Vérifier les webhooks (onglet Webhooks)
3. Consulter les logs backend
4. Tester avec carte de test
5. Vérifier les CORS pour les appels API

## 📚 Ressources

- [Documentation Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Documentation Customer Portal](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)
- [Webhooks Stripe](https://stripe.com/docs/webhooks)
- [Cartes de test](https://stripe.com/docs/testing)

---

✅ **Implémentation complète et production-ready !**
