import { useState, type FormEvent } from 'react';
import { useAuth, useEntreprise } from '../../hooks';
import type { EntrepriseUpdateData } from '../../types/client';
import './EntrepriseManagement.css';

export function EntrepriseManagement() {
  const { user } = useAuth();
  const { entreprise, loading, error, updating, updateEntreprise, refresh } = useEntreprise(
    user?.entreprise_id || null
  );

  const [formData, setFormData] = useState<EntrepriseUpdateData>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    // Validation côté client
    if (formData.email_contact && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_contact)) {
      setLocalError('L\'adresse email est invalide');
      return;
    }

    if (formData.site_web && formData.site_web.trim()) {
      try {
        new URL(formData.site_web);
      } catch {
        setLocalError('L\'URL du site web est invalide (doit commencer par http:// ou https://)');
        return;
      }
    }

    if (formData.code_postal && !/^\d{5}$/.test(formData.code_postal)) {
      setLocalError('Le code postal doit contenir 5 chiffres');
      return;
    }

    const success = await updateEntreprise(formData);

    if (success) {
      setSuccessMessage('Les informations ont été mises à jour avec succès');
      // Auto-masquer le message après 5 secondes
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  const resetFormData = () => {
    if (entreprise) {
      setFormData({
        nom_commercial: entreprise.nom_commercial || '',
        adresse: entreprise.adresse || '',
        code_postal: entreprise.code_postal || '',
        ville_nom: entreprise.ville_nom || '',
        telephone: entreprise.telephone || '',
        email_contact: entreprise.email_contact || '',
        site_web: entreprise.site_web || '',
      });
    }
  };

  const handleCancel = () => {
    resetFormData();
    setLocalError(null);
    setSuccessMessage(null);
  };

  if (loading) {
    return (
      <div className="entreprise-container">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Chargement des informations...</p>
        </div>
      </div>
    );
  }

  if (error && !entreprise) {
    return (
      <div className="entreprise-container">
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

  if (!entreprise) {
    return (
      <div className="entreprise-container">
        <div className="empty-state">
          <p>Aucune entreprise associée à votre compte</p>
        </div>
      </div>
    );
  }

  // Initialise le formulaire si vide
  if (!formData.nom_commercial && entreprise) {
    resetFormData();
  }

  const displayError = localError || error;

  return (
    <div className="entreprise-container">
      <div className="entreprise-header">
        <div>
          <h1 className="page-title">Gestion de la fiche entreprise</h1>
          <p className="page-subtitle">Modifiez les informations de votre entreprise</p>
        </div>
        <a href="/client/dashboard" className="btn-outline">
          ← Retour au tableau de bord
        </a>
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

      <div className="entreprise-content">
        {/* Informations non modifiables */}
        <div className="info-card">
          <h2 className="card-title">Informations officielles</h2>
          <p className="card-subtitle">Ces informations proviennent de l'INSEE et ne peuvent pas être modifiées</p>
          
          <div className="info-grid">
            <div className="info-item">
              <label className="info-label">Raison sociale</label>
              <p className="info-value">{entreprise.nom}</p>
            </div>
            
            <div className="info-item">
              <label className="info-label">SIREN</label>
              <p className="info-value">{entreprise.siren}</p>
            </div>
            
            <div className="info-item">
              <label className="info-label">SIRET</label>
              <p className="info-value">{entreprise.siret}</p>
            </div>
            
            {entreprise.naf_code && (
              <div className="info-item">
                <label className="info-label">Code NAF</label>
                <p className="info-value">
                  {entreprise.naf_code}
                  {entreprise.naf_libelle && ` - ${entreprise.naf_libelle}`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Formulaire d'édition */}
        <form onSubmit={handleSubmit} className="edit-form">
          <h2 className="card-title">Informations modifiables</h2>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nom_commercial" className="form-label">
                Nom commercial
              </label>
              <input
                id="nom_commercial"
                type="text"
                disabled={updating}
                value={formData.nom_commercial || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, nom_commercial: e.target.value }))
                }
                className="form-input"
                placeholder="Nom commercial de votre entreprise"
              />
              <p className="form-hint">Le nom sous lequel vous êtes connu du public</p>
            </div>

            <div className="form-group">
              <label htmlFor="adresse" className="form-label">
                Adresse
              </label>
              <input
                id="adresse"
                type="text"
                disabled={updating}
                value={formData.adresse || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, adresse: e.target.value }))
                }
                className="form-input"
                placeholder="123 Rue de la République"
              />
            </div>

            <div className="form-group">
              <label htmlFor="code_postal" className="form-label">
                Code postal
              </label>
              <input
                id="code_postal"
                type="text"
                pattern="\d{5}"
                maxLength={5}
                disabled={updating}
                value={formData.code_postal || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    code_postal: e.target.value.replace(/\D/g, ''),
                  }))
                }
                className="form-input"
                placeholder="75001"
              />
            </div>

            <div className="form-group">
              <label htmlFor="ville_nom" className="form-label">
                Ville
              </label>
              <input
                id="ville_nom"
                type="text"
                disabled={updating}
                value={formData.ville_nom || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, ville_nom: e.target.value }))
                }
                className="form-input"
                placeholder="Paris"
              />
            </div>

            <div className="form-group">
              <label htmlFor="telephone" className="form-label">
                Téléphone
              </label>
              <input
                id="telephone"
                type="tel"
                disabled={updating}
                value={formData.telephone || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, telephone: e.target.value }))
                }
                className="form-input"
                placeholder="+33 1 23 45 67 89"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email_contact" className="form-label">
                Email de contact
              </label>
              <input
                id="email_contact"
                type="email"
                disabled={updating}
                value={formData.email_contact || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email_contact: e.target.value }))
                }
                className="form-input"
                placeholder="contact@entreprise.com"
              />
              <p className="form-hint">Visible par les clients potentiels</p>
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="site_web" className="form-label">
                Site web
              </label>
              <input
                id="site_web"
                type="url"
                disabled={updating}
                value={formData.site_web || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, site_web: e.target.value }))
                }
                className="form-input"
                placeholder="https://www.entreprise.com"
              />
              <p className="form-hint">Doit commencer par http:// ou https://</p>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              disabled={updating}
              className="btn-secondary"
            >
              Annuler
            </button>
            <button type="submit" disabled={updating} className="btn-primary">
              {updating ? (
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
                  Enregistrement...
                </span>
              ) : (
                'Enregistrer les modifications'
              )}
            </button>
          </div>
        </form>

        {/* Avis décrypté publié */}
        <div className="published-review-section">
          <h2 className="card-title">Avis décrypté publié</h2>
          <p className="card-subtitle">
            Consultez l'avis décrypté actuellement affiché sur votre fiche publique
          </p>
          <a href="/client/avis" className="btn-outline">
            Voir mes avis →
          </a>
        </div>
      </div>
    </div>
  );
}
