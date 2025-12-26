import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Sparkles,
  TrendingUp,
  Edit3,
  Zap,
  Crown,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Loader2,
  Star,
  Target,
  BarChart3,
  MapPin,
} from 'lucide-react';
import { useStripe } from '@/hooks';
import { useAuth } from '@/hooks';
import { proLocalisationService } from '@/services/prolocalisation.service';
import type { ProLocalisation } from '@/types/prolocalisation';

export function Upgrade() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { createCheckout, loading, error: stripeError } = useStripe();
  const [error, setError] = useState<string | null>(null);
  const [selectedProLoc, setSelectedProLoc] = useState<string>('');
  
  // Récupérer les ProLocalisations de l'utilisateur
  const [proLocalisations, setProLocalisations] = useState<ProLocalisation[]>([]);
  const [loadingProLocs, setLoadingProLocs] = useState(true);

  useEffect(() => {
    const fetchProLocalisations = async () => {
      try {
        const entrepriseId = user?.entreprise_id;
        if (!isAuthenticated || !entrepriseId) {
          setProLocalisations([]);
          return;
        }

        const results = await proLocalisationService.getByEntreprise(entrepriseId);
        setProLocalisations(results);
        if (results.length === 1) {
          setSelectedProLoc(results[0].id);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des localisations:', err);
        setProLocalisations([]);
      } finally {
        setLoadingProLocs(false);
      }
    };
    
    fetchProLocalisations();
  }, [isAuthenticated, user?.entreprise_id]);

  const buildStripeReturnUrl = (pathWithQuery: string) => {
    const base = `${window.location.origin}${window.location.pathname}`;
    const normalizedPath = pathWithQuery.startsWith('/') ? pathWithQuery : `/${pathWithQuery}`;
    return `${base}#${normalizedPath}`;
  };

  const handleUpgrade = async () => {
    setError(null);

    if (proLocalisations.length === 0) {
      setError('Vous devez d\'abord créer une localisation professionnelle pour sponsoriser votre entreprise.');
      return;
    }

    const proLocId = selectedProLoc || proLocalisations[0]?.id;
    if (!proLocId) {
      setError('Veuillez sélectionner une localisation à sponsoriser.');
      return;
    }

    try {
      await createCheckout(
        proLocId,
        buildStripeReturnUrl('/client/billing/success'),
        buildStripeReturnUrl('/client/billing/cancel'),
        1 // 1 mois
      );
    } catch (err) {
      // L'erreur est déjà gérée par le hook
      console.error('Erreur lors de la création du checkout:', err);
    }
  };

  const handleSkip = () => {
    navigate('/client/dashboard');
  };
  
  const handleCreateProLoc = () => {
    navigate('/client/entreprise');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-purple-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-linear-to-r from-orange-500 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-4 shadow-lg">
            <Crown className="h-5 w-5" />
            Offre de lancement exclusive
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Passez au niveau{' '}
            <span className="bg-linear-to-r from-orange-500 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              supérieur
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Sponsorisez votre entreprise et multipliez votre visibilité en ligne
          </p>
        </div>

        {/* Pricing Card */}
        <Card className="max-w-4xl mx-auto shadow-2xl border-2 border-orange-200 mb-8">
          <CardHeader className="bg-linear-to-br from-orange-50 to-purple-50 border-b-2 border-orange-200 pb-8">
            <div className="text-center space-y-4">
              <CardTitle className="text-3xl font-bold">Sponsorisation Premium</CardTitle>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-6xl font-black bg-linear-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
                  99€
                </span>
                <span className="text-gray-600 text-xl">HT / mois</span>
              </div>
              <CardDescription className="text-lg">
                Sans engagement • Annulation à tout moment
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pt-8 pb-8">
            {/* Error Alert */}
            {(error || stripeError) && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error || stripeError}</AlertDescription>
              </Alert>
            )}

            {/* ProLocalisation Selection */}
            {!loadingProLocs && (
              <div className="mb-6">
                {proLocalisations.length > 0 ? (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Sélectionnez la localisation à sponsoriser
                        </h3>
                        <select
                          value={selectedProLoc}
                          onChange={(e) => setSelectedProLoc(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          {proLocalisations.map((proLoc) => (
                            <option key={proLoc.id} value={proLoc.id}>
                              {proLoc.sous_categorie_nom} - {proLoc.ville_nom}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Alert className="mb-6 border-orange-200 bg-orange-50">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      <strong>Action requise :</strong> Vous devez d'abord créer une localisation professionnelle pour pouvoir sponsoriser votre entreprise.
                      <Button
                        onClick={handleCreateProLoc}
                        variant="outline"
                        size="sm"
                        className="mt-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
                      >
                        Créer une localisation
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Feature 1 */}
              <div className="flex gap-4 p-4 bg-linear-to-br from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200">
                <div className="shrink-0">
                  <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">
                    Sponsoring Premium
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Apparaissez en tête des résultats de recherche dans votre secteur.
                    Augmentez votre visibilité jusqu'à <strong>500%</strong>.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-4 p-4 bg-linear-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
                <div className="shrink-0">
                  <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">
                    Rotations Dynamiques
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Votre entreprise apparaît en rotation sur la page d'accueil.
                    Maximisez votre exposition auprès de <strong>milliers de visiteurs</strong>.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-4 p-4 bg-linear-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
                <div className="shrink-0">
                  <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Edit3 className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">
                    Avis Personnalisé
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Rédigez vous-même un avis professionnel sur votre entreprise.
                    Contrôlez votre image et <strong>mettez en avant vos atouts</strong>.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex gap-4 p-4 bg-linear-to-br from-pink-50 to-pink-100 rounded-xl border-2 border-pink-200">
                <div className="shrink-0">
                  <div className="w-12 h-12 bg-linear-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">
                    Statistiques Avancées
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Suivez les performances de votre fiche en temps réel.
                    Analysez les <strong>vues, clics et conversions</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Benefits */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-orange-600" />
                Avantages inclus
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  'Badge "Entreprise Premium" visible',
                  'Support prioritaire 7j/7',
                  'Mise en avant dans les newsletters',
                  'Accès aux statistiques détaillées',
                  'Photos et vidéos illimitées',
                  'Réponses aux avis clients',
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                    <span className="text-gray-700 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Proof */}
            <div className="bg-linear-to-r from-orange-100 to-purple-100 rounded-xl p-6 mb-8 border-2 border-orange-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-linear-to-br from-orange-400 to-purple-500 border-2 border-white flex items-center justify-center"
                    >
                      <Star className="h-5 w-5 text-white" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-bold text-gray-900">+2 500 entreprises</p>
                  <p className="text-sm text-gray-600">ont déjà fait confiance à FOX-Reviews Premium</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Target className="h-4 w-4 text-orange-600" />
                <span>
                  <strong>+350%</strong> de visibilité en moyenne après souscription
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleUpgrade}
                disabled={loading || loadingProLocs || proLocalisations.length === 0}
                size="lg"
                className="flex-1 bg-linear-to-r from-orange-500 via-purple-600 to-pink-600 hover:from-orange-600 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-lg h-14 shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Redirection vers Stripe...
                  </>
                ) : loadingProLocs ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Chargement...
                  </>
                ) : (
                  <>
                    <Crown className="mr-2 h-5 w-5" />
                    Sponsoriser ma localisation - 99€ HT/mois
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>

            {/* Skip Link */}
            <div className="text-center mt-6">
              <button
                onClick={handleSkip}
                disabled={loading}
                className="text-gray-600 hover:text-gray-900 text-sm underline underline-offset-4 transition-colors disabled:opacity-50"
              >
                Continuer avec le compte gratuit
              </button>
            </div>

            {/* Guarantee */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                <CheckCircle2 className="inline h-4 w-4 text-green-600 mr-1" />
                Paiement sécurisé par Stripe • Annulation en un clic • Remboursement sous 14 jours
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Trust badges */}
        <div className="flex justify-center items-center gap-8 flex-wrap opacity-60">
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Paiement sécurisé
          </div>
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Sans engagement
          </div>
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Données protégées
          </div>
        </div>
      </div>
    </div>
  );
}
