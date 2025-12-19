import { useState, type FormEvent } from 'react';
import { useAuth } from '../../hooks';
import type { LoginCredentials } from '../../types/auth';
import './Auth.css';

export function Login() {
  const { login, loading, error: authError, clearError } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    // Validation côté client
    if (!credentials.username || !credentials.password) {
      setLocalError('Veuillez remplir tous les champs');
      return;
    }

    if (!credentials.username.includes('@')) {
      setLocalError('Veuillez entrer une adresse email valide');
      return;
    }

    try {
      await login(credentials);
      // Redirection gérée par le router ou le composant parent
    } catch (err) {
      // L'erreur est déjà gérée par le hook
      console.error('Erreur de connexion:', err);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Connexion</h1>
          <p className="auth-subtitle">Accédez à votre espace client</p>
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
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              disabled={loading}
              value={credentials.username}
              onChange={(e) =>
                setCredentials((prev) => ({ ...prev, username: e.target.value }))
              }
              className="form-input"
              placeholder="vous@exemple.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={loading}
              value={credentials.password}
              onChange={(e) =>
                setCredentials((prev) => ({ ...prev, password: e.target.value }))
              }
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          <div className="form-actions">
            <a href="/forgot-password" className="link-secondary">
              Mot de passe oublié ?
            </a>
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
                Connexion en cours...
              </span>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Pas encore de compte ?{' '}
            <a href="/register" className="link-primary">
              Créer un compte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
