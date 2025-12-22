import './EmptyState.css';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state-icon">{icon}</div>}
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {action && (
        <a href={action.href} className="empty-state-action">
          {action.label}
        </a>
      )}
    </div>
  );
}

export function NoResults() {
  return (
    <EmptyState
      icon={
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
      title="Aucun résultat trouvé"
      description="Essayez de modifier vos critères de recherche ou explorez d'autres catégories."
      action={{
        label: "Retour à l'accueil",
        href: '/',
      }}
    />
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="empty-state error-state">
      <div className="empty-state-icon">
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <h3 className="empty-state-title">Une erreur est survenue</h3>
      <p className="empty-state-description">
        {message || 'Impossible de charger les données. Veuillez réessayer.'}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="empty-state-action">
          Réessayer
        </button>
      )}
    </div>
  );
}
