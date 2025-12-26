import { useParams, useNavigate } from "react-router-dom";
import { useProLocalisation, useProLocalisationSeo } from "../../hooks";

export default function ProDetail() {
  const { id, categorie_slug, sous_categorie_slug, ville_slug, entreprise_nom } = useParams();
  const navigate = useNavigate();

  const isSeoRoute = !id && !!categorie_slug && !!sous_categorie_slug && !!ville_slug && !!entreprise_nom;

  const proById = useProLocalisation(id as string | undefined);
  const proBySeo = useProLocalisationSeo({
    categorieSlug: categorie_slug,
    sousCategorieSlug: sous_categorie_slug,
    villeSlug: ville_slug,
    entrepriseNom: entreprise_nom,
  });

  const { data, loading, error } = isSeoRoute ? proBySeo : proById;

  const entreprise = data?.entreprise;
  const sousCategorie = data?.sous_categorie_detail;
  const ville = data?.ville_detail;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-gray-50 pt-28 pb-16 px-4 lg:px-24">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-gray-200 shadow-sm backdrop-blur hover:bg-white/10 hover:text-white transition-colors"
      >
        <span className="text-lg">←</span>
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
        <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/20 border border-gray-100 p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#111827] mb-2">
                {data.entreprise_nom || entreprise?.nom_commercial || entreprise?.nom || data.nom}
              </h1>
              <p className="text-sm md:text-base text-gray-600 mb-1">
                <span className="font-medium">
                  {sousCategorie?.nom || data.sous_categorie_nom || data.sous_categorie}
                </span>{" "}
                • 📍 {ville?.nom || data.ville_nom}
              </p>
              {entreprise && (
                <p className="text-gray-500 text-sm">
                  {entreprise.adresse}
                  {entreprise.code_postal && `, ${entreprise.code_postal}`}
                  {" "}
                  {entreprise.ville_nom}
                </p>
              )}
            </div>
            <div className="md:w-56">
              <div className="rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-3 shadow-sm flex flex-col gap-2 items-start">
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Sources d'avis</h3>
                <div className="space-y-2 w-full">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                    <span>Google</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span>Trustpilot</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                    </svg>
                    <span>Yelp</span>
                  </div>
                </div>
                {data.is_verified && (
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Entreprise vérifiée
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="md:col-span-2 space-y-4">
              <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100">
                <h2 className="text-lg font-semibold text-[#26354e] mb-2">Présentation</h2>
                {sousCategorie?.description || data.zone_description ? (
                  <p className="text-gray-700 leading-relaxed">
                    {sousCategorie?.description || data.zone_description}
                  </p>
                ) : (
                  <p className="text-gray-600">
                    Informations détaillées sur l'entreprise, ses services, ses points forts et son historique pourront être affichées ici lorsqu'elles seront disponibles via l'API.
                  </p>
                )}
              </div>

              <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100">
                <h2 className="text-lg font-semibold text-[#26354e] mb-2">Avis et réputation</h2>
                {data.avis_redaction ? (
                  <p className="text-gray-700 bg-gray-100 rounded-xl p-3 leading-relaxed">
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
              <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Informations clés</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>
                    <span className="font-medium">Ville :</span>{" "}
                    {ville?.nom || data.ville_nom}
                  </li>
                  <li>
                    <span className="font-medium">Région :</span>{" "}
                    {ville?.region || "—"}
                  </li>
                  <li>
                    <span className="font-medium">Catégorie :</span>{" "}
                    {sousCategorie?.categorie_nom || sousCategorie?.nom || data.sous_categorie_nom || data.sous_categorie}
                  </li>
                  {entreprise && (
                    <>
                      <li>
                        <span className="font-medium">SIREN :</span> {entreprise.siren}
                      </li>
                      <li>
                        <span className="font-medium">SIRET :</span> {entreprise.siret}
                      </li>
                      <li>
                        <span className="font-medium">Code NAF :</span> {entreprise.naf_code} – {entreprise.naf_libelle}
                      </li>
                    </>
                  )}
                </ul>
              </div>
              {(entreprise?.telephone || entreprise?.email_contact || entreprise?.site_web) && (
                <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Contact</h3>
                  {entreprise?.telephone && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Téléphone :</span> {entreprise.telephone}
                    </p>
                  )}
                  {entreprise?.email_contact && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Email :</span> {entreprise.email_contact}
                    </p>
                  )}
                  {entreprise?.site_web && (
                    <p className="text-sm text-gray-600 break-all">
                      <span className="font-medium">Site web :</span> {entreprise.site_web}
                    </p>
                  )}
                </div>
              )}

              <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 rounded-full shadow-md shadow-orange-500/30 transition-colors">
                Contacter l'entreprise
              </button>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}
