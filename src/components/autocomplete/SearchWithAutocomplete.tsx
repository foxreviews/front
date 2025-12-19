import { useState } from "react";
import { AutocompleteInput } from "./AutocompleteInput";
import { useVilleAutocomplete, useSousCategorieAutocomplete } from "../../hooks/useAutocomplete";
import type { VilleAutocompleteItem, SousCategorie } from "../../types/reference";

/**
 * Exemple d'utilisation du composant AutocompleteInput générique
 * avec les hooks optimisés pour villes et sous-catégories
 */
export function SearchWithAutocomplete() {
  const [villeQuery, setVilleQuery] = useState("");
  const [sousCatQuery, setSousCatQuery] = useState("");
  const [selectedVille, setSelectedVille] = useState<VilleAutocompleteItem | null>(null);
  const [selectedSousCat, setSelectedSousCat] = useState<SousCategorie | null>(null);

  const villeAutocomplete = useVilleAutocomplete(villeQuery);
  const sousCatAutocomplete = useSousCategorieAutocomplete(sousCatQuery);

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Recherche avec Autocomplete Optimisé</h2>

      {/* Autocomplete pour les villes */}
      <div style={{ marginBottom: "2rem" }}>
        <label htmlFor="ville-search" style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
          Ville
        </label>
        <AutocompleteInput<VilleAutocompleteItem>
          placeholder="Rechercher une ville..."
          value={villeQuery}
          onChange={setVilleQuery}
          onSelect={(ville) => {
            setSelectedVille(ville);
            console.log("Ville sélectionnée:", ville);
          }}
          results={villeAutocomplete.results}
          loading={villeAutocomplete.loading}
          error={villeAutocomplete.error}
          renderItem={(ville) => (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 500 }}>{ville.nom}</span>
              <span style={{ color: "#7f8c8d", fontSize: "0.9rem" }}>
                {ville.code_postal_principal} - {ville.departement}
              </span>
            </div>
          )}
          getItemKey={(ville) => ville.id}
          getItemValue={(ville) => ville.nom}
          minQueryLength={2}
        />
        {selectedVille && (
          <div style={{ marginTop: "0.5rem", color: "#27ae60" }}>
            ✓ Sélectionné : {selectedVille.nom} ({selectedVille.code_postal_principal})
          </div>
        )}
      </div>

      {/* Autocomplete pour les sous-catégories */}
      <div style={{ marginBottom: "2rem" }}>
        <label htmlFor="souscat-search" style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
          Sous-catégorie
        </label>
        <AutocompleteInput<SousCategorie>
          placeholder="Rechercher une sous-catégorie..."
          value={sousCatQuery}
          onChange={setSousCatQuery}
          onSelect={(sousCat) => {
            setSelectedSousCat(sousCat);
            console.log("Sous-catégorie sélectionnée:", sousCat);
          }}
          results={sousCatAutocomplete.results}
          loading={sousCatAutocomplete.loading}
          error={sousCatAutocomplete.error}
          renderItem={(sousCat) => (
            <div>
              <div style={{ fontWeight: 500 }}>{sousCat.nom}</div>
            </div>
          )}
          getItemKey={(sousCat) => sousCat.id}
          getItemValue={(sousCat) => sousCat.nom}
          minQueryLength={2}
        />
        {selectedSousCat && (
          <div style={{ marginTop: "0.5rem", color: "#27ae60" }}>
            ✓ Sélectionné : {selectedSousCat.nom}
          </div>
        )}
      </div>

      {/* Bouton de recherche */}
      {selectedVille && selectedSousCat && (
        <button
          style={{
            padding: "0.75rem 2rem",
            backgroundColor: "#3498db",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontSize: "1rem",
            cursor: "pointer",
            fontWeight: 500,
          }}
          onClick={() => {
            console.log("Recherche lancée avec:", {
              ville: selectedVille,
              sousCategorie: selectedSousCat,
            });
            alert(`Recherche: ${selectedSousCat.nom} à ${selectedVille.nom}`);
          }}
        >
          Rechercher
        </button>
      )}
    </div>
  );
}
