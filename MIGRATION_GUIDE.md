# Migration des Pages Client - Guide Pratique

Ce guide fournit des exemples concrets pour remplacer les TODOs dans les pages de l'espace client.

---

## 📋 Table des matières

1. [Dashboard.tsx](#dashboardtsx)
2. [Entreprise.tsx](#entreprisetsx)
3. [Avis.tsx](#avistsx)
4. [Subscription.tsx](#subscriptiontsx)
5. [Billing.tsx](#billingtsx)
6. [Visibility.tsx](#visibilitytsx)
7. [ClientLayout.tsx](#clientlayouttsx)

---

## Dashboard.tsx

### ❌ Avant (avec TODO)
```typescript
// TODO: Remplacer par de vraies données du backend
const [stats, setStats] = useState({
  total_entreprises: 0,
  total_avis: 0,
  total_vues: 0,
  total_clics: 0,
});
```

### ✅ Après (avec hook)
```typescript
import { useDashboard } from '@/hooks';
import { Loader, EmptyState } from '@/components/common';
import { formatApiError } from '@/lib/errorHandler';

function Dashboard() {
  const { data: stats, isLoading, error } = useDashboard();

  if (isLoading) {
    return <Loader message="Chargement des statistiques..." />;
  }

  if (error) {
    return (
      <Alert variant="error">
        {formatApiError(error)}
      </Alert>
    );
  }

  if (!stats) {
    return <EmptyState message="Aucune donnée disponible" />;
  }

  return (
    <div className="dashboard">
      <StatCard
        title="Entreprises"
        value={stats.total_entreprises}
        icon={<Building />}
      />
      <StatCard
        title="Avis"
        value={stats.total_avis}
        icon={<Star />}
      />
      <StatCard
        title="Vues"
        value={stats.total_vues}
        icon={<Eye />}
      />
      <StatCard
        title="Clics"
        value={stats.total_clics}
        icon={<MousePointer />}
      />
    </div>
  );
}
```

---

## Entreprise.tsx

### ❌ Avant (avec TODO)
```typescript
// TODO: Charger les données depuis le backend
const [entreprises, setEntreprises] = useState([]);

const handleCreate = async (formData) => {
  // TODO: Appel API
  console.log('Créer entreprise:', formData);
};

const handleUpdate = async (id, formData) => {
  // TODO: Appel API
  console.log('Modifier entreprise:', id, formData);
};
```

### ✅ Après (avec hooks et validation)
```typescript
import { useEntreprise } from '@/hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createEntrepriseSchema } from '@/lib/validation';
import { formatApiError } from '@/lib/errorHandler';
import { useState } from 'react';

function EntrepriseManagement() {
  const {
    entreprises,
    isLoading,
    createEntreprise,
    updateEntreprise,
    deleteEntreprise,
    refetch,
  } = useEntreprise();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(createEntrepriseSchema),
    defaultValues: {
      nom: '',
      adresse: '',
      code_postal: '',
      ville: '',
      telephone: '',
      email: '',
      website: '',
      siret: '',
      sous_categorie: '',
      description: '',
    },
  });

  const handleCreate = async (formData) => {
    try {
      setError(null);
      setSuccess(null);
      await createEntreprise(formData);
      setSuccess('Entreprise créée avec succès !');
      form.reset();
      refetch();
    } catch (err) {
      setError(formatApiError(err));
    }
  };

  const handleUpdate = async (id: string, formData) => {
    try {
      setError(null);
      setSuccess(null);
      await updateEntreprise({ id, data: formData });
      setSuccess('Entreprise mise à jour avec succès !');
      setEditingId(null);
      refetch();
    } catch (err) {
      setError(formatApiError(err));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?')) {
      return;
    }

    try {
      setError(null);
      await deleteEntreprise(id);
      setSuccess('Entreprise supprimée avec succès !');
      refetch();
    } catch (err) {
      setError(formatApiError(err));
    }
  };

  if (isLoading) {
    return <Loader message="Chargement des entreprises..." />;
  }

  return (
    <div className="entreprise-management">
      <h1>Mes entreprises</h1>

      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Formulaire de création */}
      <form onSubmit={form.handleSubmit(handleCreate)}>
        <input {...form.register('nom')} placeholder="Nom de l'entreprise" />
        {form.formState.errors.nom && (
          <span className="error">{form.formState.errors.nom.message}</span>
        )}

        <input {...form.register('adresse')} placeholder="Adresse" />
        {form.formState.errors.adresse && (
          <span className="error">{form.formState.errors.adresse.message}</span>
        )}

        {/* Autres champs... */}

        <button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Création...' : 'Créer l\'entreprise'}
        </button>
      </form>

      {/* Liste des entreprises */}
      <div className="entreprise-list">
        {entreprises?.results.map((entreprise) => (
          <EntrepriseCard
            key={entreprise.id}
            entreprise={entreprise}
            onEdit={() => setEditingId(entreprise.id)}
            onDelete={() => handleDelete(entreprise.id)}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## Avis.tsx

### ❌ Avant (avec TODO)
```typescript
// TODO: Charger depuis le backend
const [avis, setAvis] = useState([]);

const handleUpload = async (file) => {
  // TODO: Appel API pour uploader le fichier
  console.log('Upload fichier:', file);
};
```

### ✅ Après (avec hooks)
```typescript
import { useAvis } from '@/hooks';
import { clientService } from '@/services';
import { formatApiError } from '@/lib/errorHandler';
import { useState } from 'react';

function AvisManagement({ entrepriseId }: { entrepriseId: string }) {
  const { avis, isLoading, refetch } = useAvis(entrepriseId);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation du type de fichier
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    if (!validTypes.includes(file.type)) {
      setError('Format de fichier invalide. Veuillez uploader un fichier CSV, XLS ou XLSX.');
      return;
    }

    // Validation de la taille (10 Mo max)
    if (file.size > 10 * 1024 * 1024) {
      setError('Le fichier est trop volumineux. Taille maximale : 10 Mo.');
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      setUploading(true);

      const formData = new FormData();
      formData.append('fichier', file);

      await clientService.uploadAvis(entrepriseId, formData);
      
      setSuccess(`Fichier "${file.name}" uploadé avec succès ! Les avis seront traités dans quelques instants.`);
      event.target.value = ''; // Reset input
      refetch(); // Recharger la liste
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return <Loader message="Chargement des avis..." />;
  }

  return (
    <div className="avis-management">
      <h1>Gestion des avis</h1>

      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Zone d'upload */}
      <div className="upload-zone">
        <label htmlFor="file-upload" className="upload-button">
          {uploading ? 'Upload en cours...' : 'Uploader un fichier d\'avis'}
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".csv,.xls,.xlsx"
          onChange={handleFileUpload}
          disabled={uploading}
          style={{ display: 'none' }}
        />
        <p className="upload-hint">
          Formats acceptés : CSV, XLS, XLSX (max 10 Mo)
        </p>
      </div>

      {/* Liste des avis */}
      <div className="avis-list">
        {avis?.results.length === 0 ? (
          <EmptyState message="Aucun avis pour le moment" />
        ) : (
          avis?.results.map((avis) => (
            <AvisCard key={avis.id} avis={avis} />
          ))
        )}
      </div>
    </div>
  );
}
```

---

## Subscription.tsx

### ❌ Avant (avec TODO)
```typescript
// TODO: Charger depuis le backend
const [subscription, setSubscription] = useState(null);

const handleSubscribe = async (forfait) => {
  // TODO: Appeler le backend pour créer une session Stripe Checkout
  console.log('S\'abonner au forfait:', forfait);
};
```

### ✅ Après (avec hooks)
```typescript
import { useBilling } from '@/hooks';
import { formatApiError } from '@/lib/errorHandler';
import { useState } from 'react';

function Subscription() {
  const { subscriptions, createCheckoutSession } = useBilling();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeSubscription = subscriptions?.results.find((sub) => sub.is_active);

  const handleSubscribe = async (forfait: 'basic' | 'premium' | 'enterprise', dureeMois: number) => {
    try {
      setError(null);
      setLoading(true);

      const { checkout_url } = await createCheckoutSession({
        forfait,
        duree_mois: dureeMois,
        success_url: `${window.location.origin}/client/abonnement/success`,
        cancel_url: `${window.location.origin}/client/abonnement`,
      });

      // Rediriger vers Stripe Checkout
      window.location.href = checkout_url;
    } catch (err) {
      setError(formatApiError(err));
      setLoading(false);
    }
  };

  return (
    <div className="subscription">
      <h1>Mon abonnement</h1>

      {error && <Alert variant="error">{error}</Alert>}

      {activeSubscription ? (
        <div className="active-subscription">
          <h2>Abonnement actif</h2>
          <p>Forfait : {activeSubscription.forfait}</p>
          <p>Date de fin : {new Date(activeSubscription.date_fin).toLocaleDateString()}</p>
          <p>Statut : {activeSubscription.is_active ? 'Actif' : 'Inactif'}</p>
        </div>
      ) : (
        <div className="plans">
          <h2>Choisissez votre forfait</h2>
          
          <PlanCard
            title="Basic"
            price="29€/mois"
            features={['1 entreprise', 'Avis illimités', 'Support email']}
            onSubscribe={() => handleSubscribe('basic', 12)}
            loading={loading}
          />

          <PlanCard
            title="Premium"
            price="79€/mois"
            features={['5 entreprises', 'Avis illimités', 'Support prioritaire', 'Analytics']}
            onSubscribe={() => handleSubscribe('premium', 12)}
            loading={loading}
          />

          <PlanCard
            title="Enterprise"
            price="199€/mois"
            features={['Entreprises illimitées', 'Tout inclus', 'Support dédié']}
            onSubscribe={() => handleSubscribe('enterprise', 12)}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
}
```

---

## Billing.tsx

### ❌ Avant (avec TODO)
```typescript
// TODO: Charger depuis le backend
const [invoices, setInvoices] = useState([]);

const handleDownload = (invoiceId) => {
  // TODO: Implémenter le téléchargement via le backend
  console.log('Télécharger la facture:', invoiceId);
};
```

### ✅ Après (avec hooks)
```typescript
import { useInvoice } from '@/hooks';
import { formatApiError } from '@/lib/errorHandler';

function Billing() {
  const { invoices, isLoading, error } = useInvoice();

  const handleDownload = (invoice) => {
    if (invoice.stripe_invoice_pdf) {
      window.open(invoice.stripe_invoice_pdf, '_blank');
    } else {
      alert('PDF de facture non disponible');
    }
  };

  if (isLoading) {
    return <Loader message="Chargement des factures..." />;
  }

  if (error) {
    return <Alert variant="error">{formatApiError(error)}</Alert>;
  }

  return (
    <div className="billing">
      <h1>Mes factures</h1>

      {invoices?.results.length === 0 ? (
        <EmptyState message="Aucune facture pour le moment" />
      ) : (
        <table className="invoices-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Numéro</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices?.results.map((invoice) => (
              <tr key={invoice.id}>
                <td>{new Date(invoice.date_emission).toLocaleDateString('fr-FR')}</td>
                <td>{invoice.numero_facture}</td>
                <td>{invoice.montant_total.toFixed(2)} €</td>
                <td>
                  <Badge variant={invoice.statut === 'paid' ? 'success' : 'warning'}>
                    {invoice.statut === 'paid' ? 'Payée' : 'En attente'}
                  </Badge>
                </td>
                <td>
                  <button
                    onClick={() => handleDownload(invoice)}
                    disabled={!invoice.stripe_invoice_pdf}
                  >
                    Télécharger PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
```

---

## Visibility.tsx

### ❌ Avant (avec TODO)
```typescript
// TODO: Charger depuis le backend
const [stats, setStats] = useState({
  total_views: 0,
  total_clicks: 0,
});
```

### ✅ Après (avec hooks)
```typescript
import { useTracking } from '@/hooks';
import { formatApiError } from '@/lib/errorHandler';
import { useEffect } from 'react';

function Visibility({ entrepriseId }: { entrepriseId: string }) {
  const { stats, isLoading, error, trackView } = useTracking(entrepriseId);

  // Tracker la vue de la page automatiquement
  useEffect(() => {
    if (entrepriseId) {
      trackView({
        entreprise_id: entrepriseId,
        page_type: 'visibility',
      });
    }
  }, [entrepriseId]);

  if (isLoading) {
    return <Loader message="Chargement des statistiques..." />;
  }

  if (error) {
    return <Alert variant="error">{formatApiError(error)}</Alert>;
  }

  return (
    <div className="visibility">
      <h1>Visibilité</h1>

      <div className="stats-grid">
        <StatCard
          title="Vues totales"
          value={stats?.total_views || 0}
          icon={<Eye />}
          trend={stats?.views_trend}
        />

        <StatCard
          title="Clics totaux"
          value={stats?.total_clicks || 0}
          icon={<MousePointer />}
          trend={stats?.clicks_trend}
        />

        <StatCard
          title="Taux de clic"
          value={
            stats?.total_views
              ? `${((stats.total_clicks / stats.total_views) * 100).toFixed(1)}%`
              : '0%'
          }
          icon={<TrendingUp />}
        />
      </div>

      {/* Graphiques détaillés */}
      {stats?.click_by_action && (
        <div className="chart-container">
          <h2>Clics par action</h2>
          <BarChart data={stats.click_by_action} />
        </div>
      )}

      {stats?.views_by_page && (
        <div className="chart-container">
          <h2>Vues par page</h2>
          <PieChart data={stats.views_by_page} />
        </div>
      )}
    </div>
  );
}
```

---

## ClientLayout.tsx

### ❌ Avant (avec TODO)
```typescript
const handleLogout = () => {
  // TODO: Implement logout logic
  console.log('Logout');
};
```

### ✅ Après (avec service)
```typescript
import { authService } from '@/services';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

function ClientLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    // Supprimer le token et les données utilisateur
    authService.logout();
    
    // Vider le cache React Query
    queryClient.clear();
    
    // Rediriger vers la page de connexion
    navigate('/login', { replace: true });
  };

  return (
    <div className="client-layout">
      <header>
        <nav>
          <NavLink to="/client/dashboard">Dashboard</NavLink>
          <NavLink to="/client/entreprise">Entreprises</NavLink>
          <NavLink to="/client/avis">Avis</NavLink>
          <NavLink to="/client/abonnement">Abonnement</NavLink>
          <NavLink to="/client/facturation">Facturation</NavLink>
          <NavLink to="/client/visibilite">Visibilité</NavLink>
        </nav>
        <button onClick={handleLogout} className="logout-button">
          Déconnexion
        </button>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
```

---

## 🎯 Checklist finale

- [ ] Remplacer les TODOs dans Dashboard.tsx
- [ ] Remplacer les TODOs dans Entreprise.tsx
- [ ] Remplacer les TODOs dans Avis.tsx
- [ ] Remplacer les TODOs dans Subscription.tsx
- [ ] Remplacer les TODOs dans Billing.tsx
- [ ] Remplacer les TODOs dans Visibility.tsx
- [ ] Remplacer le TODO dans ClientLayout.tsx
- [ ] Tester chaque page avec le backend
- [ ] Vérifier les erreurs dans la console
- [ ] Tester sur différents navigateurs

---

## 📚 Ressources

- [SERVICES.md](./SERVICES.md) - Documentation des services
- [HOOKS_GUIDE.md](./HOOKS_GUIDE.md) - Guide des hooks
- [lib/validation.ts](./src/lib/validation.ts) - Schémas de validation
- [lib/errorHandler.ts](./src/lib/errorHandler.ts) - Gestion des erreurs
