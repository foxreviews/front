import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Zap,
  Crown,
  Loader2,
  ExternalLink,
  XCircle
} from 'lucide-react';

export function Subscription() {
  const [loading, setLoading] = useState(false);

  // TODO: Charger depuis le backend
  const subscription = {
    status: 'active' as 'active' | 'past_due' | 'canceled' | 'incomplete',
    plan: 'Standard',
    current_period_start: '2024-01-01',
    current_period_end: '2024-02-01',
    cancel_at_period_end: false,
    price: 29.99,
    isSponsored: false,
  };

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // TODO: Appeler le backend pour créer une session Stripe Checkout
      // const response = await billingService.createCheckoutSession({...});
      // window.location.href = response.checkout_url;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Redirection vers Stripe Checkout...');
    } catch (error) {
      console.error('Erreur lors de la création de la session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeToSponsored = async () => {
    setLoading(true);
    try {
      // TODO: Appeler le backend pour passer en mode sponsorisé
      // const response = await billingService.upgradeToSponsored();
      // window.location.href = response.checkout_url;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Passage en mode sponsorisé...');
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setLoading(true);
    try {
      // TODO: Appeler le backend pour résilier l'abonnement
      // await billingService.cancelSubscription();
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Résiliation programmée...');
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    active: {
      variant: 'success' as const,
      icon: CheckCircle2,
      label: 'Actif',
      description: 'Votre abonnement est actif',
    },
    past_due: {
      variant: 'warning' as const,
      icon: AlertCircle,
      label: 'Paiement en attente',
      description: 'Un paiement est en attente',
    },
    canceled: {
      variant: 'destructive' as const,
      icon: XCircle,
      label: 'Résilié',
      description: 'Votre abonnement a été résilié',
    },
    incomplete: {
      variant: 'warning' as const,
      icon: AlertCircle,
      label: 'Incomplet',
      description: 'Votre abonnement est incomplet',
    },
  };

  const currentStatus = statusConfig[subscription.status];
  const StatusIcon = currentStatus.icon;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Abonnement</h1>
        <p className="text-muted-foreground mt-2">
          Gérez votre abonnement et passez en mode sponsorisé
        </p>
      </div>

      {/* Current Subscription Status */}
      <Alert className={
        subscription.status === 'active' ? 'border-green-200 bg-green-50' :
        subscription.status === 'past_due' ? 'border-yellow-200 bg-yellow-50' :
        'border-red-200 bg-red-50'
      }>
        <StatusIcon className="h-5 w-5" />
        <AlertTitle>{currentStatus.label}</AlertTitle>
        <AlertDescription>{currentStatus.description}</AlertDescription>
      </Alert>

      {/* Subscription Details */}
      {subscription.status !== 'canceled' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Détails de l'abonnement
            </CardTitle>
            <CardDescription>
              Informations sur votre formule actuelle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Formule</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg">{subscription.plan}</span>
                {subscription.isSponsored && (
                  <Badge variant="default" className="bg-linear-to-r from-yellow-400 to-yellow-600">
                    <Crown className="h-3 w-3 mr-1" />
                    Sponsorisé
                  </Badge>
                )}
              </div>
            </div>
            <Separator />
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Statut</span>
              <Badge variant={currentStatus.variant}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {currentStatus.label}
              </Badge>
            </div>
            <Separator />
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Prix mensuel</span>
              <span className="font-medium">{subscription.price}€ / mois</span>
            </div>
            <Separator />
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Date de début</span>
              <span className="font-medium">
                {new Date(subscription.current_period_start).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <Separator />
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Prochaine échéance</span>
              <span className="font-medium">
                {new Date(subscription.current_period_end).toLocaleDateString('fr-FR')}
              </span>
            </div>

            {subscription.cancel_at_period_end && (
              <>
                <Separator />
                <Alert variant="warning" className="border-yellow-200 bg-yellow-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-yellow-800">
                    Votre abonnement sera résilié le {new Date(subscription.current_period_end).toLocaleDateString('fr-FR')}
                  </AlertDescription>
                </Alert>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sponsored Upgrade CTA */}
      {!subscription.isSponsored && subscription.status === 'active' && (
        <Card className="border-2 border-yellow-200 bg-linear-to-br from-yellow-50 to-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Crown className="h-6 w-6 text-yellow-600" />
              Passez en mode Sponsorisé
            </CardTitle>
            <CardDescription>
              Boostez votre visibilité et attirez plus de clients
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-yellow-100 p-2">
                  <TrendingUp className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Priorité dans les résultats</h4>
                  <p className="text-sm text-muted-foreground">
                    Apparaissez en premier dans votre catégorie
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-yellow-100 p-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold">+300% de visibilité</h4>
                  <p className="text-sm text-muted-foreground">
                    Multipliez vos impressions et vos clics
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-yellow-100 p-2">
                  <CheckCircle2 className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Badge "Sponsorisé"</h4>
                  <p className="text-sm text-muted-foreground">
                    Un badge distinctif qui attire l'attention
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-yellow-100 p-2">
                  <ExternalLink className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Statistiques avancées</h4>
                  <p className="text-sm text-muted-foreground">
                    Suivez vos performances en détail
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">+20€ / mois</p>
                <p className="text-sm text-muted-foreground">
                  en complément de votre abonnement actuel
                </p>
              </div>
              <Button 
                size="lg" 
                onClick={handleUpgradeToSponsored}
                disabled={loading}
                className="bg-linear-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Chargement...
                  </>
                ) : (
                  <>
                    <Crown className="mr-2 h-4 w-4" />
                    Passer en sponsorisé
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>
            Gérez votre abonnement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscription.status === 'canceled' ? (
            <Button 
              onClick={handleSubscribe} 
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Chargement...
                </>
              ) : (
                'Réactiver mon abonnement'
              )}
            </Button>
          ) : (
            <>
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    // TODO: Rediriger vers le portail client Stripe
                    console.log('Redirection vers portail client...');
                  }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Gérer le paiement
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex-1">
                      <XCircle className="mr-2 h-4 w-4" />
                      Résilier l'abonnement
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action annulera votre abonnement à la fin de la période en cours.
                        Vous pourrez continuer à utiliser le service jusqu'au {new Date(subscription.current_period_end).toLocaleDateString('fr-FR')}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleCancelSubscription}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Confirmer la résiliation
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Note importante :</strong> Toutes les actions de paiement sont gérées de manière sécurisée 
                  par notre partenaire de paiement Stripe. Vous serez redirigé vers une page sécurisée.
                </AlertDescription>
              </Alert>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
