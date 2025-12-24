import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useAvis } from '../../hooks';
import type { AvisStatus } from '../../types/client';
import './AvisUpload.css';

export function AvisUpload() {
  const { user } = useAuth();
  const { avis, loading, error, uploading, uploadAvis, refresh } = useAvis(
    user?.entreprise_id || null
  );

  const [texteAvis, setTexteAvis] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const characterCount = texteAvis.length;
  const minCharacters = 50;
  const isValid = characterCount >= minCharacters;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    if (!isValid) {
      setLocalError(`L'avis doit contenir au moins ${minCharacters} caractères`);
      return;
    }

    const success = await uploadAvis(texteAvis);

    if (success) {
      setSuccessMessage(
        'Votre avis a été envoyé avec succès et est en cours de traitement par notre IA'
      );
      setTexteAvis('');
      // Auto-masquer le message après 5 secondes
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  const getStatusBadge = (status: AvisStatus) => {
    const badges: Record<AvisStatus, { label: string; class: string }> = {
      pending: { label: 'En attente', class: 'status-pending' },
      validated: { label: 'Validé', class: 'status-validated' },
      rejected: { label: 'Refusé', class: 'status-rejected' },
    };
    return badges[status];
  };

  const displayError = localError || error;

  return (
    <div className="avis-upload-container">
      <div className="avis-upload-header">
        <div>
          <h1 className="page-title">Upload d'avis de remplacement</h1>
          <p className="page-subtitle">
            Remplacez votre avis actuel en uploadant un nouveau contenu
          </p>
        </div>
        <Link to="/client/dashboard" className="btn-outline">
          ← Retour au tableau de bord
        </Link>
      </div>

      {successMessage && (
        <div className="success-banner" role="alert">
          <svg className="success-icon" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {displayError && (
        <div className="error-banner" role="alert">
          <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span>{displayError}</span>
        </div>
      )}

      <div className="avis-content">
        {/* Upload Form */}
        <div className="upload-section">
          <div className="upload-card">
            <div className="upload-header">
              <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <h2 className="card-title">Nouvel avis</h2>
              <p className="card-subtitle">
                Fournissez un avis authentique qui représente bien votre entreprise
              </p>
            </div>

            <form onSubmit={handleSubmit} className="upload-form">
              <div className="form-group">
                <label htmlFor="texte_avis" className="form-label">
                  Texte de l'avis <span className="required">*</span>
                </label>
                <textarea
                  id="texte_avis"
                  rows={8}
                  disabled={uploading}
                  value={texteAvis}
                  onChange={(e) => setTexteAvis(e.target.value)}
                  className={`form-textarea ${!isValid && characterCount > 0 ? 'invalid' : ''}`}
                  placeholder="Notre entreprise offre des services de qualité depuis 2010. Nos clients apprécient notre réactivité et notre expertise technique..."
                />
                <div className="character-counter">
                  <span className={characterCount >= minCharacters ? 'valid' : 'invalid'}>
                    {characterCount} / {minCharacters} caractères minimum
                  </span>
                </div>
              </div>

              <div className="info-box">
                <svg className="info-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <strong>Conseils pour un bon avis :</strong>
                  <ul>
                    <li>Décrivez vos services et votre expertise</li>
                    <li>Mentionnez vos points forts et valeurs</li>
                    <li>Restez authentique et professionnel</li>
                    <li>Minimum 50 caractères requis</li>
                  </ul>
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading || !isValid}
                className="btn-primary btn-block"
              >
                {uploading ? (
                  <span className="btn-loading">
                    <svg className="spinner" viewBox="0 0 24 24">
                      <circle
                        className="spinner-circle"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                    </svg>
                    Traitement en cours...
                  </span>
                ) : (
                  <>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    Envoyer l'avis
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Historique des avis */}
        <div className="history-section">
          <div className="section-header">
            <h2 className="section-title">Historique des avis</h2>
            <button onClick={refresh} className="btn-icon" disabled={loading}>
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

          {loading && avis.length === 0 ? (
            <div className="loading-state">
              <div className="spinner-large"></div>
              <p>Chargement de l'historique...</p>
            </div>
          ) : avis.length === 0 ? (
            <div className="empty-state">
              <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p>Aucun avis envoyé pour le moment</p>
            </div>
          ) : (
            <div className="avis-history-list">
              {avis.map((avisItem, index) => {
                // AvisDecrypte n'a pas de status, on utilise needs_regeneration pour déterminer un statut
                const status: AvisStatus = avisItem.needs_regeneration ? 'pending' : 'validated';
                const statusInfo = getStatusBadge(status);
                return (
                  <div key={avisItem.id || index} className="avis-history-card">
                    <div className="avis-history-header">
                      <div className="avis-meta">
                        <span className={`avis-status ${statusInfo.class}`}>
                          {statusInfo.label}
                        </span>
                        <span className="avis-date">
                          {new Date(avisItem.created_at).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <span className={`avis-source avis-source-${avisItem.source}`}>
                        {avisItem.source}
                      </span>
                    </div>

                    <div className="avis-history-body">
                      <div className="avis-section">
                        <h4 className="avis-section-title">Texte original</h4>
                        <p className="avis-text">{avisItem.texte_brut}</p>
                      </div>

                      {avisItem.texte_decrypte && (
                        <div className="avis-section">
                          <h4 className="avis-section-title">Texte décrypté (IA)</h4>
                          <p className="avis-text avis-decrypted">{avisItem.texte_decrypte}</p>
                        </div>
                      )}
                    </div>

                    <div className="avis-history-footer">
                      <span className="avis-confidence">
                        Score de confiance: {(avisItem.confidence_score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
