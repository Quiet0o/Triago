import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, loginUser, logoutUser, registerUser } from './api';
import type { LoginCredentials, RegisterCredentials, User } from './types';

export const authQueryOptions = queryOptions<User | null>({
  queryKey: ['auth', 'me'],
  queryFn: getCurrentUser,
  staleTime: 1000 * 60 * 5, // 5 minutes
  retry: false,
});

export function useAuth() {
  const queryClient = useQueryClient();
  const { data: user, isLoading, isError, refetch } = useQuery(authQueryOptions);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => loginUser(credentials),
    onSuccess: (newUser) => {
      queryClient.setQueryData(authQueryOptions.queryKey, newUser);
      void queryClient.invalidateQueries({ queryKey: authQueryOptions.queryKey });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) => registerUser(credentials),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: authQueryOptions.queryKey });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(authQueryOptions.queryKey, null);
      void queryClient.invalidateQueries({ queryKey: authQueryOptions.queryKey });
    },
  });

  return {
    user: user ?? null,
    isAuthenticated: Boolean(user),
    isLoading,
    isError,
    refetch,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
}
