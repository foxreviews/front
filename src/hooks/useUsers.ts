import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import type { User } from '../types/auth';
import type { UserFilters } from '../types/user';
import type { PaginatedResponse } from '../types/common';

/**
 * Hook pour récupérer la liste des utilisateurs (admin uniquement)
 */
export function useUsers(filters?: UserFilters) {
  return useQuery<PaginatedResponse<User>, Error>({
    queryKey: ['users', filters],
    queryFn: () => userService.getUsers(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook pour récupérer un utilisateur spécifique (admin uniquement)
 */
export function useUser(userId: string | null) {
  return useQuery<User, Error>({
    queryKey: ['user', userId],
    queryFn: () => userService.getUser(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
