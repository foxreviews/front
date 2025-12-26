import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CheckCircle2,
  Crown,
  ArrowRight,
  Sparkles,
  Settings,
  FileText,
  Loader2,
} from 'lucide-react';

export function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!sessionId) {
      // Si pas de session_id, rediriger vers le dashboard
      navigate('/client/dashboard', { replace: true });
      return;
    }

    // Countdown pour redirection automatique
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/client/dashboard', { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionId, navigate]);

  const handleGoToDashboard = () => {
    navigate('/client/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-6 shadow-2xl animate-bounce">
            <CheckCircle2 className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Paiement réussi !
          </h1>
          <p className="text-xl text-gray-600">
            Bienvenue dans le club Premium FOX-Reviews
          </p>
        </div>

        {/* Success Card */}
        <Card className="shadow-2xl border-2 border-green-200 mb-8">
          <CardHeader className="bg-gradient-to-br from-green-50 to-blue-50 border-b-2 border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Abonnement activé</CardTitle>
                <CardDescription className="text-base">
                  Votre compte Premium est maintenant actif
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-8 pb-8">
            {/* Subscription Details */}
            <div className="bg-gradient-to-r from-orange-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-orange-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg mb-1">Plan Premium</h3>
                  <p className="text-gray-600 text-sm">Abonnement mensuel</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
                    20€
                  </div>
                  <p className="text-xs text-gray-600">HT / mois</p>
                </div>
              </div>
              <div className="pt-4 border-t border-orange-200">
                <p className="text-sm text-gray-700">
                  <strong>Prochain paiement :</strong> Dans 30 jours
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  <strong>Statut :</strong>{' '}
                  <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                    <CheckCircle2 className="h-4 w-4" />
                    Actif
                  </span>
                </p>
              </div>
            </div>

            {/* Features Unlocked */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-orange-600" />
                Fonctionnalités débloquées
              </h3>
              <div className="grid gap-3">
                {[
                  'Sponsoring premium - Apparaissez en tête des résultats',
                  'Rotations dynamiques sur la page d\'accueil',
                  'Rédaction d\'avis personnalisés sur votre entreprise',
                  'Badge "Entreprise Premium" visible',
                  'Statistiques avancées en temps réel',
                  'Support prioritaire 7j/7',
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-blue-50 rounded-xl p-6 mb-6 border-2 border-blue-200">
              <h3 className="font-bold text-lg mb-3 text-blue-900">Prochaines étapes</h3>
              <ol className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-blue-800">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <span>Accédez à votre tableau de bord pour configurer votre profil premium</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-blue-800">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <span>Rédigez votre premier avis personnalisé</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-blue-800">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <span>Consultez vos statistiques de visibilité</span>
                </li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleGoToDashboard}
                size="lg"
                className="w-full bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-bold h-14"
              >
                Accéder à mon tableau de bord
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/client/billing')}
                  className="border-2"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Mes factures
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/client/billing')}
                  className="border-2"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Gérer mon abonnement
                </Button>
              </div>
            </div>

            {/* Auto redirect info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Redirection automatique dans {countdown} seconde{countdown > 1 ? 's' : ''}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Une question ? Contactez notre support à{' '}
            <a href="mailto:support@foxreviews.com" className="text-orange-600 hover:underline font-semibold">
              support@foxreviews.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
