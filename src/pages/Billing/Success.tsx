import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export function BillingSuccess() {
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl border-2 border-green-200">
          <CardHeader className="bg-linear-to-br from-green-50 to-blue-50 border-b-2 border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Paiement confirmé</CardTitle>
                <CardDescription className="text-base">
                  Votre souscription est en cours d’activation.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-8 pb-8 space-y-4">
            <p className="text-sm text-gray-700">
              La gestion (abonnement, quotas, webhooks) est faite côté backend. Vous pouvez consulter vos
              abonnements et factures dans l’espace facturation.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="flex-1">
                <Link to="/client/account/billing">
                  Aller à la facturation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="flex-1">
                <Link to="/client/dashboard">Tableau de bord</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
