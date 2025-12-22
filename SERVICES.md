# Documentation des Services API

Ce document décrit tous les services disponibles pour interagir avec l'API backend.

## Table des matières

1. [Configuration](#configuration)
2. [Services d'authentification](#services-dauthentification)
3. [Services client](#services-client)
4. [Services de référence](#services-de-référence)
5. [Services de facturation](#services-de-facturation)
6. [Services de tracking](#services-de-tracking)
7. [Services d'export](#services-dexport)
8. [Services ProLocalisation](#services-prolocalisation)
9. [Services de sponsorisation](#services-de-sponsorisation)
10. [Services utilisateur](#services-utilisateur)
11. [Gestion des erreurs](#gestion-des-erreurs)

---

## Configuration

### Client API

Le client Axios est configuré dans `config/api.ts` :

```typescript
import apiClient from './config/api';
```

**Fonctionnalités** :
- Token d'authentification automatique
- Retry automatique avec backoff exponentiel (3 tentatives)
- Timeout de 30 secondes
- Redirection automatique vers `/login` en cas d'erreur 401
- Gestion centralisée des erreurs

---

## Services d'authentification

### `authService`

**Import** : `import { authService } from './services/auth.service';`

#### Méthodes

##### `login(email, password)`
Authentifie un utilisateur et stocke le token.

```typescript
const { user, token } = await authService.login('user@example.com', 'password123');
```

##### `register(data)`
Crée un nouveau compte utilisateur.

```typescript
const { user, token } = await authService.register({
  email: 'user@example.com',
  password1: 'SecurePass123!',
  password2: 'SecurePass123!',
  first_name: 'John',
  last_name: 'Doe'
});
```

##### `requestPasswordReset(email)`
Envoie un email de réinitialisation de mot de passe.

```typescript
await authService.requestPasswordReset('user@example.com');
```

##### `getCurrentUser()`
Récupère les informations de l'utilisateur connecté.

```typescript
const user = await authService.getCurrentUser();
```

##### `getAccount()`
Récupère les données complètes du compte (alias de getCurrentUser).

```typescript
const account = await authService.getAccount();
```

##### `updateAccount(data)`
Met à jour les informations du compte.

```typescript
const updatedUser = await authService.updateAccount({
  first_name: 'Jane',
  telephone: '0612345678'
});
```

##### `logout()`
Déconnecte l'utilisateur et supprime le token.

```typescript
authService.logout();
```

---

## Services client

### `clientService`

**Import** : `import { clientService } from './services/client.service';`

#### Méthodes entreprises

##### `getEntreprises(filters?)`
Liste les entreprises de l'utilisateur avec filtres optionnels.

```typescript
const { results, count } = await clientService.getEntreprises({
  ville: 'Paris',
  is_active: true,
  page: 1
});
```

##### `getEntreprise(id)`
Récupère une entreprise par son ID.

```typescript
const entreprise = await clientService.getEntreprise('uuid-123');
```

##### `createEntreprise(data)`
Crée une nouvelle entreprise.

```typescript
const newEntreprise = await clientService.createEntreprise({
  nom: 'Ma société',
  adresse: '123 rue Example',
  code_postal: '75001',
  ville: 'Paris',
  telephone: '0123456789',
  sous_categorie: 'uuid-sous-cat',
  siret: '12345678901234'
});
```

##### `updateEntreprise(id, data)`
Met à jour partiellement une entreprise (PATCH).

```typescript
const updated = await clientService.updateEntreprise('uuid-123', {
  telephone: '0987654321'
});
```

##### `replaceEntreprise(id, data)`
Remplace complètement une entreprise (PUT).

```typescript
const replaced = await clientService.replaceEntreprise('uuid-123', fullData);
```

##### `deleteEntreprise(id)`
Supprime une entreprise.

```typescript
await clientService.deleteEntreprise('uuid-123');
```

#### Méthodes avis

##### `getAvisDecryptes(filters?)`
Récupère les avis décryptés avec filtres optionnels.

```typescript
const { results, count } = await clientService.getAvisDecryptes({
  entreprise_id: 'uuid-123',
  note_min: 4,
  source: 'google'
});
```

##### `getAvisDecrypte(id)`
Récupère un avis décrypté par son ID.

```typescript
const avis = await clientService.getAvisDecrypte('uuid-456');
```

##### `uploadAvis(entrepriseId, file)`
Upload un fichier d'avis pour une entreprise.

```typescript
const formData = new FormData();
formData.append('fichier', file);
const result = await clientService.uploadAvis('uuid-123', formData);
```

#### Méthodes dashboard

##### `getDashboard()`
Récupère les statistiques du dashboard client.

```typescript
const stats = await clientService.getDashboard();
// { total_entreprises, total_avis, total_vues, total_clics, ... }
```

#### Méthodes sponsorisation

##### `getSponsorisations(filters?)`
Liste les sponsorisations du client.

```typescript
const { results } = await clientService.getSponsorisations({
  is_active: true
});
```

---

## Services de référence

### `referenceService`

**Import** : `import { referenceService } from './services/reference.service';`

#### Méthodes

##### `getCategories()`
Liste toutes les catégories.

```typescript
const categories = await referenceService.getCategories();
```

##### `getCategorieDetail(id)`
Récupère les détails d'une catégorie avec ses sous-catégories.

```typescript
const categorie = await referenceService.getCategorieDetail('uuid-123');
```

##### `getSousCategories(params?)`
Liste les sous-catégories avec filtres optionnels.

```typescript
const sousCategories = await referenceService.getSousCategories({
  categorie: 'uuid-cat'
});
```

##### `autocompleteSousCategories(params)`
Autocomplete pour les sous-catégories.

```typescript
const suggestions = await referenceService.autocompleteSousCategories({
  q: 'rest',
  categorie: 'uuid-cat'
});
```

##### `getVilles(params?)`
Liste les villes avec filtres optionnels.

```typescript
const villes = await referenceService.getVilles({
  page: 1,
  page_size: 20
});
```

##### `autocompleteVilles(params)`
Autocomplete pour les villes.

```typescript
const suggestions = await referenceService.autocompleteVilles({
  q: 'par',
  limit: 10
});
```

##### `lookupVille(nom)`
Recherche exacte d'une ville par nom.

```typescript
const ville = await referenceService.lookupVille('Paris');
```

##### `getVilleStats()`
Récupère les statistiques par ville.

```typescript
const stats = await referenceService.getVilleStats();
```

---

## Services de facturation

### `billingService`

**Import** : `import { billingService } from './services/billing.service';`

#### Méthodes

##### `createCheckoutSession(data)`
Crée une session de paiement Stripe.

```typescript
const { checkout_url } = await billingService.createCheckoutSession({
  forfait: 'premium',
  duree_mois: 12,
  success_url: 'https://example.com/success',
  cancel_url: 'https://example.com/cancel'
});
window.location.href = checkout_url;
```

##### `getSubscriptions(params?)`
Liste les abonnements du client.

```typescript
const { results } = await billingService.getSubscriptions({
  is_active: true
});
```

##### `getSubscription(id)`
Récupère un abonnement par son ID.

```typescript
const subscription = await billingService.getSubscription('uuid-123');
```

##### `getInvoices(params?)`
Liste les factures du client.

```typescript
const { results } = await billingService.getInvoices({
  page: 1
});
```

##### `getInvoice(id)`
Récupère une facture par son ID.

```typescript
const invoice = await billingService.getInvoice('uuid-123');
```

---

## Services de tracking

### `trackingService`

**Import** : `import { trackingService } from './services/tracking.service';`

#### Méthodes

##### `trackClick(request)`
Enregistre un clic sur une entreprise.

```typescript
await trackingService.trackClick({
  entreprise_id: 'uuid-123',
  page_type: 'listing',
  action: 'click_website'
});
```

##### `trackView(request)`
Enregistre une vue d'entreprise.

```typescript
await trackingService.trackView({
  entreprise_id: 'uuid-123',
  page_type: 'detail'
});
```

##### `getStats(entrepriseId?)`
Récupère les statistiques de tracking.

```typescript
const stats = await trackingService.getStats('uuid-123');
// { total_clicks, total_views, click_by_action, views_by_page, ... }
```

##### `trackClickSilent(request)` / `trackViewSilent(request)`
Versions silencieuses qui n'affichent pas d'erreur en cas d'échec.

---

## Services d'export

### `exportService`

**Import** : `import { exportService } from './services/export.service';`

#### Méthodes

##### `exportEntreprises(format, params?)`
Exporte la liste des entreprises.

```typescript
const blob = await exportService.exportEntreprises('csv', {
  ville: 'Paris'
});
exportService.downloadBlob(blob, 'entreprises.csv');
```

##### `exportProLocalisations(format)`
Exporte les ProLocalisations.

```typescript
const blob = await exportService.exportProLocalisations('csv');
exportService.downloadBlob(blob, 'prolocalisations.csv');
```

##### `exportAvis(format, params?)`
Exporte les avis.

```typescript
const blob = await exportService.exportAvis('csv', {
  entreprise_id: 'uuid-123'
});
```

##### `exportPagesWordPress(params?)`
Exporte les pages WordPress.

```typescript
const blob = await exportService.exportPagesWordPress({
  ville: 'Paris'
});
```

##### `getStats(format)`
Exporte les statistiques.

```typescript
const blob = await exportService.getStats('json');
```

---

## Services ProLocalisation

### `proLocalisationService`

**Import** : `import { proLocalisationService } from './services/prolocalisation.service';`

#### Méthodes

##### `getProLocalisations(filters?)`
Liste les ProLocalisations avec filtres.

```typescript
const { results } = await proLocalisationService.getProLocalisations({
  entreprise_id: 'uuid-123',
  ville: 'Paris'
});
```

##### `getProLocalisation(id)`
Récupère une ProLocalisation par ID.

```typescript
const proLoc = await proLocalisationService.getProLocalisation('uuid-123');
```

##### `getByEntreprise(entrepriseId)`
Récupère toutes les ProLocalisations d'une entreprise.

```typescript
const proLocs = await proLocalisationService.getByEntreprise('uuid-123');
```

---

## Services de sponsorisation

### `sponsorisationService`

**Import** : `import { sponsorisationService } from './services/sponsorisation.service';`

#### Méthodes

##### `getSponsorisations(filters?)`
Liste les sponsorisations avec filtres.

```typescript
const { results } = await sponsorisationService.getSponsorisations({
  is_active: true,
  statut_paiement: 'paid'
});
```

##### `getActiveSponsorisations()`
Récupère uniquement les sponsorisations actives.

```typescript
const active = await sponsorisationService.getActiveSponsorisations();
```

---

## Services utilisateur

### `userService`

**Import** : `import { userService } from './services/user.service';`

**Note** : Réservé aux administrateurs uniquement.

#### Méthodes

##### `getUsers(filters?)`
Liste les utilisateurs avec filtres.

```typescript
const { results } = await userService.getUsers({
  role: 'CLIENT',
  is_active: true
});
```

##### `getUser(id)`
Récupère un utilisateur par ID.

```typescript
const user = await userService.getUser('uuid-123');
```

---

## Gestion des erreurs

Tous les services utilisent une gestion centralisée des erreurs.

### Exemple d'utilisation

```typescript
import { formatApiError, isValidationError } from './lib/errorHandler';

try {
  await clientService.createEntreprise(data);
} catch (error) {
  const errorMessage = formatApiError(error);
  
  if (isValidationError(error)) {
    // Afficher les erreurs de validation par champ
    const validationErrors = getValidationErrors(error);
  }
  
  console.error(errorMessage);
}
```

### Classes d'erreur personnalisées

Chaque service définit sa propre classe d'erreur :
- `AuthError`
- `ClientError`
- `BillingError`
- `TrackingError`
- `ExportError`
- `ProLocalisationError`
- `SponsorisationError`
- `UserError`

---

## Hooks React Query

Pour une utilisation dans les composants React, utilisez les hooks :

```typescript
import {
  useAuth,
  useEntreprise,
  useTracking,
  useExport,
  useUsers,
  usePermissions
} from './hooks';
```

Voir la documentation des hooks pour plus de détails.
