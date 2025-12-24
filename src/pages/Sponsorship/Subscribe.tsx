import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Loader2, ShieldCheck, Sparkles, Star } from 'lucide-react';

import { useAuth } from '@/hooks';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

import { billingService } from '@/services/billing.service';
import { proLocalisationService } from '@/services/prolocalisation.service';
import type { ProLocalisation } from '@/types/prolocalisation';

function buildStripeReturnUrl(pathWithQuery: string) {
  // HashRouter: Stripe must return to a full URL, including "#/..."
  const base = `${window.location.origin}${window.location.pathname}`;
  const normalizedPath = pathWithQuery.startsWith('/') ? pathWithQuery : `/${pathWithQuery}`;
  return `${base}#${normalizedPath}`;
}

function withQueryParam(pathname: string, search: string, key: string, value: string) {
  const params = new URLSearchParams(search);
  params.set(key, value);
  const qs = params.toString();
  return `${pathname}${qs ? `?${qs}` : ''}`;
}

function withoutQueryParam(pathname: string, search: string, key: string) {
  const params = new URLSearchParams(search);
  params.delete(key);
  const qs = params.toString();
  return `${pathname}${qs ? `?${qs}` : ''}`;
}

export default function Subscribe() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const autoCheckout = searchParams.get('autoCheckout') === '1';
  const success = searchParams.get('success') === 'true' || searchParams.get('success') === '1';
  const canceled = searchParams.get('canceled') === 'true' || searchParams.get('canceled') === '1';

  const [loadingLocalisations, setLoadingLocalisations] = useState(false);
  const [localisations, setLocalisations] = useState<ProLocalisation[]>([]);
  const [selectedProLocalisationId, setSelectedProLocalisationId] = useState<string>('');

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const returnToWithAutoCheckout = useMemo(
    () => withQueryParam(location.pathname, location.search, 'autoCheckout', '1'),
    [location.pathname, location.search]
  );

  useEffect(() => {
    const entrepriseId = user?.entreprise_id;
    if (!isAuthenticated || !entrepriseId) return;

    let cancelled = false;

    (async () => {
      setLoadingLocalisations(true);
      setError(null);
      try {
        const results = await proLocalisationService.getByEntreprise(entrepriseId);
        if (cancelled) return;
        setLocalisations(results);
        if (results.length === 1) {
          setSelectedProLocalisationId(results[0].id);
        }
      } catch (e) {
        if (cancelled) return;
        const message = e instanceof Error ? e.message : 'Impossible de charger vos localisations.';
        setError(message);
      } finally {
        if (!cancelled) setLoadingLocalisations(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user?.entreprise_id]);

  const startCheckout = async () => {
    setError(null);

    const entrepriseId = user?.entreprise_id;
    if (!entrepriseId) {
      setError("Votre compte n'est pas encore relié à une entreprise. Créez d'abord votre entreprise dans l'espace client.");
      return;
    }

    if (localisations.length > 1 && !selectedProLocalisationId) {
      setError('Sélectionnez la ville/catégorie à sponsoriser.');
      return;
    }

    const proLocalisationId = selectedProLocalisationId || localisations[0]?.id;
    if (!proLocalisationId) {
      setError("Aucune localisation trouvée pour votre entreprise. Créez/activez d'abord une localisation.");
      return;
    }

    setProcessing(true);

    try {
      const successUrl = buildStripeReturnUrl('/sponsorisation/abonnement?success=true');
      const cancelUrl = buildStripeReturnUrl('/sponsorisation/abonnement?canceled=true');

      const { checkout_url } = await billingService.createCheckoutSession({
        pro_localisation_id: proLocalisationId,
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      window.location.href = checkout_url;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Impossible de démarrer le paiement Stripe.';
      setError(message);

      // Avoid auto-loop if we came back with autoCheckout=1
      if (autoCheckout) {
        navigate(withoutQueryParam(location.pathname, location.search, 'autoCheckout'), { replace: true });
      }
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!autoCheckout) return;

    // Wait for localisations to load, then proceed automatically.
    if (loadingLocalisations) return;

    const hasEnoughInfo =
      localisations.length === 1 || (localisations.length > 1 && !!selectedProLocalisationId);

    if (hasEnoughInfo && !processing) {
      startCheckout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, autoCheckout, loadingLocalisations, localisations.length, selectedProLocalisationId]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-linear-to-b mt-15 from-gray-50 to-white px-4 py-16">
        <div className="mx-auto w-full max-w-3xl">
          <div className="text-center space-y-3 mb-10">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold">
              <Star className="h-4 w-4 fill-current" />
              Abonnement sponsorisé
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Passez en résultat sponsorisé</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pour accéder au paiement, créez d'abord un compte client.
            </p>
          </div>

          <Card className="border-0 shadow-2xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">1 minute pour démarrer</CardTitle>
              <CardDescription>
                Compte client → puis redirection immédiate vers Stripe.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-4">
                  <Sparkles className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900">Visibilité</div>
                    <div className="text-sm text-gray-600">En tête des résultats</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-4">
                  <ShieldCheck className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900">Paiement</div>
                    <div className="text-sm text-gray-600">Sécurisé via Stripe</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-4">
                  <CreditCard className="h-5 w-5 text-gray-900 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900">Abonnement</div>
                    <div className="text-sm text-gray-600">Sans friction</div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 border border-gray-100 p-5">
                <div className="font-semibold text-gray-900">Étapes</div>
                <ol className="mt-2 text-sm text-gray-700 space-y-1 list-decimal list-inside">
                  <li>Créez votre compte client</li>
                  <li>Nous préparons votre session Stripe</li>
                  <li>Vous payez sur Stripe</li>
                </ol>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button
                className="w-full bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-6"
                onClick={() => navigate(`/register?next=${encodeURIComponent(returnToWithAutoCheckout)}`)}
              >
                Créer mon compte client
              </Button>

              <Button
                variant="outline"
                className="w-full py-6"
                onClick={() => navigate(`/login?next=${encodeURIComponent(returnToWithAutoCheckout)}`)}
              >
                J'ai déjà un compte
              </Button>

              <div className="text-center text-sm text-gray-600">
                <Link to="/" className="hover:underline">Retour à l'accueil</Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white px-4 py-16">
      <div className="mx-auto w-full max-w-3xl">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold">
            <Star className="h-4 w-4 fill-current" />
            Abonnement sponsorisé
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Finalisez votre souscription</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Vous allez être redirigé vers Stripe pour le paiement.
          </p>
        </div>

        {success && (
          <Alert className="mb-6">
            <AlertDescription>
              Paiement confirmé. Merci ! Vous pouvez retrouver votre statut dans votre espace client.
            </AlertDescription>
          </Alert>
        )}

        {canceled && (
          <Alert className="mb-6" variant="destructive">
            <AlertDescription>
              Paiement annulé. Vous pouvez réessayer quand vous voulez.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-6" variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="border-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Sponsorisation FOX-Reviews</CardTitle>
            <CardDescription>
              Sélectionnez la localisation à sponsoriser, puis continuez vers Stripe.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {loadingLocalisations ? (
              <div className="flex items-center justify-center gap-2 text-gray-600 py-6">
                <Loader2 className="h-5 w-5 animate-spin" />
                Chargement de vos localisations...
              </div>
            ) : (
              <>
                {user?.entreprise_id ? (
                  <div className="space-y-2">
                    <Label>Localisation à sponsoriser</Label>

                    {localisations.length === 0 ? (
                      <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-sm text-gray-700">
                        Aucune localisation trouvée pour votre entreprise.
                        <div className="mt-2">
                          <Link to="/client/entreprise" className="text-primary hover:underline">
                            Aller à l'espace entreprise
                          </Link>
                        </div>
                      </div>
                    ) : localisations.length === 1 ? (
                      <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                        <div className="font-semibold text-gray-900">{localisations[0].entreprise_nom}</div>
                        <div className="text-sm text-gray-700">
                          {localisations[0].sous_categorie_nom} — {localisations[0].ville_nom}
                        </div>
                      </div>
                    ) : (
                      <select
                        className="w-full h-11 rounded-md border border-gray-200 bg-white px-3 text-sm"
                        value={selectedProLocalisationId}
                        onChange={(e) => setSelectedProLocalisationId(e.target.value)}
                        disabled={processing}
                      >
                        <option value="">Sélectionnez...</option>
                        {localisations.map((pl) => (
                          <option key={pl.id} value={pl.id}>
                            {pl.entreprise_nom} — {pl.sous_categorie_nom} — {pl.ville_nom}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-sm text-gray-700">
                    Votre compte n'est pas encore associé à une entreprise.
                    <div className="mt-2">
                      <Link to="/client/entreprise" className="text-primary hover:underline">
                        Compléter mon profil entreprise
                      </Link>
                    </div>
                  </div>
                )}

                <div className="rounded-xl bg-gray-50 border border-gray-100 p-5">
                  <div className="font-semibold text-gray-900">Ce que vous obtenez</div>
                  <ul className="mt-2 text-sm text-gray-700 space-y-1 list-disc list-inside">
                    <li>Apparition prioritaire dans les résultats</li>
                    <li>Rotation équitable</li>
                    <li>Gestion depuis l'espace client</li>
                  </ul>
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              className="w-full bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-6"
              onClick={startCheckout}
              disabled={processing || loadingLocalisations || localisations.length === 0}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Redirection vers Stripe...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Continuer vers le paiement
                </>
              )}
            </Button>

            <Button variant="outline" className="w-full py-6" asChild>
              <Link to="/client/dashboard">Retour à l'espace client</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
