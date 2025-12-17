import { useState } from "react";

interface SearchBarProps {
  onSearch: (filters: {
    categorie?: string;
    sous_categorie?: string;
    ville?: string;
  }) => void;
}

// 🔹 Données issues du doc API (exemples)
const CATEGORIES = [
  { label: "Services informatique", value: "services-informatique" },
  { label: "Artisans & Travaux", value: "artisans-travaux" },
  { label: "Auto & Moto", value: "auto-moto" },
];

const SOUS_CATEGORIES: Record<string, { label: string; value: string }[]> = {
  "services-informatique": [
    { label: "Développeur web", value: "developpeur-web" },
    { label: "Designer", value: "designer" },
  ],
  "artisans-travaux": [
    { label: "Plombier", value: "plombier" },
    { label: "Maçon", value: "macon" },
  ],
  "auto-moto": [
    { label: "Garagiste", value: "garagiste" },
    { label: "Mécanicien moto", value: "mecanicien-moto" },
  ],
};

const VILLES = [
  { label: "Paris", value: "paris" },
  { label: "Antananarivo", value: "antananarivo" },
  { label: "Toamasina", value: "toamasina" },
];

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [categorie, setCategorie] = useState("");
  const [sousCategorie, setSousCategorie] = useState("");
  const [ville, setVille] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSearch({
      categorie: categorie || undefined,
      sous_categorie: sousCategorie || undefined,
      ville: ville || undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 w-full max-w-2xl mx-auto lg:mx-0"
    >
      <div className="
        flex flex-col
        gap-3
        sm:flex-row
        sm:items-center
        bg-white
        rounded-xl
        p-3
        shadow-lg
      ">
        {/* Catégorie */}
        <select
          value={categorie}
          onChange={(e) => {
            setCategorie(e.target.value);
            setSousCategorie("");
          }}
          className="flex-1 px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Catégorie</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        {/* Sous-catégorie */}
        <select
          value={sousCategorie}
          onChange={(e) => setSousCategorie(e.target.value)}
          disabled={!categorie}
          className="flex-1 px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
        >
          <option value="">Sous-catégorie</option>
          {categorie &&
            SOUS_CATEGORIES[categorie]?.map((sc) => (
              <option key={sc.value} value={sc.value}>
                {sc.label}
              </option>
            ))}
        </select>

        {/* Ville */}
        <select
          value={ville}
          onChange={(e) => setVille(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Ville</option>
          {VILLES.map((v) => (
            <option key={v.value} value={v.value}>
              {v.label}
            </option>
          ))}
        </select>

        {/* Bouton */}
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
            whitespace-nowrap
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
    </form>
  );
}