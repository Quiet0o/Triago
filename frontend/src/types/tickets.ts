export type TicketPriority = 'krytyczny' | 'wysoki' | 'średni' | 'niski';
export type TicketStatus =
  'nowy' | 'w_toku' | 'review' | 'testowanie' | 'zamknięty' | 'zablokowany';
export type TicketType = 'bug' | 'task' | 'story' | 'subtask' | 'improvement';

export type TicketPerson = {
  name: string;
  email: string;
  avatarFallback: string;
  role: string;
};

export type Subtask = {
  id: string;
  title: string;
  status: TicketStatus;
};

export type Sprint = {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'planned';
};

export type Ticket = {
  id: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  type: TicketType;
  priority: TicketPriority;
  status: TicketStatus;
  assignee: TicketPerson | null;
  reporter: TicketPerson;
  sprint: string | null;
  storyPoints: number;
  labels: string[];
  createdAt: string;
  updatedAt: string;
  dueDate: string | null;
  timeEstimate: string;
  timeSpent: string | null;
  subtasks: Subtask[];
  comments: number;
  attachments: number;
  blockedBy?: string;
  blockedReason?: string;
};

export type Reaction = {
  emoji: string;
  count: number;
  reacted?: boolean;
};

export type Comment = {
  id: string;
  author: TicketPerson;
  content: string;
  contentHtml?: string;
  createdAt: string;
  timestamp: number;
  reactions: Reaction[];
};

export type ActivityEvent = {
  id: string;
  user: string;
  userAvatarFallback: string;
  action: string;
  target: string;
  time: string;
  timestamp: number;
  type?: 'status' | 'assignee' | 'created' | 'general';
};

export type TicketFilters = {
  status?: string;
  priority?: string;
  search?: string;
  sprint?: string;
};

export type MockData = {
  sprints: Sprint[];
  priorities: TicketPriority[];
  statuses: TicketStatus[];
  types: TicketType[];
  tickets: Ticket[];
};
