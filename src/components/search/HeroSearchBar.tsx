import { useState, useRef, useEffect } from "react";
import { useCategories, useSousCategories } from "../../hooks";
import { useVilleAutocomplete } from "../../hooks/useAutocomplete";
import type { VilleAutocompleteItem } from "../../types/reference";

interface HeroSearchBarProps {
  onSearch?: (filters: {
    categorie?: string;
    sous_categorie?: string;
    ville?: string;
  }) => void;
}

export default function HeroSearchBar({ onSearch }: HeroSearchBarProps) {
  const [categorie, setCategorie] = useState("");
  const [sousCategorie, setSousCategorie] = useState("");
  const [villeQuery, setVilleQuery] = useState("");
  const [villeSlug, setVilleSlug] = useState("");
  const [showVilleDropdown, setShowVilleDropdown] = useState(false);
  const villeInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { categories, loading: loadingCategories } = useCategories();
  const selectedCategory = (categories || []).find((c) => c.slug === categorie);
  const { sousCategories, loading: loadingSousCategories } = useSousCategories(selectedCategory?.id);
  
  // Autocomplete pour les villes
  const { results: villeResults, loading: villeLoading } = useVilleAutocomplete(villeQuery);

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        villeInputRef.current &&
        !villeInputRef.current.contains(event.target as Node)
      ) {
        setShowVilleDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Afficher le dropdown quand il y a des résultats
  useEffect(() => {
    if (villeResults && villeResults.length > 0 && villeQuery.length >= 2) {
      setShowVilleDropdown(true);
    } else {
      setShowVilleDropdown(false);
    }
  }, [villeResults, villeQuery]);

  const handleVilleSelect = (ville: VilleAutocompleteItem) => {
    setVilleQuery(ville.nom);
    setVilleSlug(ville.slug);
    setShowVilleDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filters = {
      categorie: categorie || undefined,
      sous_categorie: sousCategorie || undefined,
      ville: villeSlug || undefined,
    };

    if (onSearch) {
      onSearch(filters);
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
          {/* Ville avec Autocomplete */}
          <div className="relative">
            <input
              ref={villeInputRef}
              type="text"
              value={villeQuery}
              onChange={(e) => {
                setVilleQuery(e.target.value);
                setVilleSlug(""); // Reset slug quand on tape
              }}
              onFocus={() => {
                if (villeResults.length > 0 && villeQuery.length >= 2) {
                  setShowVilleDropdown(true);
                }
              }}
              placeholder="Ville (tapez au moins 2 caractères)"
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
              "
            />
            
            {villeLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="animate-spin h-4 w-4 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}

            {/* Dropdown des résultats */}
            {showVilleDropdown && villeResults && villeResults.length > 0 && (
              <div
                ref={dropdownRef}
                className="
                  absolute
                  top-full
                  left-0
                  right-0
                  mt-1
                  bg-white
                  border
                  rounded-lg
                  shadow-lg
                  max-h-60
                  overflow-y-auto
                  z-50
                "
              >
                {villeResults?.map((ville) => (
                  <div
                    key={ville.id}
                    onClick={() => handleVilleSelect(ville)}
                    className="
                      px-3 py-2
                      cursor-pointer
                      hover:bg-gray-100
                      border-b
                      last:border-b-0
                      transition-colors
                    "
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">{ville.nom}</span>
                      <span className="text-sm text-gray-500">
                        {ville.code_postal_principal} - {ville.departement}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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
