import { useState, type FormEvent } from 'react';
import { useAuth } from '@/hooks';
import type { LoginCredentials } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Star, TrendingUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Login() {
  const { login, loading, error: authError, clearError } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    // Validation côté client
    if (!credentials.username || !credentials.password) {
      setLocalError('Veuillez remplir tous les champs');
      return;
    }

    if (!credentials.username.includes('@')) {
      setLocalError('Veuillez entrer une adresse email valide');
      return;
    }

    try {
      await login(credentials);
      // Redirection gérée par le router ou le composant parent
    } catch (err) {
      // L'erreur est déjà gérée par le hook
      console.error('Erreur de connexion:', err);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Section gauche - Illustration */}
        <div className="hidden lg:flex flex-col justify-center space-y-6 px-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold">
              <Star className="h-4 w-4 fill-current" />
              Plateforme n°1 des avis clients
            </div>
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Boostez votre
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"> visibilité </span>
              en ligne
            </h1>
            <p className="text-xl text-gray-600">
              Gérez vos avis, améliorez votre réputation et attirez plus de clients avec FOX-Reviews
            </p>
          </div>
          
          <div className="space-y-4 pt-8">
            <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="bg-orange-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">+300% de visibilité</h3>
                <p className="text-sm text-gray-600">En moyenne pour nos clients</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Gestion simplifiée</h3>
                <p className="text-sm text-gray-600">Interface intuitive et rapide</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section droite - Formulaire */}
        <Card className="w-full shadow-2xl border-0">
          <CardHeader className="space-y-2 pb-6">
            <div className="flex justify-center mb-2">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-2xl shadow-lg">
                <Star className="h-8 w-8 text-white fill-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Connexion
            </CardTitle>
            <CardDescription className="text-center text-base">
              Accédez à votre espace client entreprise
            </CardDescription>
          </CardHeader>
        <CardContent>
          {displayError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{displayError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="vous@entreprise.fr"
                disabled={loading}
                value={credentials.username}
                onChange={(e) =>
                  setCredentials((prev) => ({ ...prev, username: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                disabled={loading}
                value={credentials.password}
                onChange={(e) =>
                  setCredentials((prev) => ({ ...prev, password: e.target.value }))
                }
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-6 text-base shadow-lg hover:shadow-xl transition-all" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Nouveau sur FOX-Reviews ?</span>
            </div>
          </div>
          <div className="text-center">
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center w-full px-4 py-3 border-2 border-orange-200 rounded-lg text-orange-600 hover:bg-orange-50 font-semibold transition-colors"
            >
              Créer un compte gratuitement
            </Link>
          </div>
        </CardFooter>
      </Card>
      </div>
    </div>
  );
}
