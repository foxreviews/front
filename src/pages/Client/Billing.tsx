import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Info,
  CreditCard
} from 'lucide-react';

export function Billing() {
  // TODO: Charger depuis le backend
  const [invoices] = useState([
    {
      id: '1',
      number: 'INV-2024-001',
      amount: 29.99,
      currency: 'EUR',
      status: 'paid' as const,
      created: new Date('2024-01-01').getTime() / 1000,
      paid_at: new Date('2024-01-01').getTime() / 1000,
      invoice_pdf: '#',
      hosted_invoice_url: '#',
    },
    {
      id: '2',
      number: 'INV-2024-002',
      amount: 29.99,
      currency: 'EUR',
      status: 'paid' as const,
      created: new Date('2024-02-01').getTime() / 1000,
      paid_at: new Date('2024-02-01').getTime() / 1000,
      invoice_pdf: '#',
      hosted_invoice_url: '#',
    },
    {
      id: '3',
      number: 'INV-2024-003',
      amount: 29.99,
      currency: 'EUR',
      status: 'open' as const,
      created: new Date('2024-03-01').getTime() / 1000,
      due_date: new Date('2024-03-15').getTime() / 1000,
      invoice_pdf: '#',
      hosted_invoice_url: '#',
    },
  ]);

  const statusConfig = {
    paid: {
      variant: 'success' as const,
      icon: CheckCircle2,
      label: 'Payée',
    },
    open: {
      variant: 'warning' as const,
      icon: Clock,
      label: 'En attente',
    },
    void: {
      variant: 'secondary' as const,
      icon: AlertCircle,
      label: 'Annulée',
    },
    uncollectible: {
      variant: 'destructive' as const,
      icon: AlertCircle,
      label: 'Impayée',
    },
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const handleDownload = (invoice: typeof invoices[0]) => {
    // TODO: Implémenter le téléchargement via le backend
    console.log('Téléchargement de la facture:', invoice.number);
    if (invoice.invoice_pdf && invoice.invoice_pdf !== '#') {
      window.open(invoice.invoice_pdf, '_blank');
    }
  };

  const totalPaid = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const pendingAmount = invoices
    .filter(inv => inv.status === 'open')
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Facturation</h1>
        <p className="text-muted-foreground mt-2">
          Consultez et téléchargez vos factures
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total payé</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatAmount(totalPaid, 'EUR')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {invoices.filter(inv => inv.status === 'paid').length} facture(s) payée(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatAmount(pendingAmount, 'EUR')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {invoices.filter(inv => inv.status === 'open').length} facture(s) en attente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total factures</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Depuis le début
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Info Alert */}
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Toutes vos factures sont disponibles au format PDF. Les paiements sont gérés de manière 
          sécurisée par Stripe.
        </AlertDescription>
      </Alert>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Historique des factures
          </CardTitle>
          <CardDescription>
            Liste complète de vos factures
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune facture</h3>
              <p className="text-muted-foreground">
                Vos factures apparaîtront ici une fois que vous aurez un abonnement actif
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Facture</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date de paiement</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => {
                    const config = statusConfig[invoice.status];
                    const StatusIcon = config.icon;

                    return (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">
                          {invoice.number}
                        </TableCell>
                        <TableCell>
                          {formatDate(invoice.created)}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatAmount(invoice.amount, invoice.currency)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={config.variant}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {invoice.paid_at ? (
                            formatDate(invoice.paid_at)
                          ) : invoice.due_date ? (
                            <span className="text-sm text-muted-foreground">
                              Échéance: {formatDate(invoice.due_date)}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {invoice.hosted_invoice_url && invoice.hosted_invoice_url !== '#' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(invoice.hosted_invoice_url, '_blank')}
                              >
                                Voir
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownload(invoice)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Télécharger
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Method Info */}
      <Card>
        <CardHeader>
          <CardTitle>Moyen de paiement</CardTitle>
          <CardDescription>
            Gérez votre mode de paiement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg border p-3">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">Carte bancaire</p>
                <p className="text-sm text-muted-foreground">
                  Géré de manière sécurisée par Stripe
                </p>
              </div>
            </div>
            <Button 
              variant="outline"
              onClick={() => {
                // TODO: Rediriger vers le portail client Stripe
                console.log('Redirection vers portail client Stripe...');
              }}
            >
              Gérer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
