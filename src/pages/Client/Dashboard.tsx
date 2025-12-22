import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Eye, 
  MousePointerClick, 
  Star, 
  CreditCard,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  Building2,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function ClientDashboard() {
  // TODO: Remplacer par de vraies données du backend
  const stats = {
    impressions: 1247,
    impressionsChange: '+12%',
    clicks: 89,
    clicksChange: '+8%',
    averageRating: 4.5,
    totalReviews: 23,
  };

  const subscription = {
    status: 'active' as const,
    plan: 'Standard',
    nextBilling: '2024-01-15',
    isSponsored: false,
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground mt-2">
          Vue d'ensemble de votre visibilité et de vos performances
        </p>
      </div>

      {/* Subscription Alert */}
      {subscription.status === 'active' && !subscription.isSponsored && (
        <Alert className="border-blue-200 bg-blue-50">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <AlertTitle className="text-blue-900">
            Boostez votre visibilité !
          </AlertTitle>
          <AlertDescription className="text-blue-800">
            Passez en mode sponsorisé pour apparaître en priorité dans les résultats de recherche et 
            multiplier vos opportunités.
            <Link to="/client/abonnement">
              <Button variant="link" className="text-blue-600 p-0 h-auto ml-2">
                En savoir plus <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.impressions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600 font-medium">{stats.impressionsChange}</span> vs mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clics</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clicks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600 font-medium">{stats.clicksChange}</span> vs mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}/5</div>
            <p className="text-xs text-muted-foreground mt-1">
              Basé sur {stats.totalReviews} avis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abonnement</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscription.plan}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={subscription.status === 'active' ? 'success' : 'destructive'}>
                {subscription.status === 'active' ? (
                  <>
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Actif
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Inactif
                  </>
                )}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Subscription Info */}
        <Card>
          <CardHeader>
            <CardTitle>Mon abonnement</CardTitle>
            <CardDescription>Détails de votre formule actuelle</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Formule</span>
              <span className="font-medium">{subscription.plan}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Statut</span>
              <Badge variant={subscription.status === 'active' ? 'success' : 'destructive'}>
                {subscription.status === 'active' ? 'Actif' : 'Inactif'}
              </Badge>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Prochaine échéance</span>
              <span className="font-medium">
                {new Date(subscription.nextBilling).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Mode sponsorisé</span>
              <Badge variant={subscription.isSponsored ? 'success' : 'secondary'}>
                {subscription.isSponsored ? 'Activé' : 'Désactivé'}
              </Badge>
            </div>
            <Link to="/client/abonnement" className="block">
              <Button className="w-full mt-4">
                Gérer mon abonnement
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Visibilité ce mois-ci</CardTitle>
            <CardDescription>Évolution de votre présence</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Impressions</span>
                <span className="font-medium">{stats.impressions} / 2000</span>
              </div>
              <Progress value={(stats.impressions / 2000) * 100} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taux de clic</span>
                <span className="font-medium">
                  {((stats.clicks / stats.impressions) * 100).toFixed(1)}%
                </span>
              </div>
              <Progress value={(stats.clicks / stats.impressions) * 100} />
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Vos performances sont {((stats.clicks / stats.impressions) * 100) > 7 ? 'excellentes' : 'bonnes'} !
              </p>
              {!subscription.isSponsored && (
                <p className="text-sm text-muted-foreground">
                  💡 Le mode sponsorisé pourrait augmenter vos impressions de +300%
                </p>
              )}
            </div>

            <Link to="/client/visibilite" className="block">
              <Button variant="outline" className="w-full mt-4">
                Voir les détails
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>Gérez votre présence en quelques clics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Link to="/client/entreprise">
              <Button variant="outline" className="w-full justify-start">
                <Building2 className="mr-2 h-4 w-4" />
                Modifier mon entreprise
              </Button>
            </Link>
            <Link to="/client/avis">
              <Button variant="outline" className="w-full justify-start">
                <Star className="mr-2 h-4 w-4" />
                Gérer mes avis
              </Button>
            </Link>
            <Link to="/client/facturation">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Voir mes factures
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
