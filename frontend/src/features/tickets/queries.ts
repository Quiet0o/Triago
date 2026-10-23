import { queryOptions, skipToken } from '@tanstack/react-query';
import {
  getSprints,
  getTicketActivities,
  getTicketById,
  getTicketComments,
  getTickets,
} from './api';
import type { TicketFilters } from '#/types/tickets';

/**
 * 4. Query Key Discipline
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
};

/**
 * 1. Types: Infer via Functions, Don't Manually Pass Generics
 * 2. Share Options via queryOptions
 * 3. Handle Conditional Queries with skipToken
 */
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
};
