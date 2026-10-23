'use client';

import * as React from 'react';
import {
  AlertCircle,
  Bold,
  BookOpen,
  Bug,
  Calendar,
  Check,
  CheckSquare,
  Clock,
  Code,
  FileUp,
  FolderGit2,
  Italic,
  Lightbulb,
  List,
  ListOrdered,
  ListTree,
  Paperclip,
  Plus,
  Quote,
  Sparkles,
  Tag,
  Trash2,
  User,
  UserCheck,
  X,
} from 'lucide-react';
import { cn } from '#/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog.tsx';
import { Button } from '#/components/ui/button.tsx';
import { Input } from '#/components/ui/input.tsx';
import { Textarea } from '#/components/ui/textarea.tsx';
import { Badge } from '#/components/ui/badge.tsx';
import { Avatar, AvatarFallback } from '#/components/ui/avatar.tsx';
import { Checkbox } from '#/components/ui/checkbox.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select.tsx';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip.tsx';
import { useAuth } from '#/features/auth/queries';
import type {
  TicketPerson,
  TicketPriority,
  TicketStatus,
  TicketType,
} from '#/types/tickets';
import { PriorityBadge, StatusBadge, TicketTypeIcon } from './ticket-badges';
import { useCreateTicketModal } from '../context/create-ticket-context';

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
    role: 'QA Engineer',
  },
  {
    name: 'Michał Wiśniewski',
    email: 'm.wisniewski@triago.pl',
    avatarFallback: 'MW',
    role: 'Fullstack Developer',
  },
  {
    name: 'Karolina Kowalska',
    email: 'k.kowalska@triago.pl',
    avatarFallback: 'KK',
    role: 'Product Owner',
  },
  {
    name: 'Piotr Lewandowski',
    email: 'p.lewandowski@triago.pl',
    avatarFallback: 'PL',
    role: 'DevOps Engineer',
  },
];

const PRESET_LABELS = ['frontend', 'backend', 'api', 'ui/ux', 'bug', 'auth', 'database', 'security'];
const STORY_POINTS_OPTIONS = [1, 2, 3, 5, 8, 13];

const TICKET_TYPES: { type: TicketType; label: string; icon: typeof Bug; desc: string; color: string }[] = [
  { type: 'task', label: 'Zadanie (Task)', icon: CheckSquare, desc: 'Standardowe zadanie programistyczne lub projektowe', color: 'text-blue-500' },
  { type: 'bug', label: 'Błąd (Bug)', icon: Bug, desc: 'Problem lub usterka wymagająca naprawy', color: 'text-rose-500' },
  { type: 'story', label: 'Historyjka (Story)', icon: BookOpen, desc: 'Wymaganie użytkownika lub nowa funkcjonalność', color: 'text-emerald-500' },
  { type: 'improvement', label: 'Usprawnienie (Improvement)', icon: Lightbulb, desc: 'Optymalizacja lub ulepszenie obecnego rozwiązania', color: 'text-amber-500' },
  { type: 'subtask', label: 'Podzadanie (Subtask)', icon: ListTree, desc: 'Mniejszy element większego zadania', color: 'text-sky-500' },
];

export function CreateTicketModal() {
  const { isOpen, initialValues, closeCreateModal } = useCreateTicketModal();
  const { user } = useAuth();

  // Form states
  const [type, setType] = React.useState<TicketType>('task');
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [descTab, setDescTab] = React.useState<'write' | 'preview'>('write');
  const [status, setStatus] = React.useState<TicketStatus>('nowy');
  const [priority, setPriority] = React.useState<TicketPriority>('średni');
  const [assigneeEmail, setAssigneeEmail] = React.useState<string>('unassigned');
  const [sprint, setSprint] = React.useState<string>('sprint-4');
  const [storyPoints, setStoryPoints] = React.useState<number | ''>(3);
  const [dueDate, setDueDate] = React.useState<string>('');
  const [timeEstimate, setTimeEstimate] = React.useState<string>('');
  const [selectedLabels, setSelectedLabels] = React.useState<string[]>(['frontend']);
  const [customLabelInput, setCustomLabelInput] = React.useState('');
  
  // Subtasks / Acceptance criteria
  const [subtasks, setSubtasks] = React.useState<{ id: string; title: string; done: boolean }[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = React.useState('');

  // Attachments
  const [attachments, setAttachments] = React.useState<{ name: string; size: string }[]>([]);

  // Other options
  const [createAnother, setCreateAnother] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successToast, setSuccessToast] = React.useState<string | null>(null);

  // User details for reporter
  const reporterPerson: TicketPerson = React.useMemo(() => {
    return {
      name: user?.fullName || 'Zalogowany użytkownik',
      email: user?.email || 'user@triago.pl',
      avatarFallback: user?.fullName
        ? user.fullName
            .split(' ')
            .filter(Boolean)
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : 'U',
      role: 'Reporter',
    };
  }, [user]);

  // Synchronize initial values when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setType(initialValues.type ?? 'task');
      setStatus(initialValues.status ?? 'nowy');
      setPriority(initialValues.priority ?? 'średni');
      setSprint(initialValues.sprint !== undefined ? (initialValues.sprint ?? 'none') : 'sprint-4');
      setTitle(initialValues.title ?? '');
      setDescription(initialValues.description ?? '');
      setErrorMessage(null);
      setSuccessToast(null);
    }
  }, [isOpen, initialValues]);

  // Quick assign to me
  const handleAssignToMe = () => {
    if (user?.email) {
      setAssigneeEmail(user.email);
    } else {
      setAssigneeEmail(TEAM_MEMBERS[0].email);
    }
  };

  // Add label
  const handleAddCustomLabel = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customLabelInput.trim()) {
      e.preventDefault();
      const trimmed = customLabelInput.trim().toLowerCase();
      if (!selectedLabels.includes(trimmed)) {
        setSelectedLabels([...selectedLabels, trimmed]);
      }
      setCustomLabelInput('');
    }
  };

  const toggleLabel = (label: string) => {
    if (selectedLabels.includes(label)) {
      setSelectedLabels(selectedLabels.filter((l) => l !== label));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  // Add subtask
  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      {
        id: `sub-${Date.now()}`,
        title: newSubtaskTitle.trim(),
        done: false,
      },
    ]);
    setNewSubtaskTitle('');
  };

  const toggleSubtask = (id: string) => {
    setSubtasks(subtasks.map((s) => (s.id === id ? { ...s, done: !s.done } : s)));
  };

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  // Quick formatting insert helper
  const insertFormatting = (prefix: string, suffix: string = '') => {
    setDescription((prev) => `${prev}${prefix}tekst${suffix}`);
  };

  // Handle file select simulation
  const handleAddAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const sizeKb = Math.round(file.size / 1024);
      setAttachments((prev) => [
        ...prev,
        {
          name: file.name,
          size: sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`,
        },
      ]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  // Submit handler
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Wprowadź tytuł zadania');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    const generatedId = `TRG-${Math.floor(150 + Math.random() * 100)}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessToast(`Zadanie ${generatedId} zostało pomyślnie utworzone!`);

      if (createAnother) {
        setTitle('');
        setDescription('');
        setSubtasks([]);
        setAttachments([]);
      } else {
        setTimeout(() => {
          closeCreateModal();
        }, 1200);
      }
    }, 600);
  };

  // Keyboard shortcut listener for Cmd+Enter / Ctrl+Enter
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, title, createAnother]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeCreateModal()}>
      <DialogContent
        className="w-[min(96vw,1060px)] max-w-[1060px] p-0 gap-0 overflow-hidden rounded-2xl border-border/80 shadow-2xl max-h-[92vh] flex flex-col"
        showCloseButton={true}
      >
        {/* ── Dialog Header with Breadcrumb & Key preview ────────── */}
        <DialogHeader className="border-b px-6 py-4 bg-muted/20 flex flex-row items-center justify-between text-left">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
              <FolderGit2 className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs tracking-wider text-muted-foreground uppercase">
                  Triago Project
                </span>
                <span className="text-muted-foreground/60">•</span>
                <div className="flex items-center gap-1.5">
                  <TicketTypeIcon type={type} />
                  <Badge variant="outline" className="text-[10px] h-4.5 px-1.5 font-mono font-medium">
                    TRG
                  </Badge>
                </div>
              </div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Nowe zadanie
              </DialogTitle>
            </div>
          </div>

          <DialogDescription className="sr-only">
            Formularz tworzenia nowego zadania w projekcie Triago
          </DialogDescription>
        </DialogHeader>

        {/* ── Success notification banner ──────────────────────── */}
        {successToast && (
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-2.5 flex items-center justify-between text-xs font-medium text-emerald-600 dark:text-emerald-400 animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
              <Check className="size-4 shrink-0 text-emerald-500" />
              <span>{successToast}</span>
            </div>
          </div>
        )}

        {/* ── Error notification banner ────────────────────────── */}
        {errorMessage && (
          <div className="bg-destructive/10 border-b border-destructive/20 px-6 py-2 flex items-center gap-2 text-xs font-medium text-destructive animate-in fade-in">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ── Modal Split Body ─────────────────────────────────── */}
        <div className="flex-1 min-h-0 overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_320px]">
          {/* ──── Left Column: Content & Description ───────────── */}
          <div className="p-6 space-y-6 overflow-y-auto overflow-x-hidden">
            {/* Task Title */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="ticket-title"
                  className="text-xs font-semibold text-foreground flex items-center gap-1"
                >
                  Tytuł zadania <span className="text-destructive">*</span>
                </label>
                <span className="text-[11px] text-muted-foreground">
                  {title.length}/120
                </span>
              </div>
              <Input
                id="ticket-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                autoFocus
                placeholder="np. Zaimplementować walidację formularza lub naprawić błąd..."
                className="h-10 text-sm font-medium border-border focus-visible:ring-primary/30"
              />
            </div>

            {/* Description with Markdown Toolbar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  Opis
                </label>
                <div className="flex items-center rounded-md border bg-muted/40 p-0.5 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setDescTab('write')}
                    className={cn(
                      'px-2.5 py-0.5 rounded cursor-pointer transition-colors',
                      descTab === 'write'
                        ? 'bg-background text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    Edycja
                  </button>
                  <button
                    type="button"
                    onClick={() => setDescTab('preview')}
                    className={cn(
                      'px-2.5 py-0.5 rounded cursor-pointer transition-colors',
                      descTab === 'preview'
                        ? 'bg-background text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    Podgląd
                  </button>
                </div>
              </div>

              {descTab === 'write' ? (
                <div className="rounded-lg border border-border focus-within:ring-1 focus-within:ring-primary/40 focus-within:border-primary overflow-hidden transition-all bg-background">
                  {/* Markdown Toolbar */}
                  <div className="flex items-center gap-1 border-b bg-muted/30 px-2 py-1 text-muted-foreground">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => insertFormatting('**', '**')}
                          className="rounded p-1 hover:bg-muted hover:text-foreground cursor-pointer"
                        >
                          <Bold className="size-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Pogrubienie (Bold)</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => insertFormatting('*', '*')}
                          className="rounded p-1 hover:bg-muted hover:text-foreground cursor-pointer"
                        >
                          <Italic className="size-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Kursywa (Italic)</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => insertFormatting('`', '`')}
                          className="rounded p-1 hover:bg-muted hover:text-foreground cursor-pointer"
                        >
                          <Code className="size-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Kod liniowy</TooltipContent>
                    </Tooltip>

                    <div className="h-3.5 w-px bg-border/60 mx-1" />

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => insertFormatting('\n- ')}
                          className="rounded p-1 hover:bg-muted hover:text-foreground cursor-pointer"
                        >
                          <List className="size-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Lista punktowana</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => insertFormatting('\n1. ')}
                          className="rounded p-1 hover:bg-muted hover:text-foreground cursor-pointer"
                        >
                          <ListOrdered className="size-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Lista numerowana</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => insertFormatting('\n> ')}
                          className="rounded p-1 hover:bg-muted hover:text-foreground cursor-pointer"
                        >
                          <Quote className="size-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Cytat</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => insertFormatting('\n- [ ] ')}
                          className="rounded p-1 hover:bg-muted hover:text-foreground cursor-pointer"
                        >
                          <CheckSquare className="size-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Pole wyboru</TooltipContent>
                    </Tooltip>
                  </div>

                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Opisz szczegóły zadania, kroki do odtworzenia problemu lub pożądany rezultat..."
                    className="min-h-[120px] resize-y border-0 focus-visible:ring-0 text-sm p-3 shadow-none bg-transparent"
                  />
                </div>
              ) : (
                <div className="min-h-[148px] rounded-lg border bg-muted/10 p-3 text-sm text-foreground space-y-2 whitespace-pre-wrap">
                  {description.trim() ? (
                    description
                  ) : (
                    <span className="text-muted-foreground italic">
                      Brak treści opisu do wyświetlenia.
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Subtasks / Acceptance Criteria */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <CheckSquare className="size-3.5 text-primary" />
                  Kryteria akceptacji / Podzadania
                </label>
                {subtasks.length > 0 && (
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {subtasks.filter((s) => s.done).length}/{subtasks.length} ukończono
                  </span>
                )}
              </div>

              {subtasks.length > 0 && (
                <div className="space-y-1.5 rounded-lg border bg-muted/10 p-2">
                  {subtasks.map((st) => (
                    <div
                      key={st.id}
                      className="group flex items-center justify-between gap-2 rounded-md bg-background px-2.5 py-1.5 border border-border/60 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Checkbox
                          checked={st.done}
                          onCheckedChange={() => toggleSubtask(st.id)}
                        />
                        <span
                          className={cn(
                            'truncate',
                            st.done && 'line-through text-muted-foreground',
                          )}
                        >
                          {st.title}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSubtask(st.id)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity cursor-pointer p-0.5"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <Input
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtask();
                    }
                  }}
                  placeholder="Dodaj kryterium lub podzadanie..."
                  className="h-8 text-xs bg-muted/20"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSubtask}
                  className="h-8 px-2.5 text-xs shrink-0 cursor-pointer"
                >
                  <Plus className="size-3.5 mr-1" />
                  Dodaj
                </Button>
              </div>
            </div>

            {/* Attachments Section */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Paperclip className="size-3.5 text-primary" />
                Załączniki
              </label>

              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {attachments.map((att, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="flex items-center gap-1.5 py-1 px-2.5 text-xs"
                    >
                      <Paperclip className="size-3 text-muted-foreground" />
                      <span className="font-medium truncate max-w-[150px]">{att.name}</span>
                      <span className="text-[10px] text-muted-foreground">({att.size})</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(i)}
                        className="text-muted-foreground hover:text-destructive cursor-pointer ml-1"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <label className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/80 bg-muted/10 hover:bg-muted/30 p-4 transition-colors cursor-pointer group">
                <input
                  type="file"
                  onChange={handleAddAttachment}
                  className="hidden"
                />
                <div className="flex items-center gap-2 text-xs text-muted-foreground group-hover:text-foreground">
                  <FileUp className="size-4 text-primary" />
                  <span>Przeciągnij pliki lub <span className="text-primary font-medium underline">wybierz z dysku</span></span>
                </div>
                <span className="text-[10px] text-muted-foreground/75 mt-0.5">PNG, JPG, PDF, ZIP do 25MB</span>
              </label>
            </div>
          </div>

          {/* ──── Right Column: Properties & Metadata ───────────── */}
          <div className="border-t md:border-t-0 md:border-l bg-muted/20 p-6 space-y-5 overflow-y-auto overflow-x-hidden">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Właściwości zadania
            </h4>

            {/* Typ zadania */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Typ zadania</label>
              <Select value={type} onValueChange={(val) => setType(val as TicketType)}>
                <SelectTrigger className="w-full bg-background h-8 text-xs cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TICKET_TYPES.map((t) => {
                    const Icon = t.icon;
                    return (
                      <SelectItem key={t.type} value={t.type}>
                        <div className="flex items-center gap-2">
                          <Icon className={cn('size-3.5', t.color)} />
                          <span>{t.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <Select value={status} onValueChange={(val) => setStatus(val as TicketStatus)}>
                <SelectTrigger className="w-full bg-background h-8 text-xs cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nowy">
                    <StatusBadge status="nowy" />
                  </SelectItem>
                  <SelectItem value="w_toku">
                    <StatusBadge status="w_toku" />
                  </SelectItem>
                  <SelectItem value="review">
                    <StatusBadge status="review" />
                  </SelectItem>
                  <SelectItem value="testowanie">
                    <StatusBadge status="testowanie" />
                  </SelectItem>
                  <SelectItem value="zamknięty">
                    <StatusBadge status="zamknięty" />
                  </SelectItem>
                  <SelectItem value="zablokowany">
                    <StatusBadge status="zablokowany" />
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Priorytet</label>
              <Select value={priority} onValueChange={(val) => setPriority(val as TicketPriority)}>
                <SelectTrigger className="w-full bg-background h-8 text-xs cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="krytyczny">
                    <PriorityBadge priority="krytyczny" />
                  </SelectItem>
                  <SelectItem value="wysoki">
                    <PriorityBadge priority="wysoki" />
                  </SelectItem>
                  <SelectItem value="średni">
                    <PriorityBadge priority="średni" />
                  </SelectItem>
                  <SelectItem value="niski">
                    <PriorityBadge priority="niski" />
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Assignee */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">Przypisana osoba</label>
                <button
                  type="button"
                  onClick={handleAssignToMe}
                  className="text-[11px] font-medium text-primary hover:underline cursor-pointer flex items-center gap-1"
                >
                  <UserCheck className="size-3" />
                  Do mnie
                </button>
              </div>

              <Select value={assigneeEmail} onValueChange={setAssigneeEmail}>
                <SelectTrigger className="w-full bg-background h-9 text-xs cursor-pointer">
                  <SelectValue placeholder="Wybierz osobę..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="flex size-5 items-center justify-center rounded-full bg-muted border">
                        <User className="size-3" />
                      </div>
                      <span>Nieprzypisane</span>
                    </div>
                  </SelectItem>
                  {TEAM_MEMBERS.map((member) => (
                    <SelectItem key={member.email} value={member.email}>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-5">
                          <AvatarFallback className="text-[10px]">
                            {member.avatarFallback}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-xs">{member.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reporter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Zgłaszający</label>
              <div className="flex items-center gap-2 rounded-md border border-border/80 bg-background/50 px-2.5 py-1.5 text-xs text-muted-foreground">
                <Avatar className="size-5">
                  <AvatarFallback className="text-[10px]">
                    {reporterPerson.avatarFallback}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground">{reporterPerson.name}</span>
                <span className="ml-auto text-[10px] text-muted-foreground">(Ty)</span>
              </div>
            </div>

            {/* Sprint */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Sprint</label>
              <Select value={sprint} onValueChange={setSprint}>
                <SelectTrigger className="w-full bg-background h-8 text-xs cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sprint-4">Sprint 4 — September (Aktywny)</SelectItem>
                  <SelectItem value="sprint-3">Sprint 3 — September</SelectItem>
                  <SelectItem value="none">Backlog (Bez sprintu)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Story Points (Wycena) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">Story Points</label>
                {storyPoints !== '' && (
                  <span className="text-[11px] font-mono font-semibold text-primary">
                    {storyPoints} SP
                  </span>
                )}
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {STORY_POINTS_OPTIONS.map((pts) => (
                  <button
                    key={pts}
                    type="button"
                    onClick={() => setStoryPoints(storyPoints === pts ? '' : pts)}
                    className={cn(
                      'h-7 rounded border text-xs font-medium transition-all cursor-pointer flex items-center justify-center',
                      storyPoints === pts
                        ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs'
                        : 'border-border bg-background hover:bg-muted text-muted-foreground',
                    )}
                  >
                    {pts}
                  </button>
                ))}
              </div>
            </div>

            {/* Due date */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Calendar className="size-3" />
                Termin ukończenia
              </label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="h-8 text-xs bg-background"
              />
            </div>

            {/* Time Estimate */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Clock className="size-3" />
                Szacowany czas
              </label>
              <Input
                value={timeEstimate}
                onChange={(e) => setTimeEstimate(e.target.value)}
                placeholder="np. 4h, 1d 2h..."
                className="h-8 text-xs bg-background"
              />
            </div>

            {/* Labels */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Tag className="size-3" />
                Etykiety
              </label>
              
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedLabels.map((lbl) => (
                  <Badge
                    key={lbl}
                    variant="secondary"
                    className="gap-1 py-0 px-2 text-[11px] bg-primary/10 text-primary border-primary/20"
                  >
                    {lbl}
                    <button
                      type="button"
                      onClick={() => toggleLabel(lbl)}
                      className="cursor-pointer hover:text-destructive"
                    >
                      <X className="size-2.5" />
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-1">
                {PRESET_LABELS.filter((l) => !selectedLabels.includes(l))
                  .slice(0, 4)
                  .map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => toggleLabel(lbl)}
                      className="rounded border border-dashed border-border/80 px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-muted/40 cursor-pointer"
                    >
                      + {lbl}
                    </button>
                  ))}
              </div>

              <Input
                value={customLabelInput}
                onChange={(e) => setCustomLabelInput(e.target.value)}
                onKeyDown={handleAddCustomLabel}
                placeholder="Wpisz etykietę i wciśnij Enter..."
                className="h-7 text-xs bg-background mt-1.5"
              />
            </div>
          </div>
        </div>

        {/* ── Dialog Footer with Shortcuts ─────────────────────── */}
        <DialogFooter className="border-t px-6 py-3 bg-muted/20 flex flex-row items-center justify-between sm:justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="create-another"
              checked={createAnother}
              onCheckedChange={(checked) => setCreateAnother(!!checked)}
            />
            <label
              htmlFor="create-another"
              className="text-xs font-medium text-muted-foreground cursor-pointer select-none"
            >
              Utwórz kolejne zadanie
            </label>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={closeCreateModal}
              className="h-9 px-3 text-xs cursor-pointer"
            >
              Anuluj
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isSubmitting}
              onClick={() => handleSubmit()}
              className="h-9 px-4 text-xs font-semibold gap-1.5 bg-primary text-primary-foreground shadow-sm hover:opacity-95 cursor-pointer"
            >
              <Sparkles className="size-3.5" />
              {isSubmitting ? 'Tworzenie...' : 'Utwórz zadanie'}
              <kbd className="ml-1 hidden sm:inline-flex items-center gap-0.5 rounded bg-primary-foreground/20 px-1 py-0.5 text-[10px] font-mono leading-none">
                ⌘↵
              </kbd>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
