import mockDataRaw from '#/data/mock-tickets.json';
import { AppError } from '#/lib/errors';
import type {
  ActivityEvent,
  Comment,
  MockData,
  Sprint,
  Ticket,
  TicketFilters,
  TicketPerson,
} from '#/types/tickets';

const mockData = mockDataRaw as unknown as MockData;

export const TEAM_MEMBERS: TicketPerson[] = [
  {
    name: 'Aleksandra Nowak',
    email: 'a.nowak@triago.pl',
    avatarFallback: 'AN',
    role: 'Senior Developer',
  },
  {
    name: 'Tomasz Zieliński',
    email: 't.zielinski@triago.pl',
    avatarFallback: 'TZ',
    role: 'Product Owner',
  },
  {
    name: 'Michał Kowalczyk',
    email: 'm.kowalczyk@triago.pl',
    avatarFallback: 'MK',
    role: 'QA Engineer',
  },
  {
    name: 'Ewa Wiśniewska',
    email: 'e.wisniewska@triago.pl',
    avatarFallback: 'EW',
    role: 'UX Designer',
  },
  {
    name: 'Kamil Lewandowski',
    email: 'k.lewandowski@triago.pl',
    avatarFallback: 'KL',
    role: 'Backend Dev',
  },
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c1',
    author: {
      name: 'Tomasz Zieliński',
      email: 't.zielinski@triago.pl',
      avatarFallback: 'TZ',
      role: 'Product Owner',
    },
    content:
      'Sprawdziłem logi na produkcji — timeout występuje przy próbie nawiązania połączenia TLS z serwerem pocztowym.',
    createdAt: 'Wczoraj o 14:22',
    timestamp: new Date('2026-09-17T14:22:00').getTime(),
    reactions: [
      { emoji: '👍', count: 2, reacted: false },
      { emoji: '👀', count: 1, reacted: true },
    ],
  },
  {
    id: 'c2',
    author: {
      name: 'Aleksandra Nowak',
      email: 'a.nowak@triago.pl',
      avatarFallback: 'AN',
      role: 'Senior Developer',
    },
    content:
      'Przygotowuję patch zwiększający timeout oraz dodający retry policy z exponential backoff. Do końca dnia wrzucę MR.',
    createdAt: 'Dzisiaj o 10:45',
    timestamp: new Date('2026-09-18T10:45:00').getTime(),
    reactions: [
      { emoji: '🚀', count: 3, reacted: true },
      { emoji: '💪', count: 2, reacted: false },
    ],
  },
];

export const INITIAL_ACTIVITIES: ActivityEvent[] = [
  {
    id: 'a3',
    user: 'Tomasz Zieliński',
    userAvatarFallback: 'TZ',
    action: 'utworzył zadanie',
    target: 'TRG-142',
    time: '17 wrz 2026, 11:30',
    timestamp: new Date('2026-09-17T11:30:00').getTime(),
    type: 'created',
  },
  {
    id: 'a2',
    user: 'Aleksandra Nowak',
    userAvatarFallback: 'AN',
    action: 'przypisała zadanie do',
    target: 'Aleksandra Nowak',
    time: '17 wrz 2026, 16:30',
    timestamp: new Date('2026-09-17T16:30:00').getTime(),
    type: 'assignee',
  },
  {
    id: 'a1',
    user: 'Aleksandra Nowak',
    userAvatarFallback: 'AN',
    action: 'zmieniła status na',
    target: 'W toku',
    time: '18 wrz 2026, 09:15',
    timestamp: new Date('2026-09-18T09:15:00').getTime(),
    type: 'status',
  },
];

// In-memory mutable stores for mock environment
const ticketsStore: Ticket[] = [...mockData.tickets];
const commentsStore: Record<string, Comment[]> = {
  'TRG-142': [...INITIAL_COMMENTS],
};
const activitiesStore: Record<string, ActivityEvent[]> = {
  'TRG-142': [...INITIAL_ACTIVITIES],
};

/**
 * Fetch all tickets with optional filtering.
 * Return type is explicitly inferred by TanStack Query.
 */
export async function getTickets(filters?: TicketFilters): Promise<Ticket[]> {
  let result = [...ticketsStore];

  if (filters?.status && filters.status !== 'all') {
    result = result.filter((t) => t.status === filters.status);
  }
  if (filters?.priority && filters.priority !== 'all') {
    result = result.filter((t) => t.priority === filters.priority);
  }
  if (filters?.sprint && filters.sprint !== 'all') {
    result = result.filter((t) => t.sprint === filters.sprint);
  }
  if (filters?.search?.trim()) {
    const q = filters.search.trim().toLowerCase();
    result = result.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q),
    );
  }

  return result;
}

/**
 * Fetch a single ticket by its ID.
 * Throws type-safe AppError if not found.
 */
export async function getTicketById(id: string): Promise<Ticket> {
  const found = ticketsStore.find((t) => t.id === id);
  if (!found) {
    throw new AppError(
      `Zadanie o identyfikatorze ${id} nie zostało odnalezione.`,
      404,
      'TICKET_NOT_FOUND',
    );
  }
  return found;
}

/**
 * Fetch all sprints.
 */
export async function getSprints(): Promise<Sprint[]> {
  return [...mockData.sprints];
}

/**
 * Fetch comments for a specific ticket.
 */
export async function getTicketComments(ticketId: string): Promise<Comment[]> {
  return commentsStore[ticketId] ?? [];
}

/**
 * Fetch activities for a specific ticket.
 */
export async function getTicketActivities(ticketId: string): Promise<ActivityEvent[]> {
  return activitiesStore[ticketId] ?? [];
}

/**
 * Update a ticket.
 */
export async function updateTicket(id: string, patch: Partial<Ticket>): Promise<Ticket> {
  const index = ticketsStore.findIndex((t) => t.id === id);
  if (index === -1) {
    throw new AppError(
      `Nie można zaktualizować nieistniejącego zadania ${id}.`,
      404,
      'TICKET_NOT_FOUND',
    );
  }
  const updated: Ticket = {
    ...ticketsStore[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  ticketsStore[index] = updated;
  return updated;
}
