import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useAvis } from '../../hooks';
import type { AvisDecrypte } from '../../types/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function ClientAvis() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const entrepriseId = user?.entreprise_id || null;

  const { avis, loading, error, refresh, hasMore, loadMore } = useAvis(entrepriseId);

  const openPublicProfile = (avisItem: AvisDecrypte) => {
    navigate(`/entreprise/${avisItem.pro_localisation}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes avis décryptés</h1>
          <p className="text-muted-foreground mt-2">
            Consultez l’avis actuellement publié et votre historique
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/client/upload-avis">Uploader un nouvel avis</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/client/dashboard">← Retour au tableau de bord</Link>
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>{error}</span>
            <Button variant="outline" onClick={refresh}>
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {loading && avis.length === 0 ? (
        <div className="text-sm text-muted-foreground">Chargement des avis…</div>
      ) : avis.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Aucun avis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Aucun avis disponible pour le moment.</p>
            <Button asChild>
              <Link to="/client/upload-avis">Ajouter un avis</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {avis.map((avisItem) => (
              <Card key={avisItem.id}>
                <CardHeader className="space-y-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={avisItem.needs_regeneration ? 'secondary' : 'default'}>
                        {avisItem.needs_regeneration ? 'En cours' : 'Publié'}
                      </Badge>
                      <Badge variant="outline">{avisItem.source}</Badge>
                      <span className="text-xs text-muted-foreground">{formatDate(avisItem.created_at)}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={() => openPublicProfile(avisItem)}
                      >
                        Voir sur le site
                      </Button>
                      <Button variant="secondary" asChild>
                        <Link to={`/client/avis/${avisItem.id}`}>Voir détails</Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Texte décrypté (IA)
                  </p>
                  <p className="text-sm leading-relaxed">
                    {truncate(avisItem.texte_decrypte || avisItem.texte_brut, 260)}
                  </p>
                  <div className="pt-2 text-xs text-muted-foreground">
                    Confiance: {(avisItem.confidence_score * 100).toFixed(0)}%
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={loadMore} disabled={loading}>
                {loading ? 'Chargement…' : 'Charger plus'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
}

function truncate(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}
