import { useMemo, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, useEntreprise, useAvis } from '../../hooks';
import type { EntrepriseUpdateData } from '../../types/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function EntrepriseManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { entreprise, loading, error, updating, updateEntreprise, refresh } = useEntreprise(
    user?.entreprise_id || null
  );

  const nextPath = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const next = params.get('next');
    if (!next) return null;
    // Safety: only allow internal navigation
    if (!next.startsWith('/')) return null;
    return next;
  }, [location.search]);

  const {
    avis,
    loading: avisLoading,
    error: avisError,
    refresh: refreshAvis,
  } = useAvis(user?.entreprise_id || null);

  const [formData, setFormData] = useState<EntrepriseUpdateData>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    // Validation côté client
    if (formData.email_contact && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_contact)) {
      setLocalError('L\'adresse email est invalide');
      return;
    }

    if (formData.site_web && formData.site_web.trim()) {
      try {
        new URL(formData.site_web);
      } catch {
        setLocalError('L\'URL du site web est invalide (doit commencer par http:// ou https://)');
        return;
      }
    }

    if (formData.code_postal && !/^\d{5}$/.test(formData.code_postal)) {
      setLocalError('Le code postal doit contenir 5 chiffres');
      return;
    }

    const success = await updateEntreprise(formData);

    if (success) {
      setSuccessMessage('Les informations ont été mises à jour avec succès');
      if (nextPath) {
        navigate(nextPath);
        return;
      }
      // Auto-masquer le message après 5 secondes
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  const resetFormData = () => {
    if (entreprise) {
      setFormData({
        nom_commercial: entreprise.nom_commercial || '',
        adresse: entreprise.adresse || '',
        code_postal: entreprise.code_postal || '',
        ville_nom: entreprise.ville_nom || '',
        telephone: entreprise.telephone || '',
        email_contact: entreprise.email_contact || '',
        site_web: entreprise.site_web || '',
      });
    }
  };

  const handleCancel = () => {
    resetFormData();
    setLocalError(null);
    setSuccessMessage(null);
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl p-4">
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Chargement des informations…
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !entreprise) {
    return (
      <div className="mx-auto w-full max-w-5xl p-4">
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

  if (!entreprise) {
    return (
      <div className="mx-auto w-full max-w-5xl p-4">
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Aucune entreprise associée à votre compte
          </CardContent>
        </Card>
      </div>
    );
  }

  // Initialise le formulaire si vide
  if (!formData.nom_commercial && entreprise) {
    resetFormData();
  }

  const displayError = localError || error;

  const latestAvis = avis?.[0];

  return (
    <div className="mx-auto w-full max-w-6xl p-4 space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold leading-tight">Fiche entreprise</h1>
            <Badge>Profil</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Mettez à jour vos informations publiques et préparez la sponsorisation.
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

      {nextPath && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="text-sm font-semibold">Finaliser votre profil</div>
              <div className="text-sm text-muted-foreground">
                Complétez cette page puis vous serez renvoyé automatiquement vers la souscription.
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={handleCancel} disabled={updating}>
                Réinitialiser
              </Button>
              <Button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Voir les champs
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader className="space-y-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1">
                  <CardTitle className="text-base">Informations officielles</CardTitle>
                  <p className="text-sm text-muted-foreground">Données INSEE (non modifiables)</p>
                </div>
                <Badge variant="outline">SIREN {entreprise.siren}</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Raison sociale</p>
              <p className="text-sm font-medium">{entreprise.nom}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">SIREN</p>
              <p className="text-sm font-medium">{entreprise.siren}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">SIRET</p>
              <p className="text-sm font-medium">{entreprise.siret}</p>
            </div>
            {entreprise.naf_code && (
              <div>
                <p className="text-xs text-muted-foreground">Code NAF</p>
                <p className="text-sm font-medium">
                  {entreprise.naf_code}
                  {entreprise.naf_libelle && ` - ${entreprise.naf_libelle}`}
                </p>
              </div>
            )}
            <p className="text-xs text-muted-foreground sm:col-span-2">
              Ces informations proviennent de l'INSEE et ne peuvent pas être modifiées.
            </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-base">Informations modifiables</CardTitle>
              <p className="text-sm text-muted-foreground">
                Ces éléments s'affichent sur votre fiche publique.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nom_commercial">Nom commercial</Label>
                  <Input
                    id="nom_commercial"
                    type="text"
                    disabled={updating}
                    value={formData.nom_commercial || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, nom_commercial: e.target.value }))
                    }
                    placeholder="Nom commercial de votre entreprise"
                  />
                  <p className="text-xs text-muted-foreground">Le nom sous lequel vous êtes connu du public</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    type="tel"
                    disabled={updating}
                    value={formData.telephone || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, telephone: e.target.value }))
                    }
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="adresse">Adresse</Label>
                  <Input
                    id="adresse"
                    type="text"
                    disabled={updating}
                    value={formData.adresse || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, adresse: e.target.value }))}
                    placeholder="123 Rue de la République"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code_postal">Code postal</Label>
                  <Input
                    id="code_postal"
                    type="text"
                    inputMode="numeric"
                    pattern="\d{5}"
                    maxLength={5}
                    disabled={updating}
                    value={formData.code_postal || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        code_postal: e.target.value.replace(/\D/g, ''),
                      }))
                    }
                    placeholder="75001"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ville_nom">Ville</Label>
                  <Input
                    id="ville_nom"
                    type="text"
                    disabled={updating}
                    value={formData.ville_nom || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, ville_nom: e.target.value }))}
                    placeholder="Paris"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email_contact">Email de contact</Label>
                  <Input
                    id="email_contact"
                    type="email"
                    disabled={updating}
                    value={formData.email_contact || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email_contact: e.target.value }))
                    }
                    placeholder="contact@entreprise.com"
                  />
                  <p className="text-xs text-muted-foreground">Visible par les clients potentiels</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="site_web">Site web</Label>
                  <Input
                    id="site_web"
                    type="url"
                    disabled={updating}
                    value={formData.site_web || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, site_web: e.target.value }))}
                    placeholder="https://www.entreprise.com"
                  />
                  <p className="text-xs text-muted-foreground">Doit commencer par http:// ou https://</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="secondary" onClick={handleCancel} disabled={updating}>
                  Annuler
                </Button>
                <Button type="submit" disabled={updating}>
                  {updating ? 'Enregistrement…' : 'Enregistrer les modifications'}
                </Button>
              </div>
            </form>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-base">Avis décrypté publié</CardTitle>
            <p className="text-sm text-muted-foreground">
              Aperçu de l'avis actuellement affiché sur votre fiche publique.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" asChild>
                <Link to="/client/avis">Voir mes avis →</Link>
              </Button>
              <Button variant="secondary" onClick={refreshAvis} disabled={avisLoading}>
                Actualiser
              </Button>
            </div>

            {avisError && (
              <Alert variant="destructive">
                <AlertDescription>{avisError}</AlertDescription>
              </Alert>
            )}

            {avisLoading && !latestAvis ? (
              <div className="text-sm text-muted-foreground">Chargement de l’avis publié…</div>
            ) : !latestAvis ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Aucun avis publié pour le moment.</p>
                <Button asChild>
                  <Link to="/client/upload-avis">Uploader un avis</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={latestAvis.needs_regeneration ? 'secondary' : 'default'}>
                      {latestAvis.needs_regeneration ? 'En cours' : 'Publié'}
                    </Badge>
                    <Badge variant="outline">{latestAvis.source}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(latestAvis.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="rounded-lg border bg-card p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Texte décrypté (IA)
                    </p>
                    <p className="text-sm leading-relaxed mt-2">
                      {latestAvis.texte_decrypte || latestAvis.texte_brut}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" asChild>
                    <Link to={`/client/avis/${latestAvis.id}`}>Voir détails</Link>
                  </Button>
                  <Button asChild>
                    <Link to={`/entreprise/${latestAvis.pro_localisation}`}>Voir sur le site</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
