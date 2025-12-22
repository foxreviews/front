import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Eye, 
  MousePointerClick, 
  TrendingUp, 
  Crown,
  MapPin,
  Tag,
  BarChart3,
  Info,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function Visibility() {
  // TODO: Charger depuis le backend
  const visibilityData = {
    isSponsored: false,
    currentPosition: 5,
    totalCompetitors: 12,
    categories: ['Restaurants', 'Gastronomie française'],
    sousCategories: ['Restaurant traditionnel', 'Cuisine du terroir'],
    cities: ['Paris 1er', 'Paris 2ème'],
    stats: {
      impressions: {
        current: 1247,
        previous: 1112,
        change: 12.1,
      },
      clicks: {
        current: 89,
        previous: 82,
        change: 8.5,
      },
      clickRate: {
        current: 7.1,
        previous: 7.4,
        change: -4.1,
      },
    },
  };

  const monthlyData = [
    { month: 'Jan', impressions: 950, clicks: 68 },
    { month: 'Fév', impressions: 1100, clicks: 75 },
    { month: 'Mar', impressions: 1247, clicks: 89 },
  ];

  const renderTrend = (value: number) => {
    if (value > 0) {
      return (
        <span className="text-green-600 text-sm font-medium">
          +{value.toFixed(1)}%
        </span>
      );
    } else if (value < 0) {
      return (
        <span className="text-red-600 text-sm font-medium">
          {value.toFixed(1)}%
        </span>
      );
    }
    return <span className="text-muted-foreground text-sm">0%</span>;
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Visibilité & Statistiques</h1>
        <p className="text-muted-foreground mt-2">
          Suivez vos performances et votre positionnement
        </p>
      </div>

      {/* Sponsored Status */}
      <Card className={visibilityData.isSponsored ? 
        'border-2 border-yellow-200 bg-linear-to-br from-yellow-50 to-orange-50' : 
        'border-blue-200 bg-blue-50'
      }>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {visibilityData.isSponsored ? (
                  <>
                    <Crown className="h-6 w-6 text-yellow-600" />
                    Mode Sponsorisé ACTIF
                  </>
                ) : (
                  <>
                    <Zap className="h-6 w-6 text-blue-600" />
                    Mode Standard
                  </>
                )}
              </CardTitle>
              <CardDescription className={visibilityData.isSponsored ? 'text-yellow-800' : 'text-blue-800'}>
                {visibilityData.isSponsored ? 
                  'Vous bénéficiez d\'une visibilité maximale' : 
                  'Passez en mode sponsorisé pour booster votre visibilité'
                }
              </CardDescription>
            </div>
            {!visibilityData.isSponsored && (
              <Link to="/client/abonnement">
                <Button variant="default" className="bg-yellow-500 hover:bg-yellow-600">
                  <Crown className="mr-2 h-4 w-4" />
                  Passer en sponsorisé
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Position & Categories */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Votre position
            </CardTitle>
            <CardDescription>
              Dans la rotation des résultats
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Position actuelle</span>
              <Badge variant={visibilityData.isSponsored ? 'default' : 'secondary'} className="text-lg px-3 py-1">
                {visibilityData.isSponsored ? '1er' : `${visibilityData.currentPosition}ème`}
              </Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Concurrents</span>
              <span className="font-medium">{visibilityData.totalCompetitors}</span>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Progression</p>
              <Progress 
                value={((visibilityData.totalCompetitors - visibilityData.currentPosition + 1) / visibilityData.totalCompetitors) * 100} 
              />
              <p className="text-xs text-muted-foreground">
                Vous êtes mieux classé que {Math.round(((visibilityData.totalCompetitors - visibilityData.currentPosition) / visibilityData.totalCompetitors) * 100)}% des entreprises
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Zones de visibilité
            </CardTitle>
            <CardDescription>
              Catégories et villes concernées
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Catégories</Label>
              <div className="flex flex-wrap gap-2">
                {visibilityData.categories.map((cat, index) => (
                  <Badge key={index} variant="outline">
                    <Tag className="h-3 w-3 mr-1" />
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Sous-catégories</Label>
              <div className="flex flex-wrap gap-2">
                {visibilityData.sousCategories.map((cat, index) => (
                  <Badge key={index} variant="secondary">
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Villes</Label>
              <div className="flex flex-wrap gap-2">
                {visibilityData.cities.map((city, index) => (
                  <Badge key={index} variant="outline">
                    <MapPin className="h-3 w-3 mr-1" />
                    {city}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques détaillées</CardTitle>
          <CardDescription>
            Vos performances ce mois-ci
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Impressions</span>
                </div>
                {renderTrend(visibilityData.stats.impressions.change)}
              </div>
              <p className="text-3xl font-bold">{visibilityData.stats.impressions.current.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">
                vs {visibilityData.stats.impressions.previous.toLocaleString()} le mois dernier
              </p>
              <Progress value={(visibilityData.stats.impressions.current / 2000) * 100} className="mt-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Clics</span>
                </div>
                {renderTrend(visibilityData.stats.clicks.change)}
              </div>
              <p className="text-3xl font-bold">{visibilityData.stats.clicks.current}</p>
              <p className="text-xs text-muted-foreground">
                vs {visibilityData.stats.clicks.previous} le mois dernier
              </p>
              <Progress value={(visibilityData.stats.clicks.current / 200) * 100} className="mt-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Taux de clic</span>
                </div>
                {renderTrend(visibilityData.stats.clickRate.change)}
              </div>
              <p className="text-3xl font-bold">{visibilityData.stats.clickRate.current}%</p>
              <p className="text-xs text-muted-foreground">
                vs {visibilityData.stats.clickRate.previous}% le mois dernier
              </p>
              <Progress value={visibilityData.stats.clickRate.current * 10} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Evolution */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution mensuelle</CardTitle>
          <CardDescription>
            Tendances sur les 3 derniers mois
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-16 text-sm font-medium text-muted-foreground">{data.month}</div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <Progress value={(data.impressions / 2000) * 100} className="flex-1" />
                    <span className="text-sm font-medium w-16 text-right">{data.impressions}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                    <Progress value={(data.clicks / 200) * 100} className="flex-1" />
                    <span className="text-sm font-medium w-16 text-right">{data.clicks}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Comment améliorer votre visibilité ?</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>• Complétez toutes les informations de votre entreprise</p>
          <p>• Ajoutez des photos et un avis décrypté de qualité</p>
          <p>• Passez en mode sponsorisé pour une visibilité maximale</p>
          <p>• Maintenez vos informations à jour (horaires, coordonnées)</p>
        </AlertDescription>
      </Alert>
    </div>
  );
}

function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <label className={`text-sm font-medium ${className}`}>{children}</label>;
}
