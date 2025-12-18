import { useSearchParams, useNavigate } from "react-router-dom";
import { useSearch } from "../../hooks";
import SearchBar from "../../components/search/SearchBar";
import SkeletonCard from "../../components/skeleton/Skeleton";

export default function SearchResults() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const categorie = params.get("categorie") || undefined;
  const sousCategorie = params.get("sous_categorie") || undefined;
  const ville = params.get("ville") || undefined;
  const page = Number(params.get("page")) || 1;

  const { data, loading, error } = useSearch({
    categorie,
    sous_categorie: sousCategorie,
    ville,
    page,
  });

  const MAX_RESULTS = 15;

  const sponsoredResults = data?.sponsored ?? [];
  const organicResults = data?.organic ?? [];
  const sponsoredToShow = sponsoredResults.slice(0, MAX_RESULTS);
  const remainingSlots = MAX_RESULTS - sponsoredToShow.length;
  const organicToShow = remainingSlots > 0 ? organicResults.slice(0, remainingSlots) : [];
  const displayedCount = sponsoredToShow.length + organicToShow.length;

  const handleSearch = (filters: {
  categorie?: string;
  sous_categorie?: string;
  ville?: string;
}) => {
  const params = new URLSearchParams();

  if (filters.categorie) {
    params.append("categorie", filters.categorie);
  }

  if (filters.sous_categorie) {
    params.append("sous_categorie", filters.sous_categorie);
  }

  if (filters.ville) {
    params.append("ville", filters.ville);
  }

  navigate(`/search?${params.toString()}`);
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-r from-[#26354e] to-[#374d6d] pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-24">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Trouvez les meilleurs professionnels
          </h1>
          <p className="text-gray-200 mb-6">
            Recherchez parmi des milliers d'entreprises vérifiées
          </p>
          <SearchBar onSearch={handleSearch}/>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-24 py-12">
        {/* Filters Summary */}
        {(categorie || ville || sousCategorie) && (
          <div className="mb-8 flex flex-wrap gap-2 items-center">
            <span className="text-gray-600 font-medium">Filtres actifs:</span>
            {categorie && (
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                {categorie}
              </span>
            )}
            {sousCategorie && (
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                {sousCategorie}
              </span>
            )}
            {ville && (
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                📍 {ville}
              </span>
            )}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} type="card" />
            ))}
          </div>
        )}


        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-red-800 font-semibold text-lg mb-2">Erreur de chargement</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Results */}
        {!loading && !error && data && (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#26354e]">
                {displayedCount > 0 ? (
                  <>
                    <span className="text-orange-500">{displayedCount}</span> résultat{displayedCount > 1 ? "s" : ""} trouvé{displayedCount > 1 ? "s" : ""}
                  </>
                ) : (
                  "Aucun résultat"
                )}
              </h2>
            </div>

            {/* Sponsored Results */}
            {sponsoredToShow.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Sponsorisé</span>
                  <div className="h-px flex-1 bg-gray-200"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sponsoredToShow.map((item) => (
                    <article
                      key={item.id}
                      className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-xl text-[#26354e] mb-1">
                            {item.entreprise_nom || item.nom}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {(item.sous_categorie_nom || item.sous_categorie) ?? ""} • {item.ville_nom || item.ville}
                          </p>
                        </div>
                        {item.is_verified && (
                          <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Vérifié
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          <span className="text-2xl font-bold text-orange-500">{item.note_moyenne.toFixed(1)}</span>
                          <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-500">({item.nb_avis} avis)</span>
                        <div className="flex-1"></div>
                        <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded">⭐ {item.score_global}</span>
                      </div>
                      {item.avis_redaction && (
                        <p className="text-sm text-gray-700 bg-orange-50 border border-orange-100 rounded-lg p-3 leading-relaxed">
                          {item.avis_redaction}
                        </p>
                      )}
                      <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors">
                        Voir le profil
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* Organic Results */}
            {organicToShow.length > 0 ? (
              <div className="space-y-4">
                {organicToShow.map((item) => (
                  <article
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-orange-300 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <h3 className="font-bold text-xl text-[#26354e]">
                            {item.entreprise_nom || item.nom}
                          </h3>
                          {item.is_verified && (
                            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Vérifié
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">
                          <span className="font-medium">{item.sous_categorie_nom || item.sous_categorie}</span> • 📍 {item.ville_nom || item.ville}
                        </p>
                        {item.avis_redaction && (
                          <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 mb-3 leading-relaxed">
                            {item.avis_redaction}
                          </p>
                        )}
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-5 h-5 ${i < Math.floor(item.note_moyenne)
                                      ? "text-orange-500"
                                      : "text-gray-300"
                                    }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="font-bold text-lg text-[#26354e]">{item.note_moyenne.toFixed(1)}</span>
                          </div>
                          <span className="text-sm text-gray-500">({item.nb_avis} avis)</span>
                          <span className="text-sm font-semibold text-orange-600">Score: {item.score_global}</span>
                        </div>
                      </div>
                      <button
                        className="bg-[#26354e] hover:bg-[#374d6d] text-white font-semibold px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
                        onClick={() => navigate(`/pro/${item.id}`)}
                      >
                        Voir détails
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              !loading && sponsoredToShow.length === 0 && organicToShow.length === 0 && (
                <div className="text-center py-20">
                  <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun résultat trouvé</h3>
                  <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}