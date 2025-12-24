import { useDashboard } from '../../hooks';
import { useAuth } from '../../hooks';
import { Link } from 'react-router-dom';
import './ClientDashboard.css';

export function ClientDashboard() {
  const { user } = useAuth();
  const { dashboard, loading, error, refresh } = useDashboard(user?.entreprise_id || null);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
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

  if (!dashboard) {
    return (
      <div className="dashboard-container">
        <div className="empty-state">
          <p>Aucune donnée disponible</p>
        </div>
      </div>
    );
  }

  const { entreprise, sponsorisation, statistiques, avis_recents } = dashboard;
  const isSponsored = sponsorisation?.is_active || false;
  const statusClass = sponsorisation?.statut_paiement || 'inactive';

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Tableau de bord</h1>
          <p className="dashboard-subtitle">{entreprise.nom}</p>
        </div>
        <button onClick={refresh} className="btn-icon" title="Actualiser">
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

      {/* Status Cards */}
      <div className="status-cards">
        {/* Statut Abonnement */}
        <div className="status-card">
          <div className="status-card-header">
            <h3>Statut Abonnement</h3>
            <span className={`status-badge status-${statusClass}`}>
              {getStatusLabel(statusClass)}
            </span>
          </div>
          <div className="status-card-body">
            <p className="status-value">
              {sponsorisation ? 
                `${formatCurrency(sponsorisation.montant_mensuel)}/mois` : 
                'Aucun abonnement actif'}
            </p>
            {sponsorisation && (
              <p className="status-details">
                Du {formatDate(sponsorisation.date_debut)} au {formatDate(sponsorisation.date_fin)}
              </p>
            )}
          </div>
          <div className="status-card-actions">
            <Link to="/client/billing" className="btn-outline">
              Gérer mon abonnement
            </Link>
          </div>
        </div>

        {/* Statut Sponsorisation */}
        <div className="status-card">
          <div className="status-card-header">
            <h3>Statut Sponsorisation</h3>
            <div className="toggle-wrapper">
              <span className={`toggle-label ${isSponsored ? 'active' : ''}`}>
                {isSponsored ? 'ON' : 'OFF'}
              </span>
              <div className={`toggle ${isSponsored ? 'toggle-on' : 'toggle-off'}`}>
                <div className="toggle-slider"></div>
              </div>
            </div>
          </div>
          <div className="status-card-body">
            <p className="status-value">
              {isSponsored ? 'Sponsorisation active' : 'Non sponsorisé'}
            </p>
            {isSponsored && sponsorisation && (
              <p className="status-details">
                Position dans la rotation : #{statistiques.rotation_position}
              </p>
            )}
          </div>
          <div className="status-card-actions">
            {!isSponsored && (
              <Link to="/client/sponsorship" className="btn-primary">
                Passer en sponsorisé
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="stats-section">
        <h2 className="section-title">Statistiques</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon-blue">
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
            </div>
            <div className="stat-content">
              <p className="stat-label">Impressions</p>
              <p className="stat-value">{formatNumber(statistiques.impressions_totales)}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-green">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                />
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Clics</p>
              <p className="stat-value">{formatNumber(statistiques.clicks_totaux)}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-purple">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Taux de clic</p>
              <p className="stat-value">{(statistiques.taux_clic * 100).toFixed(2)}%</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-orange">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Position</p>
              <p className="stat-value">#{statistiques.rotation_position}</p>
              <p className="stat-sublabel">Dans la rotation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Avis Récents */}
      <div className="avis-section">
        <div className="section-header">
          <h2 className="section-title">Avis Récents</h2>
          <Link to="/client/avis" className="link-primary">
            Voir tous les avis →
          </Link>
        </div>

        {avis_recents.length === 0 ? (
          <div className="empty-avis">
            <p>Aucun avis disponible</p>
            <Link to="/client/upload-avis" className="btn-primary">
              Ajouter un avis
            </Link>
          </div>
        ) : (
          <div className="avis-list">
            {avis_recents.map((avis) => (
              <div key={avis.id} className="avis-card">
                <div className="avis-header">
                  <span className={`avis-source avis-source-${avis.source}`}>
                    {avis.source}
                  </span>
                  <span className="avis-date">{formatDate(avis.created_at)}</span>
                </div>
                <p className="avis-text">{truncateText(avis.texte_decrypte, 150)}</p>
                <div className="avis-footer">
                  <span className="avis-confidence">
                    Confiance: {(avis.confidence_score * 100).toFixed(0)}%
                  </span>
                  <Link to={`/client/avis/${avis.id}`} className="link-secondary">
                    Voir détails
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2 className="section-title">Actions Rapides</h2>
        <div className="actions-grid">
          <Link to="/client/entreprise" className="action-card">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span>Modifier ma fiche</span>
          </Link>
          
          <Link to="/client/upload-avis" className="action-card">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span>Uploader un avis</span>
          </Link>
          
          <Link to="/client/billing" className="action-card">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Mes factures</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Utility functions
function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: 'Actif',
    past_due: 'En retard',
    canceled: 'Résilié',
    inactive: 'Inactif',
  };
  return labels[status] || status;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('fr-FR').format(num);
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
