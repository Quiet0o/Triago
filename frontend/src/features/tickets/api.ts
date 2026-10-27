import mockDataRaw from '#/data/mock-tickets.json';
import { AppError } from '#/lib/errors';
import type {
  ActivityEvent,
  Comment,
  MockData,
  Sprint,
  Subtask,
  Ticket,
  TicketFilters,
  TicketPerson,
  TicketPriority,
  TicketStatus,
  TicketType,
} from '#/types/tickets';

const BACKEND_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/+$/, '');
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

// In-memory fallback stores for when backend is unreachable
const ticketsStore: Ticket[] = [...mockData.tickets];
const commentsStore: Record<string, Comment[]> = {
  'TRG-142': [...INITIAL_COMMENTS],
};
const activitiesStore: Record<string, ActivityEvent[]> = {
  'TRG-142': [...INITIAL_ACTIVITIES],
};

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BACKEND_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!res.ok) {
    let errorDetail = `Request to ${endpoint} failed with status ${res.status}`;
    try {
      const data = await res.json();
      if (data.detail) errorDetail = data.detail;
      else if (data.title) errorDetail = data.title;
    } catch {
      // ignore
    }
    throw new AppError(errorDetail, res.status, 'API_ERROR');
  }

  return res.json() as Promise<T>;
}

export type CreateTicketInput = {
  title: string;
  description?: string;
  descriptionHtml?: string;
  type?: TicketType;
  priority?: TicketPriority;
  status?: TicketStatus;
  assigneeEmail?: string;
  sprintId?: string;
  parentId?: string;
  epicId?: string;
  storyPoints?: number;
  labels?: string[];
  dueDate?: string;
  timeEstimate?: string;
  subtasks?: string[];
};

export type UpdateTicketInput = Partial<Ticket> & {
  assigneeEmail?: string;
  sprintId?: string;
  parentId?: string;
  epicId?: string;
};

export type CreateCommentInput = {
  content: string;
  contentHtml?: string;
};

/**
 * Fetch all tickets with optional filtering from backend API.
 */
export async function getTickets(filters?: TicketFilters): Promise<Ticket[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== 'all') params.set('status', filters.status);
    if (filters?.priority && filters.priority !== 'all') params.set('priority', filters.priority);
    if (filters?.sprint && filters.sprint !== 'all') params.set('sprint', filters.sprint);
    if (filters?.search?.trim()) params.set('search', filters.search.trim());

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await apiRequest<Ticket[]>(`/api/tickets${queryString}`);
  } catch (err) {
    console.warn('Backend unavailable, falling back to mock tickets:', err);
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
}

/**
 * Fetch a single ticket by its ID.
 */
export async function getTicketById(id: string): Promise<Ticket> {
  try {
    return await apiRequest<Ticket>(`/api/tickets/${id}`);
  } catch (err) {
    console.warn(`Backend unavailable for ticket ${id}, falling back to mock store:`, err);
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
}

/**
 * Fetch all sprints from backend API.
 */
export async function getSprints(): Promise<Sprint[]> {
  try {
    return await apiRequest<Sprint[]>('/api/sprints');
  } catch (err) {
    console.warn('Backend unavailable for sprints, falling back to mock sprints:', err);
    return [...mockData.sprints];
  }
}

/**
 * Fetch comments for a specific ticket.
 */
export async function getTicketComments(ticketId: string): Promise<Comment[]> {
  try {
    return await apiRequest<Comment[]>(`/api/tickets/${ticketId}/comments`);
  } catch (err) {
    console.warn(`Backend unavailable for comments of ${ticketId}, using fallback:`, err);
    return commentsStore[ticketId] ?? [];
  }
}

/**
 * Fetch activities for a specific ticket.
 */
export async function getTicketActivities(ticketId: string): Promise<ActivityEvent[]> {
  try {
    return await apiRequest<ActivityEvent[]>(`/api/tickets/${ticketId}/activities`);
  } catch (err) {
    console.warn(`Backend unavailable for activities of ${ticketId}, using fallback:`, err);
    return activitiesStore[ticketId] ?? [];
  }
}

/**
 * Create a new ticket via backend API.
 */
export async function createTicket(input: CreateTicketInput): Promise<Ticket> {
  try {
    return await apiRequest<Ticket>('/api/tickets', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  } catch (err) {
    console.warn('Backend unavailable, creating ticket in local mock store:', err);
    const generatedId = `TRG-${Math.floor(150 + Math.random() * 100)}`;
    const newTicket: Ticket = {
      id: generatedId,
      title: input.title,
      description: input.description ?? '',
      descriptionHtml: input.descriptionHtml,
      type: input.type ?? 'task',
      priority: input.priority ?? 'średni',
      status: input.status ?? 'nowy',
      assignee: input.assigneeEmail
        ? (TEAM_MEMBERS.find((m) => m.email === input.assigneeEmail) ?? null)
        : null,
      reporter: TEAM_MEMBERS[1],
      sprint: input.sprintId ?? null,
      parentId: input.parentId ?? null,
      epicId: input.epicId ?? null,
      storyPoints: input.storyPoints ?? 0,
      labels: input.labels ?? [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: input.dueDate ?? null,
      timeEstimate: input.timeEstimate ?? '0h',
      timeSpent: null,
      subtasks: (input.subtasks ?? []).map((t, idx) => ({
        id: `${generatedId}-${idx + 1}`,
        title: t,
        status: 'nowy',
      })),
      comments: 0,
      attachments: 0,
    };
    ticketsStore.unshift(newTicket);
    return newTicket;
  }
}

/**
 * Update an existing ticket (status change, drag&drop, assignee, priority).
 */
export async function updateTicket(id: string, patch: UpdateTicketInput): Promise<Ticket> {
  try {
    return await apiRequest<Ticket>(`/api/tickets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
  } catch (err) {
    console.warn(`Backend unavailable, patching ticket ${id} in local mock store:`, err);
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
}

/**
 * Add a comment to a ticket.
 */
export async function addComment(ticketId: string, input: CreateCommentInput): Promise<Comment> {
  try {
    return await apiRequest<Comment>(`/api/tickets/${ticketId}/comments`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  } catch (err) {
    console.warn(`Backend unavailable, adding comment to local mock store for ${ticketId}:`, err);
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: TEAM_MEMBERS[0],
      content: input.content,
      contentHtml: input.contentHtml,
      createdAt: 'Przed chwilą',
      timestamp: Date.now(),
      reactions: [],
    };
    if (!commentsStore[ticketId]) {
      commentsStore[ticketId] = [];
    }
    commentsStore[ticketId].push(newComment);
    return newComment;
  }
}

/**
 * Add a subtask to a ticket.
 */
export async function addSubtask(ticketId: string, title: string): Promise<Subtask> {
  try {
    return await apiRequest<Subtask>(`/api/tickets/${ticketId}/subtasks`, {
      method: 'POST',
      body: JSON.stringify({ title, status: 'nowy' }),
    });
  } catch (err) {
    console.warn('Backend unavailable, adding subtask to mock store:', err);
    return {
      id: `${ticketId}-${Date.now()}`,
      title,
      status: 'nowy',
    };
  }
}

/**
 * Update an existing subtask (status or title).
 */
export async function updateSubtask(
  ticketId: string,
  subtaskId: string,
  patch: { title?: string; status?: TicketStatus },
): Promise<Subtask> {
  try {
    return await apiRequest<Subtask>(`/api/tickets/${ticketId}/subtasks/${subtaskId}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
  } catch (err) {
    console.warn('Backend unavailable, updating subtask in mock store:', err);
    return {
      id: subtaskId,
      title: patch.title ?? '',
      status: patch.status ?? 'nowy',
    };
  }
}

/**
 * Delete a subtask from a ticket.
 */
export async function deleteSubtask(ticketId: string, subtaskId: string): Promise<void> {
  try {
    await apiRequest<void>(`/api/tickets/${ticketId}/subtasks/${subtaskId}`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.warn('Backend unavailable, deleting subtask in mock store:', err);
  }
}

export interface BackendUserDto {
  id: string;
  email: string;
  fullName: string | null;
  jobTitle: string | null;
  avatarFallback: string;
  roles: string[];
  createdAt: string;
  avatarUrl?: string | null;
  banner?: string | null;
}

/**
 * Fetch all users from backend or fallback to TEAM_MEMBERS.
 */
export async function getUsers(): Promise<TicketPerson[]> {
  try {
    const data = await apiRequest<BackendUserDto[]>('/api/users');
    if (Array.isArray(data) && data.length > 0) {
      return data.map((u) => ({
        id: u.id,
        name: u.fullName ?? u.email,
        email: u.email,
        avatarFallback: u.avatarFallback,
        role: u.jobTitle ?? (u.roles.includes('ROLE_ADMIN') ? 'Administrator' : 'Developer'),
        jobTitle: u.jobTitle ?? undefined,
        createdAt: u.createdAt,
        avatarUrl: u.avatarUrl,
        banner: u.banner,
      }));
    }
  } catch (err) {
    console.warn('Backend unavailable, using TEAM_MEMBERS fallback:', err);
  }
  return TEAM_MEMBERS;
}

/**
 * Fetch user profile by ID or email.
 */
export async function getUserProfile(idOrEmail: string): Promise<TicketPerson> {
  const decoded = decodeURIComponent(idOrEmail);
  try {
    const u = await apiRequest<BackendUserDto>(`/api/users/${encodeURIComponent(decoded)}`);
    return {
      id: u.id,
      name: u.fullName ?? u.email,
      email: u.email,
      avatarFallback: u.avatarFallback,
      role: u.jobTitle ?? (u.roles.includes('ROLE_ADMIN') ? 'Administrator' : 'Developer'),
      jobTitle: u.jobTitle ?? undefined,
      createdAt: u.createdAt,
      avatarUrl: u.avatarUrl,
      banner: u.banner,
    };
  } catch (err) {
    console.warn('Backend user profile not found, checking local TEAM_MEMBERS:', err);
  }

  const found = TEAM_MEMBERS.find(
    (m) =>
      m.email.toLowerCase() === decoded.toLowerCase() ||
      m.name.toLowerCase() === decoded.toLowerCase() ||
      m.id === decoded,
  );

  if (found) {
    return found;
  }

  return {
    id: 'user-unknown',
    name: decoded.includes('@') ? decoded.split('@')[0] : decoded,
    email: decoded.includes('@') ? decoded : `${decoded.toLowerCase()}@triago.pl`,
    avatarFallback: decoded.slice(0, 2).toUpperCase(),
    role: 'Team Member',
  };
}

/**
 * Update user profile (avatar, banner, jobTitle, fullName).
 */
export async function updateUserProfile(
  idOrEmail: string,
  patch: {
    avatarUrl?: string | null;
    banner?: string | null;
    fullName?: string;
    jobTitle?: string;
  },
): Promise<TicketPerson> {
  const decoded = decodeURIComponent(idOrEmail);
  try {
    const u = await apiRequest<BackendUserDto>(`/api/users/${encodeURIComponent(decoded)}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
    return {
      id: u.id,
      name: u.fullName ?? u.email,
      email: u.email,
      avatarFallback: u.avatarFallback,
      role: u.jobTitle ?? (u.roles.includes('ROLE_ADMIN') ? 'Administrator' : 'Developer'),
      jobTitle: u.jobTitle ?? undefined,
      createdAt: u.createdAt,
      avatarUrl: u.avatarUrl,
      banner: u.banner,
    };
  } catch (err) {
    console.warn('Backend user update failed:', err);
    throw err;
  }
}

/**
 * Upload user avatar image file to backend.
 */
export async function uploadUserAvatar(idOrEmail: string, file: File): Promise<TicketPerson> {
  const decoded = decodeURIComponent(idOrEmail);
  const formData = new FormData();
  formData.append('avatar', file);

  const url = `${BACKEND_URL}/api/users/${encodeURIComponent(decoded)}/avatar`;
  const res = await fetch(url, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!res.ok) {
    let errorDetail = `Nie udało się przesłać zdjęcia: ${res.status}`;
    try {
      const data = await res.json();
      if (data.detail) errorDetail = data.detail;
    } catch {}
    throw new AppError(errorDetail, res.status, 'AVATAR_UPLOAD_ERROR');
  }

  const u = (await res.json()) as BackendUserDto;
  return {
    id: u.id,
    name: u.fullName ?? u.email,
    email: u.email,
    avatarFallback: u.avatarFallback,
    role: u.jobTitle ?? (u.roles.includes('ROLE_ADMIN') ? 'Administrator' : 'Developer'),
    jobTitle: u.jobTitle ?? undefined,
    createdAt: u.createdAt,
    avatarUrl: u.avatarUrl,
    banner: u.banner,
  };
}

/**
 * Upload user banner image file to backend.
 */
export async function uploadUserBanner(idOrEmail: string, file: File): Promise<TicketPerson> {
  const decoded = decodeURIComponent(idOrEmail);
  const formData = new FormData();
  formData.append('banner', file);

  const url = `${BACKEND_URL}/api/users/${encodeURIComponent(decoded)}/banner`;
  const res = await fetch(url, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!res.ok) {
    let errorDetail = `Nie udało się przesłać banera: ${res.status}`;
    try {
      const data = await res.json();
      if (data.detail) errorDetail = data.detail;
    } catch {}
    throw new AppError(errorDetail, res.status, 'BANNER_UPLOAD_ERROR');
  }

  const u = (await res.json()) as BackendUserDto;
  return {
    id: u.id,
    name: u.fullName ?? u.email,
    email: u.email,
    avatarFallback: u.avatarFallback,
    role: u.jobTitle ?? (u.roles.includes('ROLE_ADMIN') ? 'Administrator' : 'Developer'),
    jobTitle: u.jobTitle ?? undefined,
    createdAt: u.createdAt,
    avatarUrl: u.avatarUrl,
    banner: u.banner,
  };
}

/**
 * Batch reorder tickets on backend (kanban column and position changes).
 */
export async function reorderTickets(
  items: Array<{ id: string; status?: TicketStatus; position?: number; rank?: string }>,
): Promise<Ticket[]> {
  try {
    return await apiRequest<Ticket[]>('/api/tickets/reorder', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  } catch (err) {
    console.warn('Backend reorder failed, falling back to client-only:', err);
    return [];
  }
}
