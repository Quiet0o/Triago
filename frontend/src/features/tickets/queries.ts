import { queryOptions, skipToken, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addComment,
  addSubtask,
  createTicket,
  deleteSubtask,
  getSprints,
  getTicketActivities,
  getTicketById,
  getTicketComments,
  getTickets,
  getUserProfile,
  getUsers,
  reorderTickets,
  updateSubtask,
  updateTicket,
  updateUserProfile,
  uploadUserAvatar,
  uploadUserBanner,
} from './api';
import type { CreateCommentInput, CreateTicketInput, UpdateTicketInput } from './api';
import type { TicketFilters, TicketStatus } from '#/types/tickets';

/**
 * Hierarchical query key factory ensuring predictable caching and targeted invalidation.
 */
export const ticketKeys = {
  all: ['tickets'] as const,
  lists: () => [...ticketKeys.all, 'list'] as const,
  list: (filters?: TicketFilters) => [...ticketKeys.lists(), filters ?? {}] as const,
  details: () => [...ticketKeys.all, 'detail'] as const,
  detail: (id: string | typeof skipToken) => [...ticketKeys.details(), id] as const,
  comments: (ticketId: string | typeof skipToken) =>
    [...ticketKeys.details(), ticketId, 'comments'] as const,
  activities: (ticketId: string | typeof skipToken) =>
    [...ticketKeys.details(), ticketId, 'activities'] as const,
  sprints: () => ['sprints'] as const,
  users: () => ['users'] as const,
  userProfile: (idOrEmail: string | typeof skipToken) => ['users', 'profile', idOrEmail] as const,
};

export const ticketQueries = {
  // All tickets or filtered list
  list: (filters?: TicketFilters) =>
    queryOptions({
      queryKey: ticketKeys.list(filters),
      queryFn: () => getTickets(filters),
      staleTime: 1000 * 60 * 2,
    }),

  // Single ticket detail with skipToken support for conditional queries
  detail: (id: string | typeof skipToken) =>
    queryOptions({
      queryKey: ticketKeys.detail(id),
      queryFn: id === skipToken ? skipToken : () => getTicketById(id),
      staleTime: 1000 * 60 * 2,
    }),

  // Ticket comments
  comments: (ticketId: string | typeof skipToken) =>
    queryOptions({
      queryKey: ticketKeys.comments(ticketId),
      queryFn: ticketId === skipToken ? skipToken : () => getTicketComments(ticketId),
      staleTime: 1000 * 30,
    }),

  // Ticket change history / activities
  activities: (ticketId: string | typeof skipToken) =>
    queryOptions({
      queryKey: ticketKeys.activities(ticketId),
      queryFn: ticketId === skipToken ? skipToken : () => getTicketActivities(ticketId),
      staleTime: 1000 * 30,
    }),

  // Sprints list
  sprints: () =>
    queryOptions({
      queryKey: ticketKeys.sprints(),
      queryFn: () => getSprints(),
      staleTime: 1000 * 60 * 10,
    }),

  // Users list
  users: () =>
    queryOptions({
      queryKey: ticketKeys.users(),
      queryFn: () => getUsers(),
      staleTime: 1000 * 60 * 5,
    }),

  // User profile
  userProfile: (idOrEmail: string | typeof skipToken) =>
    queryOptions({
      queryKey: ticketKeys.userProfile(idOrEmail),
      queryFn: idOrEmail === skipToken ? skipToken : () => getUserProfile(idOrEmail),
      staleTime: 1000 * 60 * 5,
    }),
};

/**
 * Mutation to create a new ticket with automatic cache invalidation.
 */
export function useCreateTicketMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTicketInput) => createTicket(input),
    onSuccess: (newTicket) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.setQueryData(ticketKeys.detail(newTicket.id), newTicket);
    },
  });
}

/**
 * Mutation to update an existing ticket (status, assignee, sprint, epic, etc.).
 */
export function useUpdateTicketMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: UpdateTicketInput }) =>
      updateTicket(id, patch),
    onSuccess: (updatedTicket) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.setQueryData(ticketKeys.detail(updatedTicket.id), updatedTicket);
      queryClient.invalidateQueries({ queryKey: ticketKeys.activities(updatedTicket.id) });
    },
  });
}

/**
 * Mutation to add a comment to a ticket.
 */
export function useAddCommentMutation(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCommentInput) => addComment(ticketId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.comments(ticketId) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.activities(ticketId) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });
    },
  });
}

/**
 * Mutation to add a subtask to a ticket.
 */
export function useAddSubtaskMutation(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title: string) => addSubtask(ticketId, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
    },
  });
}

/**
 * Mutation to update/toggle a subtask.
 */
export function useUpdateSubtaskMutation(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subtaskId,
      patch,
    }: {
      subtaskId: string;
      patch: { title?: string; status?: TicketStatus };
    }) => updateSubtask(ticketId, subtaskId, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
    },
  });
}

/**
 * Mutation to delete a subtask.
 */
export function useDeleteSubtaskMutation(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subtaskId: string) => deleteSubtask(ticketId, subtaskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
    },
  });
}

/**
 * Mutation to update user profile on the backend (avatar, banner, job title, name).
 */
export function useUpdateUserProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      idOrEmail,
      patch,
    }: {
      idOrEmail: string;
      patch: {
        avatarUrl?: string | null;
        banner?: string | null;
        fullName?: string;
        jobTitle?: string;
      };
    }) => updateUserProfile(idOrEmail, patch),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.userProfile(variables.idOrEmail) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.users() });
    },
  });
}

/**
 * Mutation to upload user avatar file to the backend.
 */
export function useUploadUserAvatarMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idOrEmail, file }: { idOrEmail: string; file: File }) =>
      uploadUserAvatar(idOrEmail, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.userProfile(variables.idOrEmail) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.users() });
    },
  });
}

/**
 * Mutation to upload user banner file to the backend.
 */
export function useUploadUserBannerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idOrEmail, file }: { idOrEmail: string; file: File }) =>
      uploadUserBanner(idOrEmail, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.userProfile(variables.idOrEmail) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.users() });
    },
  });
}

/**
 * Mutation to batch reorder tickets (column movement & position inside column).
 */
export function useReorderTicketsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      items: Array<{
        id: string;
        status?: TicketStatus;
        position?: number;
        rank?: string;
      }>,
    ) => reorderTickets(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
    },
  });
}

