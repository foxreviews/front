/**
 * Barrel export pour tous les hooks
 * Permet d'importer facilement depuis un point central
 */

export { useSearch } from "./useSearch";
export { useFetch } from "./useFetch";
export { useCategories, useSousCategories, useVilles, useReference } from "./useReference";
export { useProLocalisation } from "./useProLocalisation";
export { useProLocalisationSeo } from "./useProLocalisationSeo";
export { useAuth } from "./useAuth";
export { useDashboard, useEntreprise, useAvis, useSponsorisations } from "./useClient";
export { useBilling, useInvoice } from "./useBilling";
export { 
  useVilleAutocomplete, 
  useSousCategorieAutocomplete, 
  useVilleLookup, 
  useVilleStats 
} from "./useAutocomplete";
export { useTracking, useTrackView, useTrackClick } from "./useTracking";
export { useExport } from "./useExport";
export { useUsers, useUser } from "./useUsers";
export { useAccount } from "./useAccount";
export { usePermissions, Permission, withPermission, withRole } from "./usePermissions";
export { useStripe } from "./useStripe";
