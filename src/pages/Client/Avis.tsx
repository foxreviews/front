import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Star, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Info,
  Download,
  Image as ImageIcon
} from 'lucide-react';

export function AvisManagement() {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // TODO: Charger depuis le backend
  const avisData = {
    hasAvis: true,
    avis: {
      id: '1',
      text: 'Un excellent restaurant avec une cuisine traditionnelle de qualité. L\'ambiance est chaleureuse et le service impeccable. Hautement recommandé pour une soirée en famille ou entre amis.',
      source: 'Google Reviews',
      rating: 4.5,
      date: '2024-01-15',
      author: 'Marie D.',
      verified: true,
    },
    canUpload: true,
    uploadedFiles: [
      { name: 'avis_original.pdf', uploadedAt: '2024-01-15' },
    ],
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // TODO: Appel API pour uploader le fichier
      // await avisService.uploadAvis(file);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion des avis</h1>
        <p className="text-muted-foreground mt-2">
          Consultez et gérez votre avis décrypté
        </p>
      </div>

      {/* Info Alert */}
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-900">Qu'est-ce qu'un avis décrypté ?</AlertTitle>
        <AlertDescription className="text-blue-800">
          Un avis décrypté est un avis client que vous avez collecté et que vous souhaitez afficher 
          sur votre fiche entreprise. Il doit être accompagné d'une preuve de son authenticité 
          (capture d'écran, PDF, etc.) avec mention de la source.
        </AlertDescription>
      </Alert>

      {/* Success Alert */}
      {uploadSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Votre avis a été téléchargé avec succès et sera vérifié sous 24h.
          </AlertDescription>
        </Alert>
      )}

      {/* Current Avis */}
      {avisData.hasAvis ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  Avis actuellement affiché
                </CardTitle>
                <CardDescription>
                  Cet avis est visible sur votre fiche entreprise
                </CardDescription>
              </div>
              <Badge variant="success">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Vérifié
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= avisData.avis.rating
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold">{avisData.avis.rating}/5</span>
            </div>

            <Separator />

            {/* Review Text */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Contenu de l'avis</Label>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm leading-relaxed italic">
                  "{avisData.avis.text}"
                </p>
              </div>
            </div>

            <Separator />

            {/* Review Meta */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Source</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{avisData.avis.source}</Badge>
                  {avisData.avis.verified && (
                    <Badge variant="success" className="text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Vérifié
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Auteur</Label>
                <p className="text-sm">{avisData.avis.author}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Date</Label>
                <p className="text-sm">
                  {new Date(avisData.avis.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <Separator />

            {/* Legal Notice */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Mention légale :</strong> Cet avis provient de {avisData.avis.source} 
                et a été publié le {new Date(avisData.avis.date).toLocaleDateString('fr-FR')} 
                par {avisData.avis.author}. Il est affiché conformément aux conditions d'utilisation 
                de la plateforme source.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Star className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Aucun avis affiché</h3>
                <p className="text-muted-foreground mt-1">
                  Téléchargez votre premier avis client pour enrichir votre fiche entreprise
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload New Avis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {avisData.hasAvis ? 'Remplacer l\'avis' : 'Télécharger un avis'}
          </CardTitle>
          <CardDescription>
            {avisData.hasAvis 
              ? 'Vous pouvez remplacer votre avis actuel par un nouveau' 
              : 'Téléchargez votre premier avis client'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Critères d'acceptation</AlertTitle>
            <AlertDescription className="space-y-1 text-sm">
              <p>• L'avis doit provenir d'une plateforme reconnue (Google, Trustpilot, etc.)</p>
              <p>• Vous devez fournir une preuve d'authenticité (capture d'écran, PDF)</p>
              <p>• La source et l'auteur doivent être clairement identifiables</p>
              <p>• L'avis ne doit pas contenir de contenu offensant ou trompeur</p>
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <Label className="text-sm font-medium">Documents acceptés</Label>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">PDF</span>
              </div>
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">PNG, JPG</span>
              </div>
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">Max 5 MB</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 space-y-4">
            {uploading ? (
              <div className="text-center space-y-2">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground">Téléchargement en cours...</p>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 text-muted-foreground" />
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium">Glissez-déposez votre fichier ici</p>
                  <p className="text-xs text-muted-foreground">ou cliquez pour parcourir</p>
                </div>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  disabled={uploading || !avisData.canUpload}
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={uploading || !avisData.canUpload}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choisir un fichier
                </Button>
              </>
            )}
          </div>

          {/* Uploaded Files History */}
          {avisData.uploadedFiles.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <Label className="text-sm font-medium">Fichiers téléchargés</Label>
                {avisData.uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Téléchargé le {new Date(file.uploadedAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Guidelines */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-900">Bonnes pratiques</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-yellow-800">
          <p>✓ Choisissez un avis récent (moins de 6 mois de préférence)</p>
          <p>✓ Privilégiez les avis détaillés et authentiques</p>
          <p>✓ Assurez-vous que la capture d'écran est lisible</p>
          <p>✓ Vérifiez que la source et la date sont visibles</p>
          <p>✓ L'avis sera vérifié par notre équipe sous 24h</p>
        </CardContent>
      </Card>
    </div>
  );
}

function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <label className={`text-sm font-medium ${className}`}>{children}</label>;
}
