'use client';

import * as React from 'react';
import {
  AlertCircle,
  BookOpen,
  Bug,
  Check,
  CheckSquare,
  FolderGit2,
  Lightbulb,
  ListTree,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog.tsx';
import { Input } from '#/components/ui/input.tsx';
import { Badge } from '#/components/ui/badge.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select.tsx';
import { useAuth } from '#/features/auth/queries';
import type { TicketPerson, TicketPriority, TicketStatus, TicketType } from '#/types/tickets';
import { TicketTypeIcon } from './ticket-badges';
import { useCreateTicketModal } from '../context/create-ticket-context';
import { BasicTaskEditor } from '#/components/editor/basic-editor';
import { TEAM_MEMBERS } from '../api';
import { useCreateTicketMutation } from '../queries';
import type { CreateSubtaskItem } from './create-ticket/create-ticket-subtasks';
import { CreateTicketSubtasks } from './create-ticket/create-ticket-subtasks';
import type { AttachmentItem } from './create-ticket/create-ticket-attachments';
import { CreateTicketAttachments } from './create-ticket/create-ticket-attachments';
import { CreateTicketSidebar } from './create-ticket/create-ticket-sidebar';
import { CreateTicketFooter } from './create-ticket/create-ticket-footer';

export const TICKET_TYPES: {
  type: TicketType;
  label: string;
  icon: typeof Bug;
  desc: string;
  color: string;
}[] = [
  {
    type: 'epic',
    label: 'Epik (Epic)',
    icon: Lightbulb,
    desc: 'Duża inicjatywa grupująca powiązane zadania',
    color: 'text-purple-500',
  },
  {
    type: 'task',
    label: 'Zadanie (Task)',
    icon: CheckSquare,
    desc: 'Standardowe zadanie programistyczne lub projektowe',
    color: 'text-blue-500',
  },
  {
    type: 'bug',
    label: 'Błąd (Bug)',
    icon: Bug,
    desc: 'Problem lub usterka wymagająca naprawy',
    color: 'text-rose-500',
  },
  {
    type: 'story',
    label: 'Historyjka (Story)',
    icon: BookOpen,
    desc: 'Wymaganie użytkownika lub nowa funkcjonalność',
    color: 'text-emerald-500',
  },
  {
    type: 'improvement',
    label: 'Usprawnienie (Improvement)',
    icon: Lightbulb,
    desc: 'Optymalizacja lub ulepszenie obecnego rozwiązania',
    color: 'text-amber-500',
  },
  {
    type: 'subtask',
    label: 'Podzadanie (Subtask)',
    icon: ListTree,
    desc: 'Mniejszy element większego zadania',
    color: 'text-sky-500',
  },
];

export function CreateTicketModal() {
  const { isOpen, initialValues, closeCreateModal } = useCreateTicketModal();
  const { user } = useAuth();

  // Form states
  const [type, setType] = React.useState<TicketType>('task');
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [descriptionHtml, setDescriptionHtml] = React.useState('');
  const [editorKey, setEditorKey] = React.useState(0);
  const [status, setStatus] = React.useState<TicketStatus>('nowy');
  const [priority, setPriority] = React.useState<TicketPriority>('średni');
  const [assigneeEmail, setAssigneeEmail] = React.useState<string>('unassigned');
  const [sprint, setSprint] = React.useState<string>('sprint-4');
  const [storyPoints, setStoryPoints] = React.useState<number | ''>(3);
  const [dueDate, setDueDate] = React.useState<string>('');
  const [selectedLabels, setSelectedLabels] = React.useState<string[]>(['frontend']);

  // Subtasks & Attachments
  const [subtasks, setSubtasks] = React.useState<CreateSubtaskItem[]>([]);
  const [attachments, setAttachments] = React.useState<AttachmentItem[]>([]);

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
      setDescriptionHtml('');
      setEditorKey((k) => k + 1);
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

  // Label handlers
  const handleToggleLabel = (label: string) => {
    if (selectedLabels.includes(label)) {
      setSelectedLabels(selectedLabels.filter((l) => l !== label));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  const handleAddCustomLabel = (trimmed: string) => {
    if (!selectedLabels.includes(trimmed)) {
      setSelectedLabels([...selectedLabels, trimmed]);
    }
  };

  // Subtasks handlers
  const handleAddSubtask = (subtaskTitle: string) => {
    setSubtasks((prev) => [
      ...prev,
      {
        id: `sub-${Date.now()}`,
        title: subtaskTitle,
        done: false,
      },
    ]);
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks((prev) => prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s)));
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  };

  // Attachment handlers
  const handleAddAttachment = (file: File) => {
    const sizeKb = Math.round(file.size / 1024);
    setAttachments((prev) => [
      ...prev,
      {
        name: file.name,
        size: sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`,
      },
    ]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const createTicketMutation = useCreateTicketMutation();

  // Submit handler
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Wprowadź tytuł zadania');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    createTicketMutation.mutate(
      {
        title: title.trim(),
        description,
        descriptionHtml,
        type,
        priority,
        status,
        assigneeEmail: assigneeEmail && assigneeEmail !== 'unassigned' ? assigneeEmail : undefined,
        sprintId: sprint && sprint !== 'none' ? sprint : undefined,
        storyPoints: typeof storyPoints === 'number' ? storyPoints : 0,
        labels: selectedLabels,
        dueDate: dueDate || undefined,
        subtasks: subtasks.map((s) => s.title),
      },
      {
        onSuccess: (newTicket) => {
          setIsSubmitting(false);
          setSuccessToast(`Zadanie ${newTicket.id} zostało pomyślnie utworzone!`);

          if (createAnother) {
            setTitle('');
            setDescription('');
            setDescriptionHtml('');
            setEditorKey((k) => k + 1);
            setSubtasks([]);
            setAttachments([]);
          } else {
            setTimeout(() => {
              closeCreateModal();
            }, 1000);
          }
        },
        onError: (err) => {
          setIsSubmitting(false);
          setErrorMessage(err.message || 'Wystąpił błąd podczas tworzenia zadania');
        },
      },
    );
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
                  <Badge
                    variant="outline"
                    className="text-[10px] h-4.5 px-1.5 font-mono font-medium"
                  >
                    TRG
                  </Badge>
                </div>
              </div>
              <DialogTitle className="text-lg font-bold text-foreground">Nowe zadanie</DialogTitle>
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
                <span className="text-[11px] text-muted-foreground">Krótki i zwięzły opis</span>
              </div>
              <Input
                id="ticket-title"
                placeholder="np. Błąd uwierzytelniania dwuskładnikowego przy logowaniu z Safari"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                className="h-10 text-sm font-medium focus-visible:ring-1"
              />
            </div>

            {/* Ticket Type Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Typ zgłoszenia</label>
              <Select value={type} onValueChange={(val) => setType(val as TicketType)}>
                <SelectTrigger className="w-full bg-background h-10 text-xs cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TICKET_TYPES.map((t) => {
                    const Icon = t.icon;
                    return (
                      <SelectItem key={t.type} value={t.type}>
                        <div className="flex items-center gap-2 py-0.5">
                          <Icon className={`size-4 shrink-0 ${t.color}`} />
                          <div className="text-left">
                            <span className="font-semibold text-xs block">{t.label}</span>
                            <span className="text-[10px] text-muted-foreground block">
                              {t.desc}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Description with Basic ProseKit Editor */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Opis zadania</label>
              <BasicTaskEditor
                key={editorKey}
                initialContent={descriptionHtml || description}
                onChange={(text, html) => {
                  setDescription(text);
                  setDescriptionHtml(html);
                }}
                placeholder="Opisz szczegóły zadania, kroki do odtworzenia problemu lub pożądany rezultat..."
                minHeight="min-h-[140px]"
              />
            </div>

            {/* Subtasks / Acceptance Criteria */}
            <CreateTicketSubtasks
              subtasks={subtasks}
              onAddSubtask={handleAddSubtask}
              onToggleSubtask={handleToggleSubtask}
              onRemoveSubtask={handleRemoveSubtask}
            />

            {/* Attachments Dropzone */}
            <CreateTicketAttachments
              attachments={attachments}
              onAddAttachment={handleAddAttachment}
              onRemoveAttachment={handleRemoveAttachment}
            />
          </div>

          {/* ──── Right Column: Sidebar properties ─────────────── */}
          <CreateTicketSidebar
            status={status}
            onStatusChange={setStatus}
            priority={priority}
            onPriorityChange={setPriority}
            assigneeEmail={assigneeEmail}
            onAssigneeChange={setAssigneeEmail}
            onAssignToMe={handleAssignToMe}
            sprint={sprint}
            onSprintChange={setSprint}
            storyPoints={storyPoints}
            onStoryPointsChange={setStoryPoints}
            dueDate={dueDate}
            onDueDateChange={setDueDate}
            selectedLabels={selectedLabels}
            onToggleLabel={handleToggleLabel}
            onAddCustomLabel={handleAddCustomLabel}
            teamMembers={TEAM_MEMBERS}
            reporter={reporterPerson}
          />
        </div>

        {/* ── Modal Footer ─────────────────────────────────────── */}
        <CreateTicketFooter
          createAnother={createAnother}
          onCreateAnotherChange={setCreateAnother}
          isSubmitting={isSubmitting}
          onCancel={closeCreateModal}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}

export default CreateTicketModal;
