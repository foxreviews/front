import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { referenceService } from '../../services/reference.service';
import type { SousCategorie, Categorie } from '../../types/reference';
import { SEO } from '../../components/SEO';
import './SousCategories.css';

export function SousCategories() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('categorie');

  const [sousCategories, setSousCategories] = useState<SousCategorie[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  // Trouve l'UUID de la catégorie si un filtre est appliqué
  const categoryId = categoryFilter
    ? categories.find((c) => c.slug === categoryFilter)?.id
    : undefined;

  const categoryName = categoryFilter
    ? categories.find((c) => c.slug === categoryFilter)?.nom
    : null;

  // Fetch categories d'abord pour avoir l'UUID
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const allCats = await referenceService.getAllCategories();
        setCategories(allCats);
      } catch (err) {
        console.error('Erreur chargement catégories:', err);
      }
    };
    loadCategories();
  }, []);

  // Fetch sous-categories avec pagination serveur
  const fetchSousCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await referenceService.getSousCategories(
        categoryId,
        currentPage,
        pageSize
      );
      setSousCategories(data.results);
      setTotalCount(data.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [currentPage, categoryId, pageSize]);

  useEffect(() => {
    if (categories.length > 0 || !categoryFilter) {
      fetchSousCategories();
    }
  }, [fetchSousCategories, categories.length, categoryFilter]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleSousCategorieClick = (sousCategorie: SousCategorie) => {
    navigate(`/search?sous_categorie=${sousCategorie.slug}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | null)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first, last, and around current
      pages.push(1);

      if (currentPage > 3) {
        pages.push(null); // Ellipsis
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push(null); // Ellipsis
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
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
      <SEO
        title={categoryName ? `Sous-catégories - ${categoryName}` : 'Toutes les sous-catégories'}
        description={
          categoryName
            ? `Découvrez les sous-catégories disponibles pour ${categoryName} et trouvez les meilleurs professionnels grâce aux avis 5★ certifiés.`
            : 'Découvrez toutes les sous-catégories et trouvez les meilleurs professionnels grâce aux avis 5★ certifiés.'
        }
        keywords={categoryName ? `${categoryName}, sous-catégories, annuaire, avis` : 'sous-catégories, annuaire, avis, professionnels'}
      />
      {/* Header */}
      <div className="sous-categories-header">
        <h1 className="page-title">
          {categoryName ? `Sous-catégories - ${categoryName}` : 'Toutes les sous-catégories'}
        </h1>
        <p className="page-subtitle">
          {totalCount} sous-catégorie{totalCount > 1 ? 's' : ''} disponible{totalCount > 1 ? 's' : ''}
        </p>
        
        {/* Page Size Selector */}
        <div style={{ marginTop: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="pageSize" style={{ fontSize: '14px', fontWeight: '500' }}>
            Afficher par page:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
            <option value={500}>500</option>
          </select>
        </div>
        
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

      {sousCategories.length === 0 ? (
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
            {sousCategories.map((sousCategorie) => (
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
                {getPageNumbers().map((page, index) =>
                  page === null ? (
                    <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                    >
                      {page}
                    </button>
                  )
                )}
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
