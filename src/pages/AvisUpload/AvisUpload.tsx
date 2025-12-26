import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useAvis, useDashboard } from '../../hooks';
import type { AvisStatus } from '../../types/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';

export function AvisUpload() {
  const { user } = useAuth();
  const entrepriseId = user?.entreprise_id || null;
  const { dashboard, loading: dashboardLoading } = useDashboard(entrepriseId);
  const hasActiveSubscription = !!dashboard?.sponsorisation?.is_active;
  const isGated = !dashboardLoading && dashboard != null && !hasActiveSubscription;

  const { avis, loading, error, uploading, uploadAvis, refresh } = useAvis(
    hasActiveSubscription ? entrepriseId : null
  );

  const [texteAvis, setTexteAvis] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const characterCount = texteAvis.length;
  const minCharacters = 50;
  const isValid = characterCount >= minCharacters;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    if (!isValid) {
      setLocalError(`L'avis doit contenir au moins ${minCharacters} caractères`);
      return;
    }

    const success = await uploadAvis(texteAvis);

    if (success) {
      setSuccessMessage(
        'Votre avis a été envoyé avec succès et est en cours de traitement par notre IA'
      );
      setTexteAvis('');
      // Auto-masquer le message après 5 secondes
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  const getStatusBadge = (status: AvisStatus) => {
    const badges: Record<AvisStatus, { label: string; class: string }> = {
      pending: { label: 'En attente', class: 'status-pending' },
      validated: { label: 'Validé', class: 'status-validated' },
      rejected: { label: 'Refusé', class: 'status-rejected' },
    };
    return badges[status];
  };

  const displayError = localError || error;

  return (
    <div className="mx-auto w-full max-w-6xl p-4 space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold leading-tight">Upload d'avis de remplacement</h1>
          <p className="text-sm text-muted-foreground">
            Remplacez votre avis actuel en envoyant un nouveau contenu
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/client/dashboard">← Retour</Link>
        </Button>
      </div>

      {successMessage && (
        <Alert>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {displayError && (
        <Alert variant="destructive">
          <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      )}

      {!dashboardLoading && dashboard && !hasActiveSubscription && (
        <Alert variant="destructive">
          <AlertDescription>
            La gestion des avis est disponible uniquement après le démarrage de votre abonnement.
            <Button asChild className="ml-2" variant="secondary">
              <Link to="/client/billing">Voir mes abonnements</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {dashboardLoading ? (
        <p className="text-sm text-muted-foreground">Chargement de votre abonnement…</p>
      ) : isGated ? null : (
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nouvel avis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Fournissez un avis authentique qui représente bien votre entreprise.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="texte_avis">Texte de l'avis</Label>
                  <span
                    className={
                      characterCount === 0
                        ? 'text-xs text-muted-foreground'
                        : characterCount >= minCharacters
                          ? 'text-xs text-muted-foreground'
                          : 'text-xs text-destructive'
                    }
                  >
                    {characterCount} / {minCharacters}
                  </span>
                </div>
                <textarea
                  id="texte_avis"
                  rows={8}
                  disabled={uploading}
                  value={texteAvis}
                  onChange={(e) => setTexteAvis(e.target.value)}
                  className={
                    `w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm ` +
                    `placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 ` +
                    `focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ` +
                    `${!isValid && characterCount > 0 ? 'border-destructive' : ''}`
                  }
                  placeholder="Notre entreprise offre des services de qualité depuis 2010..."
                />
                <p className="text-xs text-muted-foreground">Minimum {minCharacters} caractères.</p>
              </div>

              <div className="rounded-md border p-3 text-sm">
                <p className="font-medium">Conseils</p>
                <ul className="mt-2 list-disc pl-5 text-muted-foreground space-y-1">
                  <li>Décrivez vos services et votre expertise</li>
                  <li>Mentionnez vos points forts et valeurs</li>
                  <li>Restez authentique et professionnel</li>
                </ul>
              </div>

              <Button type="submit" disabled={uploading || !isValid} className="w-full">
                {uploading ? 'Traitement en cours…' : "Envoyer l'avis"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base">Historique</CardTitle>
              <Button
                variant="outline"
                size="icon"
                onClick={refresh}
                disabled={loading}
                aria-label="Actualiser l'historique"
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
          </CardHeader>
          <CardContent>
            {loading && avis.length === 0 ? (
              <p className="text-sm text-muted-foreground">Chargement…</p>
            ) : avis.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun avis envoyé pour le moment.</p>
            ) : (
              <div className="space-y-3">
                {avis.map((avisItem, index) => {
                  const status: AvisStatus = avisItem.needs_regeneration ? 'pending' : 'validated';
                  const statusInfo = getStatusBadge(status);
                  return (
                    <div key={avisItem.id || index} className="rounded-md border p-3 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={status === 'validated' ? 'default' : 'secondary'}>
                            {statusInfo.label}
                          </Badge>
                          <Badge variant="outline">{avisItem.source}</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(avisItem.created_at).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Texte original</p>
                          <p className="text-sm leading-relaxed">{avisItem.texte_brut}</p>
                        </div>

                        {avisItem.texte_decrypte && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Texte décrypté (IA)</p>
                            <p className="text-sm leading-relaxed">{avisItem.texte_decrypte}</p>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Score de confiance: {(avisItem.confidence_score * 100).toFixed(0)}%
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      )}
    </div>
  );
}
