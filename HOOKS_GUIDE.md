# Guide d'utilisation des Hooks React Query

Ce guide explique comment utiliser les hooks React Query pour interagir avec l'API backend.

## Table des matières

1. [Hooks d'authentification](#hooks-dauthentification)
2. [Hooks Client](#hooks-client)
3. [Hooks de facturation](#hooks-de-facturation)
4. [Hooks de tracking](#hooks-de-tracking)
5. [Hooks d'export](#hooks-dexport)
6. [Hooks de permissions](#hooks-de-permissions)
7. [Patterns d'utilisation](#patterns-dutilisation)

---

## Hooks d'authentification

### `useAuth()`

Gère l'authentification de l'utilisateur.

```typescript
import { useAuth } from '@/hooks';

function LoginPage() {
  const { login, register, user, isLoading, error } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
  };

  if (isLoading) return <Loader />;
  
  return (
    <div>
      {error && <Alert>{error}</Alert>}
      {user ? <p>Connecté en tant que {user.email}</p> : <LoginForm onSubmit={handleLogin} />}
    </div>
  );
}
```

**Propriétés disponibles** :
- `user` : Utilisateur connecté ou `null`
- `isLoading` : État de chargement
- `error` : Message d'erreur éventuel
- `login(email, password)` : Fonction de connexion
- `register(data)` : Fonction d'inscription
- `logout()` : Fonction de déconnexion

### `useAccount()`

Gère le compte utilisateur (profil, mot de passe).

```typescript
import { useAccount } from '@/hooks';

function ProfilePage() {
  const { account, updateAccount, requestPasswordReset } = useAccount();

  const handleUpdate = async (data) => {
    await updateAccount(data);
  };

  return (
    <div>
      <h1>Mon profil</h1>
      <p>Email: {account?.email}</p>
      <button onClick={() => requestPasswordReset(account?.email)}>
        Réinitialiser mon mot de passe
      </button>
    </div>
  );
}
```

---

## Hooks Client

### `useDashboard()`

Récupère les statistiques du dashboard client.

```typescript
import { useDashboard } from '@/hooks';

function Dashboard() {
  const { data: stats, isLoading, error } = useDashboard();

  if (isLoading) return <Loader />;
  if (error) return <Error message={error.message} />;

  return (
    <div>
      <StatCard title="Entreprises" value={stats.total_entreprises} />
      <StatCard title="Avis" value={stats.total_avis} />
      <StatCard title="Vues" value={stats.total_vues} />
      <StatCard title="Clics" value={stats.total_clics} />
    </div>
  );
}
```

### `useEntreprise()`

Gère les entreprises du client.

```typescript
import { useEntreprise } from '@/hooks';
import { createEntrepriseSchema } from '@/lib/validation';

function EntrepriseManagement() {
  const {
    entreprises,
    isLoading,
    createEntreprise,
    updateEntreprise,
    deleteEntreprise,
  } = useEntreprise();

  const handleCreate = async (formData) => {
    // Validation avec Zod
    const validated = createEntrepriseSchema.parse(formData);
    await createEntreprise(validated);
  };

  return (
    <div>
      <h1>Mes entreprises</h1>
      {entreprises?.results.map((entreprise) => (
        <EntrepriseCard
          key={entreprise.id}
          entreprise={entreprise}
          onDelete={() => deleteEntreprise(entreprise.id)}
        />
      ))}
    </div>
  );
}
```

### `useAvis()`

Gère les avis des entreprises.

```typescript
import { useAvis } from '@/hooks';

function AvisManagement({ entrepriseId }) {
  const { avis, uploadAvis, isUploading } = useAvis(entrepriseId);

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('fichier', file);
    await uploadAvis({ entrepriseId, formData });
  };

  return (
    <div>
      <FileUpload onUpload={handleFileUpload} loading={isUploading} />
      <AvisList avis={avis?.results} />
    </div>
  );
}
```

### `useSponsorisations()`

Récupère les sponsorisations du client.

```typescript
import { useSponsorisations } from '@/hooks';

function SponsorshipPage() {
  const { data: sponsorisations, isLoading } = useSponsorisations();

  return (
    <div>
      <h1>Mes sponsorisations</h1>
      {sponsorisations?.results.map((sponsorisation) => (
        <SponsorisationCard key={sponsorisation.id} {...sponsorisation} />
      ))}
    </div>
  );
}
```

---

## Hooks de facturation

### `useBilling()`

Gère les abonnements et checkout Stripe.

```typescript
import { useBilling } from '@/hooks';

function SubscriptionPage() {
  const { subscriptions, createCheckoutSession } = useBilling();

  const handleSubscribe = async () => {
    const { checkout_url } = await createCheckoutSession({
      forfait: 'premium',
      duree_mois: 12,
      success_url: window.location.origin + '/client/success',
      cancel_url: window.location.origin + '/client/abonnement',
    });
    
    // Rediriger vers Stripe
    window.location.href = checkout_url;
  };

  return (
    <div>
      <h1>Mon abonnement</h1>
      {subscriptions?.results[0]?.is_active ? (
        <p>Abonnement actif</p>
      ) : (
        <button onClick={handleSubscribe}>S'abonner</button>
      )}
    </div>
  );
}
```

### `useInvoice()`

Gère les factures.

```typescript
import { useInvoice } from '@/hooks';

function BillingPage() {
  const { invoices, isLoading } = useInvoice();

  return (
    <div>
      <h1>Mes factures</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Montant</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {invoices?.results.map((invoice) => (
            <tr key={invoice.id}>
              <td>{new Date(invoice.date_emission).toLocaleDateString()}</td>
              <td>{invoice.montant_total} €</td>
              <td>{invoice.statut}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## Hooks de tracking

### `useTracking()`

Gère le tracking analytics (clics et vues).

```typescript
import { useTracking } from '@/hooks';

function VisibilityPage({ entrepriseId }) {
  const { stats, trackClick, trackView, isLoading } = useTracking(entrepriseId);

  // Tracker automatiquement la vue de la page
  useEffect(() => {
    if (entrepriseId) {
      trackView({
        entreprise_id: entrepriseId,
        page_type: 'visibility'
      });
    }
  }, [entrepriseId]);

  return (
    <div>
      <h1>Statistiques de visibilité</h1>
      <StatCard title="Vues totales" value={stats?.total_views} />
      <StatCard title="Clics totaux" value={stats?.total_clicks} />
    </div>
  );
}
```

### `useTrackView()` - Auto-tracking

Hook pour tracker automatiquement la vue d'un élément.

```typescript
import { useTrackView } from '@/hooks';

function EntrepriseDetailPage({ entrepriseId }) {
  // Tracker automatiquement la vue quand le composant est monté
  useTrackView({
    entreprise_id: entrepriseId,
    page_type: 'detail'
  }, true);

  return <div>Détails de l'entreprise</div>;
}
```

### `useTrackClick()` - Handler de clic

Hook pour créer des handlers de clic avec tracking.

```typescript
import { useTrackClick } from '@/hooks';

function EntrepriseCard({ entreprise }) {
  const { createClickHandler } = useTrackClick();

  const handleWebsiteClick = createClickHandler(
    {
      entreprise_id: entreprise.id,
      page_type: 'listing',
      action: 'click_website'
    },
    () => {
      window.open(entreprise.website, '_blank');
    }
  );

  return (
    <div>
      <h3>{entreprise.nom}</h3>
      <button onClick={handleWebsiteClick}>Visiter le site</button>
    </div>
  );
}
```

---

## Hooks d'export

### `useExport()`

Gère les exports de données.

```typescript
import { useExport } from '@/hooks';

function ExportPage() {
  const {
    exportEntreprises,
    exportAvis,
    isExporting,
    error
  } = useExport();

  const handleExportEntreprises = async () => {
    await exportEntreprises({
      format: 'csv',
      params: { ville: 'Paris' }
    });
  };

  return (
    <div>
      <h1>Exports</h1>
      <button onClick={handleExportEntreprises} disabled={isExporting}>
        {isExporting ? 'Export en cours...' : 'Exporter mes entreprises'}
      </button>
      {error && <Alert variant="error">{error}</Alert>}
    </div>
  );
}
```

---

## Hooks de permissions

### `usePermissions()`

Gère les permissions et rôles utilisateur.

```typescript
import { usePermissions, Permission } from '@/hooks';

function AdminPanel() {
  const {
    isAdmin,
    canCreateEntreprise,
    canExportData,
    hasPermission,
  } = usePermissions();

  if (!isAdmin) {
    return <p>Accès refusé</p>;
  }

  return (
    <div>
      <h1>Panel Admin</h1>
      {canCreateEntreprise && <button>Créer une entreprise</button>}
      {canExportData && <button>Exporter les données</button>}
      {hasPermission(Permission.MANAGE_USERS) && <button>Gérer les utilisateurs</button>}
    </div>
  );
}
```

### Composants HOC pour protéger l'accès

```typescript
import { withPermission, Permission } from '@/hooks';

// Protéger un composant avec une permission
const AdminButton = withPermission(
  ({ onClick }) => <button onClick={onClick}>Action Admin</button>,
  Permission.ACCESS_ADMIN
);

// Protéger avec plusieurs permissions (OR)
const ExportButton = withPermission(
  ({ onClick }) => <button onClick={onClick}>Exporter</button>,
  [Permission.EXPORT_DATA, Permission.ACCESS_ADMIN]
);
```

---

## Patterns d'utilisation

### 1. Gestion des erreurs

```typescript
import { formatApiError, isValidationError } from '@/lib/errorHandler';

function MyComponent() {
  const { createEntreprise } = useEntreprise();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data) => {
    try {
      setError(null);
      await createEntreprise(data);
    } catch (err) {
      const errorMessage = formatApiError(err);
      setError(errorMessage);
      
      if (isValidationError(err)) {
        // Afficher les erreurs de validation par champ
      }
    }
  };

  return (
    <div>
      {error && <Alert variant="error">{error}</Alert>}
      <Form onSubmit={handleSubmit} />
    </div>
  );
}
```

### 2. Validation avec Zod

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createEntrepriseSchema } from '@/lib/validation';

function EntrepriseForm() {
  const { createEntreprise } = useEntreprise();
  
  const form = useForm({
    resolver: zodResolver(createEntrepriseSchema)
  });

  const onSubmit = async (data) => {
    await createEntreprise(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('nom')} />
      {form.formState.errors.nom && <p>{form.formState.errors.nom.message}</p>}
      <button type="submit">Créer</button>
    </form>
  );
}
```

### 3. Pagination

```typescript
function EntrepriseList() {
  const [page, setPage] = useState(1);
  const { entreprises, isLoading } = useEntreprise({ page });

  return (
    <div>
      <EntrepriseGrid entreprises={entreprises?.results} />
      <Pagination
        current={page}
        total={Math.ceil((entreprises?.count || 0) / 10)}
        onChange={setPage}
      />
    </div>
  );
}
```

### 4. Optimistic Updates

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService } from '@/services';

function useOptimisticUpdate() {
  const queryClient = useQueryClient();

  const updateEntreprise = useMutation({
    mutationFn: ({ id, data }) => clientService.updateEntreprise(id, data),
    onMutate: async ({ id, data }) => {
      // Annuler les requêtes en cours
      await queryClient.cancelQueries({ queryKey: ['entreprises'] });
      
      // Snapshot de la valeur précédente
      const previous = queryClient.getQueryData(['entreprises']);
      
      // Mise à jour optimiste
      queryClient.setQueryData(['entreprises'], (old: any) => ({
        ...old,
        results: old.results.map((e: any) =>
          e.id === id ? { ...e, ...data } : e
        )
      }));
      
      return { previous };
    },
    onError: (err, variables, context) => {
      // Rollback en cas d'erreur
      queryClient.setQueryData(['entreprises'], context?.previous);
    },
    onSettled: () => {
      // Revalider après success ou erreur
      queryClient.invalidateQueries({ queryKey: ['entreprises'] });
    }
  });

  return { updateEntreprise };
}
```

---

## Ressources

- [Documentation React Query](https://tanstack.com/query/latest)
- [Documentation Zod](https://zod.dev/)
- [SERVICES.md](./SERVICES.md) - Documentation des services
- [API Documentation](./docs/API_ANALYSIS.md)
