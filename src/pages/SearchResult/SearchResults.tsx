import { useSearchParams } from "react-router-dom";
import { useSearch } from "../../hooks/useSearch";

export default function SearchResults() {
  const [params] = useSearchParams();

  const { data, loading, error } = useSearch({
    categorie: params.get("categorie") || undefined,
    sous_categorie: params.get("sous_categorie") || undefined,
    ville: params.get("ville") || undefined,
    page: Number(params.get("page") || 1),
  });

  if (loading) return <p>Chargement…</p>;
  if (error) return <p>Erreur de recherche</p>;

  return (
    <div className="px-6 lg:px-24 py-12">

      {/* Résultats */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Résultats</h2>
        {data?.organic.map(item => (
          <div key={item.id}>{item.entreprise_nom}</div>
        ))}
      </section>

    </div>
  );
}
