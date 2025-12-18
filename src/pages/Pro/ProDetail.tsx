import { useParams, useNavigate } from "react-router-dom";
import { useProLocalisation } from "../../hooks";

export default function ProDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, loading, error } = useProLocalisation(id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-28 pb-16 px-6 lg:px-24">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-gray-600 hover:text-orange-500 flex items-center gap-2"
      >
        <span className="text-xl">←</span>
        Retour aux résultats
      </button>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-600 text-lg">Chargement des détails...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-xl mx-auto">
          <h1 className="text-xl font-semibold text-red-700 mb-2">Erreur</h1>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && data && (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-[#26354e] mb-2">
                {data.entreprise_nom || data.nom}
              </h1>
              <p className="text-gray-600 mb-3">
                <span className="font-medium">{data.sous_categorie_nom || data.sous_categorie}</span> • 📍 {data.ville_nom || data.ville}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-3xl font-bold text-orange-500">{data.note_moyenne.toFixed(1)}</span>
                  <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-500">{data.nb_avis} avis</span>
                <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">Score global : {data.score_global}</span>
                {data.is_verified && (
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Entreprise vérifiée
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="md:col-span-2 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h2 className="text-lg font-semibold text-[#26354e] mb-2">Présentation</h2>
                <p className="text-gray-600">
                  Informations détaillées sur l'entreprise, ses services, ses points forts et son historique pourront être affichées ici lorsqu'elles seront disponibles via l'API.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h2 className="text-lg font-semibold text-[#26354e] mb-2">Avis et réputation</h2>
                {data.avis_redaction ? (
                  <p className="text-gray-700 bg-gray-100 rounded-lg p-3 leading-relaxed">
                    {data.avis_redaction}
                  </p>
                ) : (
                  <p className="text-gray-600">
                    Intégration future des avis décryptés, commentaires clients et statistiques détaillées.
                  </p>
                )}
              </div>
            </div>

            <aside className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Informations clés</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li><span className="font-medium">Ville :</span> {data.ville_nom}</li>
                  <li><span className="font-medium">Catégorie :</span> {data.sous_categorie_nom || data.sous_categorie}</li>
                  <li><span className="font-medium">Avis :</span> {data.nb_avis}</li>
                  <li><span className="font-medium">Note moyenne :</span> {data.note_moyenne.toFixed(1)}</li>
                </ul>
              </div>

              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors">
                Contacter l'entreprise
              </button>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}
