import { useState, type FormEvent } from 'react';
import { useAuth } from '../../hooks';
import type { RegisterData } from '../../types/auth';
import './Auth.css';

export function Register() {
  const { register, loading, error: authError, clearError } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    password_confirm: '',
    entreprise_name: '',
    siren: '',
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    // Validation côté client
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

    if (formData.siren && !/^\d{9}$/.test(formData.siren)) {
      setLocalError('Le SIREN doit contenir exactement 9 chiffres');
      return;
    }

    try {
      await register(formData);
      // Redirection gérée par le router ou le composant parent
    } catch (err) {
      // L'erreur est déjà gérée par le hook
      console.error('Erreur d\'inscription:', err);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Créer un compte</h1>
          <p className="auth-subtitle">Rejoignez FOX-Reviews et développez votre visibilité</p>
        </div>

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

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Adresse email <span className="required">*</span>
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              disabled={loading}
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="form-input"
              placeholder="vous@exemple.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="entreprise_name" className="form-label">
              Nom de l'entreprise
            </label>
            <input
              id="entreprise_name"
              type="text"
              autoComplete="organization"
              disabled={loading}
              value={formData.entreprise_name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, entreprise_name: e.target.value }))
              }
              className="form-input"
              placeholder="Ma Super Entreprise"
            />
          </div>

          <div className="form-group">
            <label htmlFor="siren" className="form-label">
              SIREN
            </label>
            <input
              id="siren"
              type="text"
              pattern="\d{9}"
              maxLength={9}
              disabled={loading}
              value={formData.siren}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, siren: e.target.value.replace(/\D/g, '') }))
              }
              className="form-input"
              placeholder="123456789"
            />
            <p className="form-hint">9 chiffres</p>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Mot de passe <span className="required">*</span>
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              disabled={loading}
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              className="form-input"
              placeholder="••••••••"
            />
            <p className="form-hint">Minimum 8 caractères</p>
          </div>

          <div className="form-group">
            <label htmlFor="password_confirm" className="form-label">
              Confirmer le mot de passe <span className="required">*</span>
            </label>
            <input
              id="password_confirm"
              type="password"
              autoComplete="new-password"
              required
              disabled={loading}
              value={formData.password_confirm}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password_confirm: e.target.value }))
              }
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary btn-block"
          >
            {loading ? (
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
                Création en cours...
              </span>
            ) : (
              'Créer mon compte'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Déjà un compte ?{' '}
            <a href="/login" className="link-primary">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
