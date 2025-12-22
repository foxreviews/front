import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache des données pendant 5 minutes
      staleTime: 5 * 60 * 1000,
      // Garde les données en cache pendant 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry automatique en cas d'erreur
      retry: 1,
      // Refetch au focus de la fenêtre pour données fraîches
      refetchOnWindowFocus: true,
      // Refetch lors de la reconnexion
      refetchOnReconnect: true,
      // Désactiver refetch automatique au mount si données fraîches
      refetchOnMount: false,
    },
    mutations: {
      // Retry une fois en cas d'erreur
      retry: 1,
    },
  },
});

// Préchargement de données critiques
export const prefetchCategories = () => {
  return queryClient.prefetchQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories/');
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
  });
};

export const prefetchVilles = () => {
  return queryClient.prefetchQuery({
    queryKey: ['villes', 'popular'],
    queryFn: async () => {
      const response = await fetch('/api/villes/?popular=true');
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
  });
};
