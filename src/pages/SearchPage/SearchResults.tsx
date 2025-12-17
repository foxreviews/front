import { useSearchParams } from "react-router-dom";
import { useSearch } from "../../hooks/useSearch";

export default function SearchResults() {
  const [params] = useSearchParams();

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

  return (
    <div className="w-full pt-32 px-6 lg:px-24 py-12">

      {/* HEADER RESULT */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-[#26354e]">
          Résultats de recherche
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          {categorie && `•Catégorie : ${categorie}`}{" "}
          {ville && `• Ville : ${ville}`}{" "}
          {sousCategorie && `• Sous-catégorie : ${sousCategorie}`}
        </p>
      </header>

      {/* STATES */}
      {loading && (
        <p className="text-gray-600">Chargement des résultats…</p>
      )}

      {error && (
        <p className="text-red-500">
          Une erreur est survenue lors de la recherche.
        </p>
      )}

      {!loading && !error && (!data || data.organic.length === 0) && (
        <p className="text-gray-600">
          Aucun résultat trouvé.
        </p>
      )}

      {/* RESULTS */}
      <section className="space-y-4">
        {data?.organic.map((item) => (
          <article
            key={item.id}
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow transition"
          >
            <h3 className="font-semibold text-[#26354e]">
              {item.entreprise_nom}
            </h3>
          </article>
        ))}
      </section>

    </div>
  );
}