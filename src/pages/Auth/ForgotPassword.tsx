import { useState, type FormEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, CheckCircle2, ArrowLeft, Info } from 'lucide-react';

export function ForgotPassword() {
  const location = useLocation();
  const nextPath = new URLSearchParams(location.search).get('next');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    // Validation
    if (!email) {
      setErrorMessage('Veuillez entrer votre adresse email');
      setStatus('error');
      return;
    }

    if (!email.includes('@')) {
      setErrorMessage('Veuillez entrer une adresse email valide');
      setStatus('error');
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStatus('success');
    } catch {
      setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-2xl space-y-6">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Mot de passe oublié
            </CardTitle>
            <CardDescription className="text-center">
              Entrez votre adresse email pour recevoir un lien de réinitialisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === 'success' ? (
              <div className="space-y-4">
                <Alert variant="success" className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <AlertTitle className="text-green-900">Email envoyé !</AlertTitle>
                  <AlertDescription className="text-green-800">
                    Si un compte existe avec l'adresse <strong>{email}</strong>, vous recevrez 
                    un email avec les instructions pour réinitialiser votre mot de passe.
                    <br /><br />
                    <span className="text-sm text-green-700">
                      Le lien sera valide pendant 24 heures.
                    </span>
                  </AlertDescription>
                </Alert>
                
                <Button asChild className="w-full" variant="outline">
                  <Link to={nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : '/login'}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour à la connexion
                  </Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {status === 'error' && errorMessage && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Adresse email</Label>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@entreprise.fr"
                    autoComplete="email"
                    disabled={status === 'sending'}
                    autoFocus
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    'Envoyer le lien de réinitialisation'
                  )}
                </Button>

                <Button asChild variant="ghost" className="w-full">
                  <Link to={nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : '/login'}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour à la connexion
                  </Link>
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Info card */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-blue-900">
              <Info className="h-5 w-5" />
              Vous n'avez pas reçu l'email ?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Vérifiez votre dossier spam ou courrier indésirable</li>
              <li>• Assurez-vous d'avoir saisi la bonne adresse email</li>
              <li>• Attendez quelques minutes avant de réessayer</li>
              <li>• Contactez le support si le problème persiste</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}