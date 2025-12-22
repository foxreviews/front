# Nettoyage du Code - Rapport

## Fichiers à réviser

### 1. Fichiers d'exemple à supprimer (après migration complète)

- ✅ `src/routes/client.routes.example.tsx` - Exemple de routing (peut être supprimé si routes implémentées)
- ✅ `src/services/api.examples.ts` - Exemples d'API (documentation uniquement)

**Action recommandée** : Conserver pour documentation jusqu'à ce que toutes les pages soient migrées.

---

### 2. TODOs à traiter dans les pages Client

#### `src/pages/Client/Dashboard.tsx`
- **Ligne 20** : `// TODO: Remplacer par de vraies données du backend`
- **Action** : Utiliser `useDashboard()` hook au lieu de mock data

#### `src/pages/Client/Entreprise.tsx`
- **Ligne 25** : `// TODO: Charger les données depuis le backend`
- **Ligne 60** : `// TODO: Appel API` (création entreprise)
- **Ligne 91** : `// TODO: Appel API` (mise à jour entreprise)
- **Action** : Utiliser `useEntreprise()` hook et `clientService.createEntreprise()`, `clientService.updateEntreprise()`

#### `src/pages/Client/Avis.tsx`
- **Ligne 22** : `// TODO: Charger depuis le backend`
- **Ligne 46** : `// TODO: Appel API pour uploader le fichier`
- **Action** : Utiliser `useAvis()` hook et `clientService.uploadAvis()`

#### `src/pages/Client/Subscription.tsx`
- **Ligne 33** : `// TODO: Charger depuis le backend`
- **Ligne 47** : `// TODO: Appeler le backend pour créer une session Stripe Checkout`
- **Ligne 63** : `// TODO: Appeler le backend pour passer en mode sponsorisé`
- **Ligne 79** : `// TODO: Appeler le backend pour résilier l'abonnement`
- **Ligne 341** : `// TODO: Rediriger vers le portail client Stripe`
- **Action** : Utiliser `useBilling()` hook et `billingService.createCheckoutSession()`

#### `src/pages/Client/Billing.tsx`
- **Ligne 25** : `// TODO: Charger depuis le backend`
- **Ligne 101** : `// TODO: Implémenter le téléchargement via le backend`
- **Ligne 302** : `// TODO: Rediriger vers le portail client Stripe`
- **Action** : Utiliser `useInvoice()` hook et `billingService.getInvoices()`

#### `src/pages/Client/Visibility.tsx`
- **Ligne 21** : `// TODO: Charger depuis le backend`
- **Action** : Utiliser `useTracking()` hook et `trackingService.getStats()`

#### `src/layout/ClientLayout.tsx`
- **Ligne 31** : `// TODO: Implement logout logic`
- **Action** : Utiliser `authService.logout()`

---

### 3. TODOs dans autres fichiers

#### `src/pages/Legal/Contact.tsx`
- **Ligne 40** : `// TODO: Implémenter l'envoi via API`
- **Action** : Créer un endpoint contact ou utiliser un service email

---

## Services et hooks disponibles pour remplacer les TODOs

### Hooks disponibles
```typescript
import {
  useAuth,           // Pour l'authentification
  useDashboard,      // Pour le dashboard client
  useEntreprise,     // Pour la gestion d'entreprise
  useAvis,           // Pour la gestion des avis
  useBilling,        // Pour la facturation et abonnements
  useInvoice,        // Pour les factures
  useTracking,       // Pour les statistiques
  usePermissions,    // Pour les permissions
  useExport,         // Pour les exports
} from '@/hooks';
```

### Services disponibles
```typescript
import {
  authService,       // Authentification et compte
  clientService,     // Gestion entreprises et avis
  billingService,    // Facturation et Stripe
  trackingService,   // Analytics
  exportService,     // Exports CSV/JSON
  referenceService,  // Données de référence
} from '@/services';
```

---

## Actions prioritaires

### Court terme (avant déploiement)
1. ✅ Remplacer tous les TODOs dans les pages Client par des appels réels aux services
2. ✅ Implémenter la logique de logout dans ClientLayout
3. ✅ Tester chaque page avec les vrais endpoints backend

### Moyen terme
4. Vérifier et nettoyer les imports inutilisés (ESLint peut aider)
5. Supprimer les fichiers .example si toutes les fonctionnalités sont migrées
6. Ajouter la gestion des erreurs avec toast notifications

### Long terme
7. Ajouter des tests unitaires pour chaque page
8. Optimiser les performances (mémoïsation, lazy loading)
9. Améliorer l'accessibilité (ARIA labels, navigation clavier)

---

## Checklist de migration des pages

- [ ] Dashboard.tsx - Utiliser `useDashboard()`
- [ ] Entreprise.tsx - Utiliser `useEntreprise()` et `clientService`
- [ ] Avis.tsx - Utiliser `useAvis()` et `clientService.uploadAvis()`
- [ ] Subscription.tsx - Utiliser `useBilling()` et Stripe checkout
- [ ] Billing.tsx - Utiliser `useInvoice()` pour les factures
- [ ] Visibility.tsx - Utiliser `useTracking()` pour les stats
- [ ] ClientLayout.tsx - Implémenter logout avec `authService.logout()`

---

## Remarques

- Tous les services et hooks sont maintenant disponibles et documentés dans [SERVICES.md](SERVICES.md)
- Les schémas de validation Zod sont disponibles dans `lib/validation.ts`
- La gestion d'erreurs est centralisée dans `lib/errorHandler.ts`
- Le système de permissions est disponible via `usePermissions()`
