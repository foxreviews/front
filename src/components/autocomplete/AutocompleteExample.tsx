import { useState } from "react";
import { useVilleAutocomplete, useSousCategorieAutocomplete } from "../../hooks/useAutocomplete";
import "./AutocompleteExample.css";

/**
 * Composant d'exemple montrant l'utilisation de l'autocomplete optimisé
 * Pour les villes et sous-catégories
 */
export function AutocompleteExample() {
  const [villeQuery, setVilleQuery] = useState("");
  const [sousCatQuery, setSousCatQuery] = useState("");
  const [selectedVille, setSelectedVille] = useState<string | null>(null);
  const [selectedSousCat, setSelectedSousCat] = useState<string | null>(null);

  // Autocomplete de villes (optimisé avec debounce)
  const {
    results: villeResults,
    loading: villeLoading,
    error: villeError,
  } = useVilleAutocomplete(villeQuery);

  // Autocomplete de sous-catégories (optimisé avec debounce)
  const {
    results: sousCatResults,
    loading: sousCatLoading,
    error: sousCatError,
  } = useSousCategorieAutocomplete(sousCatQuery);

  return (
    <div className="autocomplete-example">
      <h2>Exemple d'Autocomplete Optimisé</h2>

      {/* Autocomplete Villes */}
      <div className="autocomplete-section">
        <h3>Recherche de Ville</h3>
        <div className="search-box">
          <input
            type="text"
            placeholder="Tapez un nom de ville ou code postal..."
            value={villeQuery}
            onChange={(e) => setVilleQuery(e.target.value)}
            className="autocomplete-input"
          />
          {villeLoading && <span className="loading-indicator">🔄</span>}
        </div>

        {villeError && <div className="error-message">{villeError}</div>}

        {villeResults.length > 0 && (
          <ul className="autocomplete-results">
            {villeResults.map((ville) => (
              <li
                key={ville.id}
                onClick={() => {
                  setSelectedVille(ville.nom);
                  setVilleQuery(ville.nom);
                }}
                className="autocomplete-item"
              >
                <span className="ville-nom">{ville.nom}</span>
                <span className="ville-info">
                  {ville.code_postal_principal} - {ville.departement}
                </span>
              </li>
            ))}
          </ul>
        )}

        {selectedVille && (
          <div className="selected-item">
            ✓ Sélectionné : <strong>{selectedVille}</strong>
          </div>
        )}
      </div>

      {/* Autocomplete Sous-catégories */}
      <div className="autocomplete-section">
        <h3>Recherche de Sous-catégorie</h3>
        <div className="search-box">
          <input
            type="text"
            placeholder="Tapez un nom de sous-catégorie..."
            value={sousCatQuery}
            onChange={(e) => setSousCatQuery(e.target.value)}
            className="autocomplete-input"
          />
          {sousCatLoading && <span className="loading-indicator">🔄</span>}
        </div>

        {sousCatError && <div className="error-message">{sousCatError}</div>}

        {sousCatResults.length > 0 && (
          <ul className="autocomplete-results">
            {sousCatResults.map((sousCat) => (
              <li
                key={sousCat.id}
                onClick={() => {
                  setSelectedSousCat(sousCat.nom);
                  setSousCatQuery(sousCat.nom);
                }}
                className="autocomplete-item"
              >
                <span className="souscat-nom">{sousCat.nom}</span>
              </li>
            ))}
          </ul>
        )}

        {selectedSousCat && (
          <div className="selected-item">
            ✓ Sélectionné : <strong>{selectedSousCat}</strong>
          </div>
        )}
      </div>

      {/* Avantages de l'autocomplete optimisé */}
      <div className="info-box">
        <h4>✨ Avantages de cette méthode :</h4>
        <ul>
          <li>🚀 <strong>Performance optimale</strong> - Utilise les index trigram du backend</li>
          <li>📦 <strong>Cache intelligent</strong> - Résultats mis en cache côté serveur</li>
          <li>⏱️ <strong>Debounce automatique</strong> - Évite les requêtes inutiles</li>
          <li>🎯 <strong>Résultats pertinents</strong> - Maximum 10 résultats par requête</li>
          <li>💾 <strong>Économie de bande passante</strong> - Ne charge pas toutes les données</li>
        </ul>
      </div>
    </div>
  );
}
