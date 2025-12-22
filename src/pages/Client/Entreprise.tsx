import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';

export function EntrepriseManagement() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // TODO: Charger les données depuis le backend
  const [formData, setFormData] = useState({
    nom: 'Ma Super Entreprise',
    nom_commercial: 'Super Entreprise',
    adresse: '123 Rue de Example',
    code_postal: '75001',
    ville: 'Paris',
    telephone: '01 23 45 67 89',
    email: 'contact@entreprise.fr',
    site_web: 'https://www.entreprise.fr',
    description: 'Description de l\'entreprise...',
    horaires: {
      lundi: '09:00 - 18:00',
      mardi: '09:00 - 18:00',
      mercredi: '09:00 - 18:00',
      jeudi: '09:00 - 18:00',
      vendredi: '09:00 - 18:00',
      samedi: 'Fermé',
      dimanche: 'Fermé',
    }
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // TODO: Appel API
      // await clientService.updateEntreprise(formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Une erreur est survenue lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (passwordData.new !== passwordData.confirm) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (passwordData.new.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      setLoading(false);
      return;
    }

    try {
      // TODO: Appel API
      // await authService.changePassword(passwordData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setPasswordData({ current: '', new: '', confirm: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mon entreprise</h1>
        <p className="text-muted-foreground mt-2">
          Gérez les informations de votre entreprise et votre compte utilisateur
        </p>
      </div>

      {/* Success Alert */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Les modifications ont été enregistrées avec succès
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Enterprise Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informations de l'entreprise
          </CardTitle>
          <CardDescription>
            Ces informations seront visibles sur votre fiche entreprise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom de l'entreprise</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Cette information ne peut pas être modifiée
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nom_commercial">Nom commercial</Label>
                <Input
                  id="nom_commercial"
                  value={formData.nom_commercial}
                  onChange={(e) => setFormData({ ...formData, nom_commercial: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="adresse">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Adresse
                </Label>
                <Input
                  id="adresse"
                  value={formData.adresse}
                  onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="code_postal">Code postal</Label>
                  <Input
                    id="code_postal"
                    value={formData.code_postal}
                    onChange={(e) => setFormData({ ...formData, code_postal: e.target.value })}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ville">Ville</Label>
                  <Input
                    id="ville"
                    value={formData.ville}
                    onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="telephone">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Téléphone
                </Label>
                <Input
                  id="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email de contact
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="site_web">
                <Globe className="inline h-4 w-4 mr-1" />
                Site web
              </Label>
              <Input
                id="site_web"
                type="url"
                value={formData.site_web}
                onChange={(e) => setFormData({ ...formData, site_web: e.target.value })}
                disabled={loading}
                placeholder="https://www.exemple.fr"
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={loading}
                className="flex min-h-30 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Décrivez votre entreprise..."
              />
            </div>

            <Separator />

            {/* Horaires */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Horaires d'ouverture
              </Label>
              <div className="grid gap-3">
                {Object.entries(formData.horaires).map(([jour, horaire]) => (
                  <div key={jour} className="grid grid-cols-3 gap-4 items-center">
                    <Label className="capitalize">{jour}</Label>
                    <Input
                      value={horaire}
                      onChange={(e) => setFormData({
                        ...formData,
                        horaires: { ...formData.horaires, [jour]: e.target.value }
                      })}
                      disabled={loading}
                      placeholder="09:00 - 18:00"
                      className="col-span-2"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" disabled={loading}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  'Enregistrer les modifications'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle>Modifier le mot de passe</CardTitle>
          <CardDescription>
            Changez votre mot de passe pour sécuriser votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current_password">Mot de passe actuel</Label>
              <Input
                id="current_password"
                type="password"
                value={passwordData.current}
                onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_password">Nouveau mot de passe</Label>
              <Input
                id="new_password"
                type="password"
                value={passwordData.new}
                onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">Minimum 8 caractères</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirmer le nouveau mot de passe</Label>
              <Input
                id="confirm_password"
                type="password"
                value={passwordData.confirm}
                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Modification...
                  </>
                ) : (
                  'Modifier le mot de passe'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
