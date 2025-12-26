import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import type { RegisterData } from '@/types/auth';
import type { EnterpriseSearchResult } from '@/types/enterprise';
import { enterpriseService } from '@/services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Building2, Mail, Lock, Hash, Star, Rocket, Shield, Zap } from 'lucide-react';

export function Register() {
  const { register, loading, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const nextPath = new URLSearchParams(location.search).get('next');

  const [step, setStep] = useState<1 | 2>(1);

  // Recherche entreprise
  const [searchQuery, setSearchQuery] = useState('');
  const [codePostal, setCodePostal] = useState('');
  const [enterprises, setEnterprises] = useState<EnterpriseSearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selectedEnterprise, setSelectedEnterprise] = useState<EnterpriseSearchResult | null>(null);

  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    password_confirm: '',
    name: '',
    entreprise_id: undefined,
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const canContinueToStep2 = Boolean(selectedEnterprise?.id);

  const selectedEnterpriseLabel = useMemo(() => {
    if (!selectedEnterprise) return '';
    const parts = [selectedEnterprise.nom];
    if (selectedEnterprise.ville_nom) parts.push(selectedEnterprise.ville_nom);
    return parts.join(' • ');
  }, [selectedEnterprise]);

  useEffect(() => {
    let isCancelled = false;

    const q = searchQuery.trim();
    const cp = codePostal.trim();

    if (q.length < 3) {
      setEnterprises([]);
      setSearched(false);
      setSearching(false);
      return;
    }

    setSearching(true);

    const timer = window.setTimeout(async () => {
      try {
        const response = await enterpriseService.search({ q, code_postal: cp || undefined });
        if (isCancelled) return;
        setEnterprises(response.results);
        setSearched(true);
      } catch (err) {
        if (isCancelled) return;
        setEnterprises([]);
        setSearched(true);
        // On laisse l'erreur globale dans l'UI (localError)
        setLocalError(err instanceof Error ? err.message : 'Erreur lors de la recherche');
      } finally {
        if (!isCancelled) setSearching(false);
      }
    }, 300);

    return () => {
      isCancelled = true;
      window.clearTimeout(timer);
    };
  }, [searchQuery, codePostal]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    // Validation côté client
    if (!formData.entreprise_id) {
      setLocalError('Veuillez d\'abord sélectionner votre entreprise');
      setStep(1);
      return;
    }

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

    try {
      await register(formData);
      // Redirection après inscription réussie
      navigate(nextPath || '/client/dashboard', { replace: true });
    } catch (err) {
      // L'erreur est déjà gérée par le hook
      console.error('Erreur d\'inscription:', err);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-6xl">
        {/* Header avec avantages */}
        <div className="text-center mb-8 space-y-4">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Rocket className="h-4 w-4" />
            Commencez gratuitement
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Créez votre compte
            <span className="bg-linear-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"> FOX-Reviews</span>
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
            <CardTitle className="text-2xl font-bold text-center">
              {step === 1 ? 'Trouvez votre entreprise' : 'Créez votre compte'}
            </CardTitle>
            <CardDescription className="text-center">
              {step === 1
                ? 'Recherchez votre entreprise (minimum 3 caractères)'
                : 'Complétez vos informations pour finaliser l\'inscription'}
            </CardDescription>
          </CardHeader>
        <CardContent>
          {displayError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{displayError}</AlertDescription>
            </Alert>
          )}

          {step === 1 ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="enterprise_search">
                    <Building2 className="inline h-4 w-4 mr-1" />
                    Nom de l'entreprise <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="enterprise_search"
                    type="text"
                    autoComplete="organization"
                    disabled={loading}
                    value={searchQuery}
                    onChange={(e) => {
                      setLocalError(null);
                      setSearchQuery(e.target.value);
                    }}
                    placeholder="Ex: AURELIEN CAVE"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enterprise_cp">
                    <Hash className="inline h-4 w-4 mr-1" />
                    Code postal (optionnel)
                  </Label>
                  <Input
                    id="enterprise_cp"
                    type="text"
                    inputMode="numeric"
                    disabled={loading}
                    value={codePostal}
                    onChange={(e) => {
                      setLocalError(null);
                      setCodePostal(e.target.value.replace(/\D/g, '').slice(0, 5));
                    }}
                    placeholder="Ex: 65380"
                  />
                </div>
              </div>

              {searching && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Recherche en cours...
                </div>
              )}

              {!searching && searched && enterprises.length === 0 && searchQuery.trim().length >= 3 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Aucune entreprise trouvée. Vérifiez le nom ou le code postal.
                  </AlertDescription>
                </Alert>
              )}

              {enterprises.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {enterprises.length} entreprise(s) trouvée(s)
                  </p>
                  <div className="space-y-2 max-h-85 overflow-auto pr-1">
                    {enterprises.map((ent) => {
                      const isSelected = selectedEnterprise?.id === ent.id;
                      return (
                        <button
                          key={ent.id}
                          type="button"
                          onClick={() => {
                            setSelectedEnterprise(ent);
                            setFormData((prev) => ({
                              ...prev,
                              entreprise_id: ent.id,
                              // On garde aussi siren/siret en secours (utile si backend accepte l'un ou l'autre)
                              siren: ent.siren,
                              siret: ent.siret,
                            }));
                            setLocalError(null);
                          }}
                          className={
                            'w-full text-left rounded-lg border p-4 transition-colors ' +
                            (isSelected
                              ? 'border-orange-300 bg-orange-50'
                              : 'border-gray-200 bg-white hover:bg-gray-50')
                          }
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-gray-900">{ent.nom}</p>
                              <p className="text-xs text-muted-foreground">
                                SIREN: {ent.siren} • SIRET: {ent.siret}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {ent.adresse}, {ent.code_postal} {ent.ville_nom}
                              </p>
                            </div>
                            {isSelected && (
                              <span className="text-xs font-semibold text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
                                Sélectionnée
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  className="w-full"
                  onClick={() => {
                    setSearchQuery('');
                    setCodePostal('');
                    setEnterprises([]);
                    setSearched(false);
                    setSelectedEnterprise(null);
                    setFormData((prev) => ({ ...prev, entreprise_id: undefined, siren: undefined, siret: undefined }));
                    setLocalError(null);
                    clearError();
                  }}
                >
                  Réinitialiser
                </Button>

                <Button
                  type="button"
                  disabled={!canContinueToStep2 || loading}
                  className="w-full bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold"
                  onClick={() => {
                    if (!canContinueToStep2) return;
                    setStep(2);
                    setLocalError(null);
                    clearError();
                  }}
                >
                  Continuer →
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-sm text-muted-foreground">Entreprise sélectionnée</p>
                <p className="font-semibold text-gray-900 mt-1">{selectedEnterpriseLabel}</p>
                {selectedEnterprise && (
                  <p className="text-xs text-muted-foreground mt-1">
                    SIREN: {selectedEnterprise.siren} • SIRET: {selectedEnterprise.siret}
                  </p>
                )}
                <Button
                  type="button"
                  variant="link"
                  className="px-0 text-orange-600"
                  onClick={() => setStep(1)}
                >
                  Changer
                </Button>
              </div>

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
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    disabled={loading}
                    value={formData.name || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Jean Dupont"
                  />
                </div>
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

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  className="w-full"
                  onClick={() => setStep(1)}
                >
                  ← Retour
                </Button>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Inscription...
                    </>
                  ) : (
                    <>
                      <Rocket className="mr-2 h-5 w-5" />
                      Créer mon compte
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
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
                to={nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : '/login'}
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
