import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks';
import type { RegisterData } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Building2, Mail, Lock, Hash, Star, Rocket, Shield, Zap } from 'lucide-react';

export function Register() {
  const { register, loading, error: authError, clearError } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    password_confirm: '',
    entreprise_name: '',
    siren: '',
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    // Validation côté client
    if (!formData.email || !formData.password || !formData.password_confirm) {
      setLocalError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!formData.email.includes('@')) {
      setLocalError('Veuillez entrer une adresse email valide');
      return;
    }

    if (formData.password.length < 8) {
      setLocalError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (formData.password !== formData.password_confirm) {
      setLocalError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.siren && !/^\d{9}$/.test(formData.siren)) {
      setLocalError('Le SIREN doit contenir exactement 9 chiffres');
      return;
    }

    try {
      await register(formData);
      // Redirection gérée par le router ou le composant parent
    } catch (err) {
      // L'erreur est déjà gérée par le hook
      console.error('Erreur d\'inscription:', err);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-6xl">
        {/* Header avec avantages */}
        <div className="text-center mb-8 space-y-4">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Rocket className="h-4 w-4" />
            Commencez gratuitement
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Créez votre compte
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"> FOX-Reviews</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Rejoignez des milliers d'entreprises qui boostent leur visibilité en ligne
          </p>
          
          {/* Avantages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8">
            <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Zap className="h-5 w-5 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Configuration en 2 min</span>
            </div>
            <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Données sécurisées</span>
            </div>
            <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-green-100 p-2 rounded-lg">
                <Star className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Sans engagement</span>
            </div>
          </div>
        </div>

        <Card className="w-full max-w-3xl mx-auto shadow-2xl border-0">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Informations du compte</CardTitle>
            <CardDescription className="text-center">
              Remplissez les informations ci-dessous pour commencer
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
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Adresse email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={loading}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="vous@entreprise.fr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="entreprise_name">
                  <Building2 className="inline h-4 w-4 mr-1" />
                  Nom de l'entreprise
                </Label>
                <Input
                  id="entreprise_name"
                  type="text"
                  autoComplete="organization"
                  disabled={loading}
                  value={formData.entreprise_name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, entreprise_name: e.target.value }))
                  }
                  placeholder="Ma Super Entreprise"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="siren">
                <Hash className="inline h-4 w-4 mr-1" />
                SIREN
              </Label>
              <Input
                id="siren"
                type="text"
                pattern="\d{9}"
                maxLength={9}
                disabled={loading}
                value={formData.siren}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, siren: e.target.value.replace(/\D/g, '') }))
                }
                placeholder="123456789"
              />
              <p className="text-xs text-muted-foreground">9 chiffres</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">
                  <Lock className="inline h-4 w-4 mr-1" />
                  Mot de passe <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  disabled={loading}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, password: e.target.value }))
                  }
                  placeholder="••••••••"
                />
                <p className="text-xs text-muted-foreground">Minimum 8 caractères</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirm">
                  <Lock className="inline h-4 w-4 mr-1" />
                  Confirmer le mot de passe <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="password_confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  disabled={loading}
                  value={formData.password_confirm}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, password_confirm: e.target.value }))
                  }
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-6 text-base shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Création en cours...
                </>
              ) : (
                <>
                  <Rocket className="mr-2 h-5 w-5" />
                  Créer mon compte gratuitement
                </>
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
              <span className="bg-white px-2 text-gray-500">Déjà inscrit ?</span>
            </div>
          </div>
          <div className="text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold transition-colors"
            >
              Se connecter à mon compte
            </Link>
          </div>
          <p className="text-xs text-center text-gray-500 pt-4">
            En créant un compte, vous acceptez nos{' '}
            <Link to="/legal/terms" className="text-orange-600 hover:underline">conditions d'utilisation</Link>
            {' '}et notre{' '}
            <Link to="/legal/privacy" className="text-orange-600 hover:underline">politique de confidentialité</Link>
          </p>
        </CardFooter>
      </Card>
      </div>
    </div>
  );
}
