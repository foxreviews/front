import { useDashboard } from '../../hooks';
import { useAuth } from '../../hooks';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

export function ClientDashboard() {
  const { user } = useAuth();
  const { dashboard, loading, error, refresh } = useDashboard(user?.entreprise_id || null);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl p-4 space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-9 w-44 rounded-md" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-6 w-16 rounded-md" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-7 w-44" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-9 w-40 rounded-md" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-6xl p-4">
        <Card>
          <CardHeader>
            <CardTitle>Erreur de chargement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button variant="secondary" onClick={refresh}>
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="mx-auto w-full max-w-6xl p-4">
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Aucune donnée disponible
          </CardContent>
        </Card>
      </div>
    );
  }

  const { entreprise, sponsorisation, statistiques, avis_recents } = dashboard;
  const isSponsored = sponsorisation?.is_active || false;
  const statusClass = sponsorisation?.statut_paiement || 'inactive';

  return (
    <div className="mx-auto w-full max-w-6xl p-4 space-y-6">
      <div className="flex items-start justify-between gap-3 rounded-xl border border-border/50 bg-muted/20 p-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold leading-tight">Tableau de bord</h1>
          <p className="text-sm text-muted-foreground">{entreprise.nom}</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={refresh}
          aria-label="Actualiser"
          className="border-border/60 bg-background/60 hover:bg-muted/30"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="relative overflow-hidden border-border/60">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent" />
          <CardHeader className="relative space-y-2">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base">Statut Abonnement</CardTitle>
              <Badge
                variant={statusClass === 'active' ? 'default' : 'secondary'}
                className={
                  statusClass === 'active'
                    ? undefined
                    : 'border border-border/60 bg-background/60 text-foreground'
                }
              >
                {getStatusLabel(statusClass)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-3">
            <div>
              <p className="text-lg font-semibold">
                {sponsorisation
                  ? `${formatCurrency(sponsorisation.montant_mensuel)}/mois`
                  : 'Aucun abonnement actif'}
              </p>
              {sponsorisation && (
                <p className="text-sm text-muted-foreground">
                  Du {formatDate(sponsorisation.date_debut)} au {formatDate(sponsorisation.date_fin)}
                </p>
              )}
            </div>

            <Button variant="outline" asChild className="border-border/60 bg-background/60 hover:bg-muted/30">
              <Link to="/client/billing">Gérer mon abonnement</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-border/60">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent" />
          <CardHeader className="relative space-y-2">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base">Statut Sponsorisation</CardTitle>
              <Badge
                variant={isSponsored ? 'default' : 'secondary'}
                className={isSponsored ? undefined : 'border border-border/60 bg-background/60 text-foreground'}
              >
                {isSponsored ? 'ON' : 'OFF'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-3">
            <div>
              <p className="text-lg font-semibold">
                {isSponsored ? 'Sponsorisation active' : 'Non sponsorisé'}
              </p>
              {isSponsored && sponsorisation && (
                <p className="text-sm text-muted-foreground">
                  Apparition estimée dans le Top 20 : {Math.round(statistiques.rotation_position)}%
                </p>
              )}
            </div>

            {!isSponsored && (
              <Button asChild>
                <Link to="/sponsorisation/abonnement">Passer en sponsorisé</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="relative overflow-hidden border-border/60">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent" />
        <CardHeader className="relative">
          <CardTitle className="text-base">Statistiques</CardTitle>
        </CardHeader>
        <CardContent className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border/60 bg-muted/20 p-3 transition-colors hover:bg-muted/30">
            <p className="text-xs text-muted-foreground">Vues</p>
            <p className="mt-1 text-lg font-semibold text-primary">{formatNumber(statistiques.impressions_totales)}</p>
          </div>

          <div className="rounded-lg border border-border/60 bg-muted/20 p-3 transition-colors hover:bg-muted/30">
            <p className="text-xs text-muted-foreground">Clics</p>
            <p className="mt-1 text-lg font-semibold text-primary">{formatNumber(statistiques.clicks_totaux)}</p>
          </div>

          <div className="rounded-lg border border-border/60 bg-muted/20 p-3 transition-colors hover:bg-muted/30">
            <p className="text-xs text-muted-foreground">Taux de clic</p>
            <p className="mt-1 text-lg font-semibold text-primary">{(statistiques.taux_clic * 100).toFixed(2)}%</p>
          </div>

          <div className="rounded-lg border border-border/60 bg-muted/20 p-3 transition-colors hover:bg-muted/30">
            <p className="text-xs text-muted-foreground">Top 20 (estim.)</p>
            <p className="mt-1 text-lg font-semibold text-primary">{Math.round(statistiques.rotation_position)}%</p>
            <p className="text-xs text-muted-foreground">Probabilité d'apparition</p>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-border/60">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent" />
        <CardHeader className="relative space-y-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base">Avis récents</CardTitle>
            <Button variant="link" className="px-0" asChild>
              <Link to="/client/avis">Voir tous les avis →</Link>
            </Button>
          </div>
          <Separator />
        </CardHeader>
        <CardContent className="relative">
          {avis_recents.length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Aucun avis disponible</p>
              <Button asChild>
                <Link to="/client/upload-avis">Ajouter un avis</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {avis_recents.map((avis) => (
                <div
                  key={avis.id}
                  className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2 transition-colors hover:bg-muted/30"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="outline" className="border-border/60 bg-background/60">
                      {avis.source}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(avis.created_at)}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{truncateText(avis.texte_decrypte, 150)}</p>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">
                      Confiance: {(avis.confidence_score * 100).toFixed(0)}%
                    </span>
                    <Button variant="link" className="px-0" asChild>
                      <Link to={`/client/avis/${avis.id}`}>Voir détails</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-3">
          <Button variant="outline" asChild className="border-border/60 bg-background/60 hover:bg-muted/30">
            <Link to="/client/entreprise">Modifier ma fiche</Link>
          </Button>
          <Button variant="outline" asChild className="border-border/60 bg-background/60 hover:bg-muted/30">
            <Link to="/client/upload-avis">Uploader un avis</Link>
          </Button>
          <Button variant="outline" asChild className="border-border/60 bg-background/60 hover:bg-muted/30">
            <Link to="/client/billing">Mes factures</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Utility functions
function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: 'Actif',
    past_due: 'En retard',
    canceled: 'Résilié',
    inactive: 'Inactif',
    none: 'Aucun',
  };
  return labels[status] || status;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('fr-FR').format(num);
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
