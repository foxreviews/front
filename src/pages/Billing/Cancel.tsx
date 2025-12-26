import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, CreditCard } from 'lucide-react';

export function BillingCancel() {
  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl border-2 border-orange-200">
          <CardHeader className="bg-linear-to-br from-orange-50 to-red-50 border-b-2 border-orange-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Paiement annulé</CardTitle>
                <CardDescription className="text-base">
                  Aucun paiement n’a été effectué. Vous pouvez réessayer quand vous voulez.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-8 pb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="flex-1">
                <Link to="/upgrade">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Revenir à l’offre
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="flex-1">
                <Link to="/client/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Tableau de bord
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
