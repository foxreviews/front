import { useState } from "react";

interface SearchBarProps {
  onSearch: (filters: {
    categorie?: string;
    sous_categorie?: string;
    ville?: string;
  }) => void;
}

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
      className="mt-10 w-full max-w-3xl mx-auto lg:mx-0"
    >
      <div className="flex flex-col sm:flex-row gap-4 bg-white rounded-xl p-4 shadow-lg">
        
        <input
          type="text"
          placeholder="Catégorie"
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
          className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <input
          type="text"
          placeholder="Sous-catégorie"
          value={sousCategorie}
          onChange={(e) => setSousCategorie(e.target.value)}
          className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <input
          type="text"
          placeholder="Ville"
          value={ville}
          onChange={(e) => setVille(e.target.value)}
          className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          Rechercher
        </button>

      </div>
    </form>
  );
}
