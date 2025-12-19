import { useBilling } from '../../hooks';
import './Billing.css';

export function Billing() {
  const {
    invoices,
    subscription,
    loading,
    error,
    processing,
    cancelSubscription,
    reactivateSubscription,
    downloadInvoice,
    refresh,
    formatAmount,
    formatDate,
    getStatusLabel,
  } = useBilling();

  const handleCancelSubscription = async () => {
    if (!subscription?.id) return;

    const confirmed = window.confirm(
      'Êtes-vous sûr de vouloir annuler votre abonnement ? Il restera actif jusqu\'à la fin de la période en cours.'
    );

    if (confirmed) {
      await cancelSubscription(subscription.id);
    }
  };

  const handleReactivateSubscription = async () => {
    if (!subscription?.id) return;

    const success = await reactivateSubscription(subscription.id);
    if (success) {
      alert('Votre abonnement a été réactivé avec succès');
    }
  };

  if (loading) {
    return (
      <div className="billing-container">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Chargement des informations de facturation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="billing-container">
        <div className="error-state">
          <svg className="error-icon-large" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <h2>Erreur de chargement</h2>
          <p>{error}</p>
          <button onClick={refresh} className="btn-secondary">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="billing-container">
      <div className="billing-header">
        <div>
          <h1 className="page-title">Facturation et paiements</h1>
          <p className="page-subtitle">Gérez vos abonnements et consultez vos factures</p>
        </div>
        <a href="/client/dashboard" className="btn-outline">
          ← Retour au tableau de bord
        </a>
      </div>

      {/* Subscription Card */}
      {subscription && (
        <div className="subscription-card">
          <div className="subscription-header">
            <div>
              <h2 className="card-title">Abonnement actuel</h2>
              <p className="card-subtitle">Gérez votre abonnement sponsorisé</p>
            </div>
            <span className={`subscription-status status-${subscription.status}`}>
              {getStatusLabel(subscription.status)}
            </span>
          </div>

          <div className="subscription-details">
            <div className="detail-item">
              <span className="detail-label">Montant</span>
              <span className="detail-value">
                {formatAmount(subscription.amount)} / mois
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Période en cours</span>
              <span className="detail-value">
                Du {formatDate(subscription.current_period_start)} au{' '}
                {formatDate(subscription.current_period_end)}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Prochain paiement</span>
              <span className="detail-value">
                {subscription.cancel_at_period_end
                  ? 'Annulation planifiée'
                  : formatDate(subscription.current_period_end)}
              </span>
            </div>
          </div>

          <div className="subscription-actions">
            {subscription.status === 'active' && !subscription.cancel_at_period_end && (
              <button
                onClick={handleCancelSubscription}
                disabled={processing}
                className="btn-danger"
              >
                Annuler l'abonnement
              </button>
            )}

            {subscription.cancel_at_period_end && (
              <button
                onClick={handleReactivateSubscription}
                disabled={processing}
                className="btn-primary"
              >
                Réactiver l'abonnement
              </button>
            )}

            {subscription.status === 'past_due' && (
              <div className="payment-warning">
                <svg className="warning-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <strong>Paiement en retard</strong>
                  <p>
                    Votre dernier paiement a échoué. Veuillez mettre à jour votre moyen de
                    paiement.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* No Subscription */}
      {!subscription && (
        <div className="no-subscription">
          <svg className="subscription-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2>Aucun abonnement actif</h2>
          <p>Passez en sponsorisé pour augmenter votre visibilité</p>
          <a href="/client/sponsorship" className="btn-primary">
            Souscrire à un abonnement
          </a>
        </div>
      )}

      {/* Invoices Table */}
      <div className="invoices-section">
        <div className="section-header">
          <h2 className="section-title">Historique des factures</h2>
          <button onClick={refresh} className="btn-icon" disabled={loading || processing}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>

        {invoices.length === 0 ? (
          <div className="empty-invoices">
            <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p>Aucune facture pour le moment</p>
          </div>
        ) : (
          <div className="invoices-table-wrapper">
            <table className="invoices-table">
              <thead>
                <tr>
                  <th>N° Facture</th>
                  <th>Date</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="invoice-number">{invoice.number}</td>
                    <td>{formatDate(invoice.created)}</td>
                    <td className="invoice-amount">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: invoice.currency.toUpperCase(),
                      }).format(invoice.amount / 100)}
                    </td>
                    <td>
                      <span className={`invoice-status status-${invoice.status}`}>
                        {getStatusLabel(invoice.status)}
                      </span>
                    </td>
                    <td>
                      <div className="invoice-actions">
                        {invoice.hosted_invoice_url && (
                          <button
                            onClick={() => downloadInvoice(invoice.hosted_invoice_url!)}
                            className="btn-action"
                            title="Voir la facture"
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
                          </button>
                        )}
                        {invoice.invoice_pdf && (
                          <button
                            onClick={() => downloadInvoice(invoice.invoice_pdf!)}
                            className="btn-action"
                            title="Télécharger PDF"
                          >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="help-section">
        <div className="help-icon">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="help-content">
          <h3>Besoin d'aide ?</h3>
          <p>
            Si vous rencontrez un problème avec votre facturation ou avez une question sur votre
            abonnement, n'hésitez pas à contacter notre support.
          </p>
          <a href="mailto:support@foxreviews.com" className="btn-outline">
            Contacter le support
          </a>
        </div>
      </div>
    </div>
  );
}
