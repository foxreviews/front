import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { referenceService } from '../../services/reference.service';
import type { Categorie } from '../../types/reference';
import { SEO } from '../../components/SEO';
import './Categories.css';

export function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  // Fetch categories with server-side pagination
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await referenceService.getCategories(currentPage, pageSize);
      setCategories(data.results);
      setTotalCount(data.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleCategoryClick = (category: Categorie) => {
    navigate(`/search?categorie=${category.slug}`);
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

  if (loading) {
    return (
      <div className="categories-container">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Chargement des catégories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="categories-container">
        <div className="error-state">
          <svg className="error-icon-large" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <button onClick={fetchCategories} className="btn-primary" style={{ marginTop: '16px' }}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-container">
      <SEO
        title="Toutes les catégories"
        description="Parcourez toutes les catégories et trouvez les meilleurs professionnels grâce aux avis 5★ certifiés."
        keywords="catégories, annuaire, avis, professionnels"
      />
      {/* Header */}
      <div className="categories-header">
        <h1 className="page-title">Toutes les catégories</h1>
        <p className="page-subtitle">
          {totalCount} catégorie{totalCount > 1 ? 's' : ''} disponible{totalCount > 1 ? 's' : ''}
        </p>
        
        {/* Page Size Selector */}
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
      </div>

      {/* Grid des catégories */}
      {!categories || categories.length === 0 ? (
        <div className="empty-state">
          <p>Aucune catégorie disponible</p>
        </div>
      ) : (
        <div className="categories-grid">
          {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            className="category-card"
          >
            <div className="category-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="category-name">{category.nom}</h3>
            {category.description && (
              <p className="category-description">{category.description}</p>
            )}
            <div className="category-arrow">
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
      )}

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
    </div>
  );
}
