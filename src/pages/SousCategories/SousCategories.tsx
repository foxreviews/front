import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useReference } from '../../hooks';
import type { SousCategorie } from '../../types/reference';
import './SousCategories.css';

export function SousCategories() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('categorie');

  const { sousCategories, categories, loading, error } = useReference();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filtrer par catégorie si spécifié
  const filteredSousCategories = categoryFilter
    ? sousCategories.filter((sc) => sc.categorie_slug === categoryFilter)
    : sousCategories;

  // Pagination
  const totalPages = Math.ceil(filteredSousCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSousCategories = filteredSousCategories.slice(startIndex, endIndex);

  const categoryName = categoryFilter
    ? categories.find((c) => c.slug === categoryFilter)?.nom
    : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleSousCategorieClick = (sousCategorie: SousCategorie) => {
    navigate(`/search?sousCategorie=${sousCategorie.slug}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const clearFilter = () => {
    navigate('/sous-categories');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="sous-categories-container">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Chargement des sous-catégories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sous-categories-container">
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
        </div>
      </div>
    );
  }

  return (
    <div className="sous-categories-container">
      {/* Header */}
      <div className="sous-categories-header">
        <h1 className="page-title">
          {categoryName ? `Sous-catégories - ${categoryName}` : 'Toutes les sous-catégories'}
        </h1>
        <p className="page-subtitle">
          {filteredSousCategories.length} sous-catégorie{filteredSousCategories.length > 1 ? 's' : ''} disponible{filteredSousCategories.length > 1 ? 's' : ''}
        </p>
        {categoryFilter && (
          <button onClick={clearFilter} className="filter-clear-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Afficher toutes les sous-catégories
          </button>
        )}
      </div>

      {filteredSousCategories.length === 0 ? (
        <div className="empty-state">
          <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p>Aucune sous-catégorie trouvée</p>
        </div>
      ) : (
        <>
          {/* Grid des sous-catégories */}
          <div className="sous-categories-grid">
            {currentSousCategories.map((sousCategorie) => (
              <div
                key={sousCategorie.id}
                onClick={() => handleSousCategorieClick(sousCategorie)}
                className="sous-categorie-card"
              >
                <div className="sous-categorie-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <h3 className="sous-categorie-name">{sousCategorie.nom}</h3>
                {sousCategorie.categorie_slug && (
                  <p className="sous-categorie-category">
                    {categories.find((c) => c.slug === sousCategorie.categorie_slug)?.nom}
                  </p>
                )}
                <div className="sous-categorie-arrow">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Précédent
              </button>

              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Suivant
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
