# FOX-Reviews Frontend

Application web de gestion d'avis et d'entreprises pour FOX-Reviews.

## 🚀 Statut de l'intégration : 96% complet

✅ **24/25 tâches complétées** - Tous les endpoints backend sont intégrés et prêts à l'emploi !

👉 **Commencer ici** : [DOCS_INDEX.md](DOCS_INDEX.md)

---

## 📚 Documentation

### Guides essentiels
- 📖 **[DOCS_INDEX.md](DOCS_INDEX.md)** - Index de toute la documentation
- 🎯 **[INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md)** - Récapitulatif de l'intégration (LIRE EN PREMIER)
- 📝 **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Guide pratique pour migrer les pages
- 🔧 **[SERVICES.md](SERVICES.md)** - Documentation des services API
- 🪝 **[HOOKS_GUIDE.md](HOOKS_GUIDE.md)** - Guide d'utilisation des hooks
- 🧹 **[CLEANUP_REPORT.md](CLEANUP_REPORT.md)** - Rapport de nettoyage du code

---

## 🛠️ Stack technique

- **React 18** + **TypeScript 5**
- **Vite** - Build tool ultra-rapide
- **React Query (TanStack Query)** - Gestion des données serveur
- **React Router** - Routing
- **Axios** - Client HTTP avec interceptors
- **Zod** - Validation de schémas
- **Tailwind CSS** - Styling

---

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build de production
npm run build

# Preview du build
npm run preview
```

---

## ⚙️ Configuration

### Variables d'environnement

Créer un fichier `.env` à la racine :

```env
VITE_API_URL=http://135.125.74.206:8003/api
VITE_API_TIMEOUT=30000
```

---

## 🎯 Fonctionnalités disponibles

### ✅ Authentification
- Login / Register
- Réinitialisation de mot de passe
- Gestion du profil utilisateur
- System de permissions (VISITEUR, CLIENT, MANAGER, ADMIN)

### ✅ Gestion des entreprises
- CRUD complet (Create, Read, Update, Delete)
- Filtres avancés (ville, catégorie, statut)
- Dashboard avec statistiques
- Upload de données

### ✅ Gestion des avis
- Liste des avis décryptés
- Filtres (note, source, dates)
- Upload de fichiers CSV/XLS
- Détail des avis

### ✅ Facturation & Abonnements
- Intégration Stripe Checkout
- Gestion des abonnements
- Historique des factures
- Téléchargement des PDF

### ✅ Tracking Analytics
- Tracking des clics (website, phone, direction)
- Tracking des vues (listing, détail)
- Statistiques détaillées
- Graphiques et visualisations

### ✅ Exports de données
- Export CSV/JSON
- Export entreprises
- Export avis
- Export WordPress
- Export statistiques

### ✅ Données de référence
- Catégories et sous-catégories
- Villes avec autocomplete
- Lookup et statistiques
- ProLocalisations
- Sponsorisations

---

## 📂 Structure du projet

```
src/
├── api/              # Configuration Axios
├── assets/           # Images, fonts, etc.
├── components/       # Composants réutilisables
│   ├── common/       # Composants communs (Badge, Loader, etc.)
│   ├── search/       # Composants de recherche
│   ├── skeleton/     # Loaders skeletons
│   └── ui/           # Composants UI (Button, Card, etc.)
├── config/           # Configuration (API, React Query)
├── hooks/            # Hooks React Query personnalisés
├── layout/           # Layouts (Header, Footer, etc.)
├── lib/              # Utilitaires (validation, errorHandler)
├── pages/            # Pages de l'application
│   ├── Auth/         # Pages d'authentification
│   ├── Client/       # Espace client
│   ├── Home/         # Page d'accueil
│   ├── Legal/        # Pages légales
│   ├── Pro/          # Pages pro
│   └── SearchPage/   # Page de recherche
├── services/         # Services API (auth, billing, client, etc.)
└── types/            # Types TypeScript
```

---

## 🔑 Services disponibles

```typescript
import {
  authService,        // Authentification
  clientService,      // Gestion client
  billingService,     // Facturation
  trackingService,    // Analytics
  exportService,      // Exports
  referenceService,   // Données de référence
  proLocalisationService,
  sponsorisationService,
  userService,        // Administration
} from '@/services';
```

---

## 🪝 Hooks disponibles

```typescript
import {
  useAuth,            // Authentification
  useAccount,         // Gestion compte
  useDashboard,       // Dashboard stats
  useEntreprise,      // Gestion entreprises
  useAvis,            // Gestion avis
  useBilling,         // Facturation
  useInvoice,         // Factures
  useTracking,        // Analytics
  useExport,          // Exports
  usePermissions,     // Permissions
  useUsers,           // Administration
} from '@/hooks';
```

---

## ✅ Checklist de migration

Voir [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) pour les détails.

- [ ] Dashboard.tsx
- [ ] Entreprise.tsx
- [ ] Avis.tsx
- [ ] Subscription.tsx
- [ ] Billing.tsx
- [ ] Visibility.tsx
- [ ] ClientLayout.tsx

---

## 🧪 Tests

```bash
# Lancer les tests (à venir)
npm run test

# Coverage
npm run test:coverage
```

---

## 📖 Documentation complète

Consulter [DOCS_INDEX.md](DOCS_INDEX.md) pour accéder à toute la documentation.

---

## 🤝 Contribution

1. Lire [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md) pour comprendre l'architecture
2. Suivre [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) pour les bonnes pratiques
3. Consulter [SERVICES.md](SERVICES.md) et [HOOKS_GUIDE.md](HOOKS_GUIDE.md) pour l'utilisation

---

## 📄 Licence

Propriétaire - Tous droits réservés

---

## 🎉 Crédits

Développé avec ❤️ pour FOX-Reviews

---

# React + TypeScript + Vite (Info technique)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
