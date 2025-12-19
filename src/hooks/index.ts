/**
 * Barrel export pour tous les hooks
 * Permet d'importer facilement depuis un point central
 */

export { useSearch } from "./useSearch";
export { useFetch } from "./useFetch";
export { useCategories, useSousCategories, useVilles, useReference } from "./useReference";
export { useProLocalisation } from "./useProLocalisation";
export { useAuth } from "./useAuth";
export { useDashboard, useEntreprise, useAvis, useSponsorisations } from "./useClient";
export { useBilling, useInvoice } from "./useBilling";
export { 
  useVilleAutocomplete, 
  useSousCategorieAutocomplete, 
  useVilleLookup, 
  useVilleStats 
} from "./useAutocomplete";

// Futurs hooks à ajouter ici
// export { useAuth } from "./useAuth";
// export { useEntreprise } from "./useEntreprise";
