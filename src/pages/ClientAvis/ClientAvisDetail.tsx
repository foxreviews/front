import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { clientService, ClientError } from '../../services/client.service';
import type { AvisDecrypte } from '../../types/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

export function ClientAvisDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [avis, setAvis] = useState<AvisDecrypte | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError('Identifiant d’avis manquant');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await clientService.getAvisDecrypte(id);
        setAvis(data);
      } catch (err) {
        const message = err instanceof ClientError ? err.message : 'Impossible de charger l’avis';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">Chargement de l’avis…</div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Erreur de chargement</AlertTitle>
        <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>{error}</span>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/client/avis">← Retour</Link>
            </Button>
            <Button variant="secondary" onClick={() => navigate(0)}>
              Réessayer
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (!avis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aucun avis trouvé</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild>
            <Link to="/client/avis">← Retour</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Détail de l’avis</h1>
          <p className="text-muted-foreground mt-2">
            Source: {avis.source} • {formatDate(avis.created_at)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => navigate(`/entreprise/${avis.pro_localisation}`)}>
            Voir sur le site
          </Button>
          <Button variant="outline" asChild>
            <Link to="/client/avis">← Retour à la liste</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={avis.needs_regeneration ? 'secondary' : 'default'}>
              {avis.needs_regeneration ? 'En cours' : 'Publié'}
            </Badge>
            <Badge variant="outline">{avis.source}</Badge>
            <span className="text-xs text-muted-foreground">
              Confiance: {(avis.confidence_score * 100).toFixed(0)}%
            </span>
          </div>

          <Separator />

          <div className="grid gap-2 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Généré</span>
              <span className="font-medium">{formatDate(avis.date_generation)}</span>
            </div>
            {avis.date_expiration && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Expiration</span>
                <span className="font-medium">{formatDate(avis.date_expiration)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Texte original</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{avis.texte_brut}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Texte décrypté (IA)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{avis.texte_decrypte || '—'}</p>
        </CardContent>
      </Card>
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
