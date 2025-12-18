import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCategories, useSousCategories, useVilles } from "../../hooks";

interface SearchBarProps {
  onSearch?: (filters: {
    categorie?: string;
    sous_categorie?: string;
    ville?: string;
  }) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const navigate = useNavigate();
  const [categorie, setCategorie] = useState("");
  const [sousCategorie, setSousCategorie] = useState("");
  const [ville, setVille] = useState("");

  const { categories, loading: loadingCategories } = useCategories();
  // On stocke dans l'état le slug pour l'URL de recherche,
  // mais on passe l'UUID (id) au hook de sous-catégories
  const selectedCategory = (categories || []).find((c) => c.slug === categorie);
  const { sousCategories, loading: loadingSousCategories } = useSousCategories(selectedCategory?.id);
  const { villes, loading: loadingVilles } = useVilles();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filters = {
      categorie: categorie || undefined,
      sous_categorie: sousCategorie || undefined,
      ville: ville || undefined,
    };

    if (onSearch) {
      onSearch(filters);
    } else {
      // Navigation vers la page de résultats
      const params = new URLSearchParams();
      if (filters.categorie) params.append("categorie", filters.categorie);
      if (filters.sous_categorie) params.append("sous_categorie", filters.sous_categorie);
      if (filters.ville) params.append("ville", filters.ville);
      
      navigate(`/search?${params.toString()}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 w-full max-w-2xl mx-auto lg:mx-0"
    >
      <div
        className="
          bg-white
          dark:bg-white
          rounded-xl
          shadow-lg
          p-4
          space-y-3
        "
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Catégorie */}
          <select
            value={categorie}
            onChange={(e) => {
              setCategorie(e.target.value);
              setSousCategorie("");
            }}
            className="
              w-full
              px-3 py-2
              rounded-lg
              border
              text-sm
              bg-white
              text-gray-800
              dark:bg-white
              dark:text-gray-800
              focus:outline-none
              focus:ring-2
              focus:ring-orange-500
              disabled:opacity-50
            "
            disabled={loadingCategories}
          >
            <option value="">
              {loadingCategories ? "Chargement..." : "Catégorie"}
            </option>
            {(categories || []).map((c) => (
              <option key={c.id} value={c.slug}>
                {c.nom}
              </option>
            ))}
          </select>

          {/* Sous-catégorie */}
          <select
            value={sousCategorie}
            onChange={(e) => setSousCategorie(e.target.value)}
            disabled={!categorie || loadingSousCategories}
            className="
              w-full
              px-3 py-2
              rounded-lg
              border
              text-sm
              bg-white
              text-gray-800
              dark:bg-white
              dark:text-gray-800
              disabled:bg-gray-100
              focus:outline-none
              focus:ring-2
              focus:ring-orange-500
            "
          >
            <option value="">
              {loadingSousCategories ? "Chargement..." : "Sous-catégorie"}
            </option>
            {(sousCategories || []).map((sc) => (
              <option key={sc.id} value={sc.slug}>
                {sc.nom}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Ville */}
          <select
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            className="
              w-full
              px-3 py-2
              rounded-lg
              border
              text-sm
              bg-white
              text-gray-800
              dark:bg-white
              dark:text-gray-800
              focus:outline-none
              focus:ring-2
              focus:ring-orange-500
              disabled:opacity-50
            "
            disabled={loadingVilles}
          >
            <option value="">
              {loadingVilles ? "Chargement..." : "Ville"}
            </option>
            {(villes || []).map((v) => (
              <option key={v.id} value={v.slug}>
                {v.nom}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="
              flex items-center justify-center
              gap-2
              bg-orange-500
              hover:bg-orange-600
              text-white
              font-semibold
              px-5
              py-2
              rounded-lg
              text-sm
              transition
              cursor-pointer
            "
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"
              />
            </svg>
            Rechercher
          </button>
        </div>
      </div>
    </form>
  );
}