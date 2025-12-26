import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CreditCard,
  FileText,
  Settings,
  Loader2,
  ExternalLink,
  AlertCircle,
  Crown,
} from 'lucide-react';
import { useStripe } from '@/hooks';

/**
 * Composant de gestion d'abonnement Stripe
 * Affiche un bouton pour ouvrir le Customer Portal
 * Permet à l'utilisateur de:
 * - Modifier son mode de paiement
 * - Télécharger ses factures
 * - Annuler son abonnement
 * - Voir l'historique des paiements
 */
export function StripePortalButton() {
  const { loading, error, openPortal, clearError } = useStripe();
  const [isOpening, setIsOpening] = useState(false);

  const buildStripeReturnUrl = (pathWithQuery: string) => {
    // HashRouter: Stripe return_url must include "#/..."
    const base = `${window.location.origin}${window.location.pathname}`;
    const normalizedPath = pathWithQuery.startsWith('/') ? pathWithQuery : `/${pathWithQuery}`;
    return `${base}#${normalizedPath}`;
  };

  const handleOpenPortal = async () => {
    setIsOpening(true);
    clearError();

    try {
      await openPortal(buildStripeReturnUrl('/client/account/billing'));
    } catch (err) {
      setIsOpening(false);
      console.error('Erreur lors de l\'ouverture du portail:', err);
    }
  };

  return (
    <Card className="border-2 border-purple-200">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Crown className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle>Gérer mon abonnement Premium</CardTitle>
            <CardDescription>
              Accédez au portail sécurisé de gestion
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <CreditCard className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-gray-900">Modes de paiement</p>
              <p className="text-xs text-gray-600">
                Ajoutez ou modifiez vos cartes bancaires
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <FileText className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-gray-900">Factures et reçus</p>
              <p className="text-xs text-gray-600">
                Téléchargez vos factures au format PDF
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Settings className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-gray-900">Paramètres d'abonnement</p>
              <p className="text-xs text-gray-600">
                Modifier ou annuler votre abonnement
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleOpenPortal}
          disabled={loading || isOpening}
          size="lg"
          className="w-full bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold"
        >
          {loading || isOpening ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Ouverture du portail...
            </>
          ) : (
            <>
              Ouvrir le portail de gestion
              <ExternalLink className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Vous serez redirigé vers une page sécurisée Stripe
        </p>
      </CardContent>
    </Card>
  );
}
