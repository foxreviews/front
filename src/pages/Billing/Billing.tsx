import { useBilling } from '../../hooks';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function Billing() {
  const {
    invoices,
    subscriptions,
    openPortal,
    loading,
    error,
    processing,
    downloadInvoice,
    refresh,
    formatAmount,
    formatDate,
    getStatusLabel,
  } = useBilling();

  const buildStripeReturnUrl = (pathWithQuery: string) => {
    // HashRouter: Stripe return_url must include "#/..."
    const base = `${window.location.origin}${window.location.pathname}`;
    const normalizedPath = pathWithQuery.startsWith('/') ? pathWithQuery : `/${pathWithQuery}`;
    return `${base}#${normalizedPath}`;
  };

  const handleOpenPortal = async () => {
    await openPortal(buildStripeReturnUrl('/client/account/billing'));
  };

  const getStatusVariant = (
    status: string
  ): 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' => {
    switch (status) {
      case 'active':
      case 'paid':
        return 'success';
      case 'past_due':
      case 'unpaid':
        return 'warning';
      case 'canceled':
      case 'inactive':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl p-4">
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Chargement des informations de facturation…
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-6xl p-4">
        <Card>
          <CardHeader>
            <CardTitle>Erreur de chargement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button variant="secondary" onClick={refresh}>
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl p-4 space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold leading-tight">Facturation et paiements</h1>
          <p className="text-sm text-muted-foreground">Gérez vos abonnements et consultez vos factures</p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/client/dashboard">← Retour</Link>
        </Button>
      </div>

      {/* Subscriptions */}
      {subscriptions.length > 0 ? (
        <div className="space-y-4">
          {subscriptions.map((sub) => (
            <Card key={String(sub.id)}>
              <CardHeader className="space-y-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1">
                    <CardTitle className="text-base">
                      {sub.status === 'active' ? 'Abonnement actif' : 'Abonnement'}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {sub.entreprise_nom
                        ? sub.pro_localisation_info
                          ? `${sub.entreprise_nom} • ${sub.pro_localisation_info.sous_categorie} • ${sub.pro_localisation_info.ville}`
                          : sub.entreprise_nom
                        : sub.pro_localisation_info
                          ? `${sub.pro_localisation_info.sous_categorie} • ${sub.pro_localisation_info.ville}`
                          : 'Sponsorisation'}
                    </p>
                  </div>
                  <Badge variant={getStatusVariant(sub.status)}>{getStatusLabel(sub.status)}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-md border p-3">
                    <p className="text-xs text-muted-foreground">Montant</p>
                    <p className="mt-1 text-sm font-medium">{formatAmount(sub.amount)} / mois</p>
                  </div>
                  <div className="rounded-md border p-3">
                    <p className="text-xs text-muted-foreground">Période</p>
                    <p className="mt-1 text-sm font-medium">
                      Du {formatDate(sub.current_period_start)} au {formatDate(sub.current_period_end)}
                    </p>
                  </div>
                  <div className="rounded-md border p-3">
                    <p className="text-xs text-muted-foreground">Renouvellement</p>
                    <p className="mt-1 text-sm font-medium">
                      {sub.cancel_at_period_end
                        ? 'Annulation planifiée'
                        : formatDate(sub.current_period_end)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleOpenPortal} disabled={processing}>
                    Gérer via Stripe
                  </Button>
                </div>

                {sub.status === 'past_due' && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      <span className="font-medium">Paiement en retard.</span>{' '}
                      Votre dernier paiement a échoué. Mettez à jour votre moyen de paiement via Stripe.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center space-y-3">
            <p className="text-base font-semibold">Aucun abonnement actif</p>
            <p className="text-sm text-muted-foreground">
              Passez en sponsorisé pour augmenter votre visibilité
            </p>
            <Button asChild>
              <Link to="/sponsorisation/abonnement">Souscrire à un abonnement</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base">Historique des factures</CardTitle>
            <Button
              variant="outline"
              size="icon"
              onClick={refresh}
              disabled={processing}
              aria-label="Actualiser"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune facture pour le moment</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2 pr-3 font-medium text-muted-foreground">N°</th>
                    <th className="py-2 pr-3 font-medium text-muted-foreground">Date</th>
                    <th className="py-2 pr-3 font-medium text-muted-foreground">Montant</th>
                    <th className="py-2 pr-3 font-medium text-muted-foreground">Statut</th>
                    <th className="py-2 text-right font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b last:border-b-0">
                      <td className="py-2 pr-3 font-medium">{invoice.invoice_number}</td>
                      <td className="py-2 pr-3 text-muted-foreground">{formatDate(invoice.created_at)}</td>
                      <td className="py-2 pr-3 font-medium">{formatAmount(invoice.amount_due)}</td>
                      <td className="py-2 pr-3">
                        <Badge variant={getStatusVariant(invoice.status)}>
                          {getStatusLabel(invoice.status)}
                        </Badge>
                      </td>
                      <td className="py-2">
                        <div className="flex justify-end gap-2">
                          {invoice.hosted_invoice_url && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => downloadInvoice(invoice.hosted_invoice_url!)}
                              aria-label="Voir la facture"
                            >
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </Button>
                          )}
                          {invoice.invoice_pdf && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => downloadInvoice(invoice.invoice_pdf!)}
                              aria-label="Télécharger PDF"
                            >
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Besoin d'aide ?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Si vous rencontrez un problème avec votre facturation ou avez une question sur votre
            abonnement, contactez notre support.
          </p>
          <Button variant="outline" asChild>
            <a href="mailto:support@foxreviews.com">Contacter le support</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
