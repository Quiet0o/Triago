'use client';

import * as React from 'react';
import { skipToken, useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Flame,
  Inbox,
  ListTodo,
  Loader2,
  Mail,
  Palette,
  ShieldCheck,
  Trash2,
  TrendingUp,
  Upload,
  User as UserIcon,
  X,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar.tsx';
import { Badge } from '#/components/ui/badge.tsx';
import { Button } from '#/components/ui/button.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu.tsx';
import { cn } from '#/lib/utils';
import type { Ticket } from '#/types/tickets';
import { ticketQueries } from '#/features/tickets/queries';
import {
  PriorityBadge,
  StatusBadge,
  StoryPointsBadge,
  TicketTypeIcon,
} from '#/features/tickets/components/ticket-badges';

const PRESET_BANNERS: Record<string, { name: string; bgClass: string; dotClass: string }> = {
  ocean: {
    name: 'Ocean Breeze',
    bgClass: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500',
    dotClass: 'bg-gradient-to-r from-blue-500 to-indigo-600',
  },
  sunset: {
    name: 'Sunset Horizon',
    bgClass: 'bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500',
    dotClass: 'bg-gradient-to-r from-rose-500 to-amber-500',
  },
  aurora: {
    name: 'Emerald Aurora',
    bgClass: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600',
    dotClass: 'bg-gradient-to-r from-emerald-500 to-teal-600',
  },
  cyberpunk: {
    name: 'Neon Cyber',
    bgClass: 'bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-700',
    dotClass: 'bg-gradient-to-r from-fuchsia-600 to-purple-800',
  },
  dark: {
    name: 'Midnight Slate',
    bgClass: 'bg-gradient-to-r from-slate-900 via-slate-800 to-zinc-900',
    dotClass: 'bg-gradient-to-r from-slate-800 to-neutral-950',
  },
};

export interface UserProfileViewProps {
  userIdOrEmail: string;
}

type TabType = 'assigned' | 'reported' | 'in_progress';

export function UserProfileView({ userIdOrEmail }: UserProfileViewProps) {
  const navigate = useNavigate();
  const [copiedEmail, setCopiedEmail] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<TabType>('assigned');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  const [customAvatar, setCustomAvatar] = React.useState<string | null>(null);
  const [customBanner, setCustomBanner] = React.useState<string | null>(null);

  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const bannerInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch user profile
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useQuery(ticketQueries.userProfile(userIdOrEmail ? userIdOrEmail : skipToken));

  // Fetch all tickets to calculate stats and list assigned/reported tasks
  const { data: tickets = [], isLoading: isTicketsLoading } = useQuery(ticketQueries.list());

  React.useEffect(() => {
    if (!user?.email) return;
    try {
      const savedAvatar = localStorage.getItem(`triago_user_avatar_${user.email}`);
      if (savedAvatar) setCustomAvatar(savedAvatar);
      const savedBanner = localStorage.getItem(`triago_user_banner_${user.email}`);
      if (savedBanner) setCustomBanner(savedBanner);
    } catch {}
  }, [user?.email]);

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.email) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCustomAvatar(dataUrl);
        try {
          localStorage.setItem(`triago_user_avatar_${user.email}`, dataUrl);
        } catch {}
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveAvatar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.email) return;
    setCustomAvatar(null);
    try {
      localStorage.removeItem(`triago_user_avatar_${user.email}`);
    } catch {}
  };

  const handleBannerFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.email) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCustomBanner(dataUrl);
        try {
          localStorage.setItem(`triago_user_banner_${user.email}`, dataUrl);
        } catch {}
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSetPresetBanner = (presetId: string) => {
    if (!user?.email) return;
    setCustomBanner(presetId);
    try {
      localStorage.setItem(`triago_user_banner_${user.email}`, presetId);
    } catch {}
  };

  const handleRemoveBanner = () => {
    if (!user?.email) return;
    setCustomBanner(null);
    try {
      localStorage.removeItem(`triago_user_banner_${user.email}`);
    } catch {}
  };

  const handleCopyEmail = () => {
    if (!user?.email) return;
    void navigator.clipboard.writeText(user.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Filter tickets for this user
  const userAssignedTickets = React.useMemo(() => {
    if (!user) return [];
    return tickets.filter(
      (t) =>
        t.assignee?.email.toLowerCase() === user.email.toLowerCase() ||
        (user.id && t.assignee?.id === user.id) ||
        t.assignee?.name.toLowerCase() === user.name.toLowerCase(),
    );
  }, [tickets, user]);

  const userReportedTickets = React.useMemo(() => {
    if (!user) return [];
    return tickets.filter(
      (t) =>
        t.reporter?.email.toLowerCase() === user.email.toLowerCase() ||
        (user.id && t.reporter?.id === user.id) ||
        t.reporter?.name.toLowerCase() === user.name.toLowerCase(),
    );
  }, [tickets, user]);

  const userInProgressTickets = React.useMemo(() => {
    return userAssignedTickets.filter((t) => t.status === 'w_toku');
  }, [userAssignedTickets]);

  // Statistics
  const totalAssigned = userAssignedTickets.length;
  const closedCount = userAssignedTickets.filter((t) => t.status === 'zamknięty').length;
  const inProgressCount = userInProgressTickets.length;
  const openCount = totalAssigned - closedCount;
  const completionRate = totalAssigned > 0 ? Math.round((closedCount / totalAssigned) * 100) : 0;

  const totalPoints = userAssignedTickets.reduce((acc, t) => acc + (t.storyPoints || 0), 0);
  const completedPoints = userAssignedTickets
    .filter((t) => t.status === 'zamknięty')
    .reduce((acc, t) => acc + (t.storyPoints || 0), 0);

  // Tickets to display in current tab
  const activeTicketsList = React.useMemo(() => {
    let list: Ticket[] = [];
    if (activeTab === 'assigned') list = userAssignedTickets;
    else if (activeTab === 'reported') list = userReportedTickets;
    else if (activeTab === 'in_progress') list = userInProgressTickets;

    if (statusFilter !== 'all') {
      list = list.filter((t) => t.status === statusFilter);
    }
    return list;
  }, [activeTab, statusFilter, userAssignedTickets, userReportedTickets, userInProgressTickets]);

  if (isUserLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="size-7 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">Ładowanie profilu użytkownika...</p>
      </div>
    );
  }

  if (isUserError || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-6 text-center max-w-md mx-auto">
        <div className="size-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
          <UserIcon className="size-6" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Nie znaleziono użytkownika</h2>
          <p className="text-xs text-muted-foreground mt-1">
            {userError?.message || `Użytkownik "${userIdOrEmail}" nie istnieje w systemie.`}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate({ to: '/project/backlog' })}
          className="gap-2 text-xs cursor-pointer"
        >
          <ArrowLeft className="size-3.5" />
          Powrót do zadań
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* ── Top Navigation Bar ───────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.history.back()}
          className="gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Wróć</span>
        </Button>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs text-muted-foreground gap-1">
            <ShieldCheck className="size-3 text-emerald-500" />
            Zweryfikowane konto
          </Badge>
        </div>
      </div>

      {/* ── Hero Profile Card ────────────────────────────────────── */}
      <div className="rounded-2xl border bg-card overflow-hidden shadow-xs relative">
        {/* Decorative / custom banner background */}
        <div
          className={cn(
            'h-44 sm:h-52 w-full relative border-b border-border/40 transition-all duration-300 overflow-hidden',
            customBanner && PRESET_BANNERS[customBanner]
              ? PRESET_BANNERS[customBanner].bgClass
              : !customBanner
                ? 'bg-gradient-to-r from-primary/20 via-purple-500/15 to-blue-500/20'
                : 'bg-cover bg-center',
          )}
          style={
            customBanner && !PRESET_BANNERS[customBanner]
              ? { backgroundImage: `url(${customBanner})` }
              : undefined
          }
        >
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

          {/* Banner action button: change background */}
          <div className="absolute top-3 right-3 z-20">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 gap-1.5 text-xs bg-background/85 hover:bg-background backdrop-blur-md shadow-xs border border-border/60 text-foreground cursor-pointer font-medium"
                >
                  <Camera className="size-3.5 text-primary" />
                  <span>Zmień tło</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onClick={() => bannerInputRef.current?.click()}
                  className="gap-2 cursor-pointer text-xs"
                >
                  <Upload className="size-3.5 text-primary" />
                  <span>Wgraj własne zdjęcie...</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Palette className="size-3" />
                  <span>Gotowe motywy</span>
                </div>
                {Object.entries(PRESET_BANNERS).map(([key, preset]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => handleSetPresetBanner(key)}
                    className="gap-2 cursor-pointer text-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn('size-3 rounded-full shrink-0 shadow-2xs', preset.dotClass)} />
                      <span>{preset.name}</span>
                    </div>
                    {customBanner === key && <Check className="size-3.5 text-primary shrink-0" />}
                  </DropdownMenuItem>
                ))}
                {customBanner && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleRemoveBanner}
                      variant="destructive"
                      className="gap-2 cursor-pointer text-xs"
                    >
                      <Trash2 className="size-3.5" />
                      <span>Przywróć domyślne tło</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBannerFile}
            />
          </div>
        </div>

        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-18 mb-4">
            {/* Avatar & Info */}
            <div className="flex items-end gap-4">
              {/* Avatar with hover change trigger */}
              <div className="relative group shrink-0">
                <Avatar className="size-28 sm:size-32 rounded-2xl border-4 border-card shadow-xl bg-card overflow-hidden">
                  <AvatarImage
                    src={
                      customAvatar ??
                      `https://i.pravatar.cc/150?u=${encodeURIComponent(user.email)}`
                    }
                    alt={user.name}
                    className="object-cover size-full"
                  />
                  <AvatarFallback className="text-3xl font-bold bg-primary text-primary-foreground">
                    {user.avatarFallback}
                  </AvatarFallback>
                </Avatar>

                {/* Online indicator */}
                <span
                  className="absolute bottom-1.5 right-1.5 size-4 rounded-full bg-emerald-500 border-2 border-card ring-2 ring-emerald-500/20 z-10"
                  title="Aktywny w systemie"
                />

                {/* Hover overlay to change avatar */}
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute inset-0 rounded-2xl bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10 backdrop-blur-xs"
                  title="Kliknij, aby zmienić zdjęcie profilowe"
                >
                  <Camera className="size-5 mb-1 text-white" />
                  <span className="text-[10px] font-semibold tracking-wide">Zmień</span>
                </button>

                {/* Reset custom avatar if set */}
                {customAvatar && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center justify-center shadow-md z-20 cursor-pointer transition-transform hover:scale-110"
                    title="Przywróć domyślny awatar"
                  >
                    <X className="size-3" />
                  </button>
                )}

                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarFile}
                />
              </div>

              {/* User details */}
              <div className="space-y-1 mb-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                    {user.name}
                  </h1>
                  <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-0.5 rounded-md">
                    {user.role}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
                  {user.jobTitle && user.jobTitle.trim().toLowerCase() !== user.role.trim().toLowerCase() ? (
                    <>
                      <Briefcase className="size-3.5 text-primary shrink-0" />
                      <span className="font-medium text-foreground/85">{user.jobTitle}</span>
                      <span className="text-muted-foreground/40">•</span>
                    </>
                  ) : null}
                  <ShieldCheck className="size-3.5 text-emerald-500 shrink-0" />
                  <span>Konto zweryfikowane • Triago Workspace</span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 mt-2 sm:mt-0 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyEmail}
                className="gap-2 text-xs h-9 cursor-pointer shadow-2xs font-medium"
              >
                {copiedEmail ? (
                  <>
                    <Check className="size-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      Skopiowano email
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5 text-muted-foreground" />
                    <span>Kopiuj e-mail</span>
                  </>
                )}
              </Button>
              <Button
                variant="default"
                size="sm"
                asChild
                className="gap-1.5 text-xs h-9 cursor-pointer shadow-xs"
              >
                <a href={`mailto:${user.email}`}>
                  <Mail className="size-3.5" />
                  <span>Napisz</span>
                </a>
              </Button>
            </div>
          </div>

          {/* User metadata row */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-muted-foreground border-t pt-4">
            <div className="flex items-center gap-2">
              <Mail className="size-3.5 text-primary shrink-0" />
              <span className="font-mono text-foreground/80">{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="size-3.5 text-muted-foreground shrink-0" />
              <span>
                Stanowisko:{' '}
                <strong className="font-medium text-foreground/90">{user.jobTitle ?? user.role}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="size-3.5 text-muted-foreground shrink-0" />
              <span>
                Dołączył(a):{' '}
                <strong className="font-medium text-foreground/90">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('pl-PL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Wrzesień 2026'}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-2 sm:ml-auto">
              <span className="size-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20 animate-pulse" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Aktywny w zespole</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Key Performance Metrics (KPI Cards) ──────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Assigned Card */}
        <div className="rounded-xl border bg-card p-4 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Przypisane</span>
            <div className="size-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <ListTodo className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">{totalAssigned}</span>
            <span className="text-[11px] text-muted-foreground">{openCount} otwartych</span>
          </div>
        </div>

        {/* In Progress Card */}
        <div className="rounded-xl border bg-card p-4 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">W toku</span>
            <div className="size-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Clock className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">{inProgressCount}</span>
            <span className="text-[11px] text-amber-600 font-medium">Bieżąca praca</span>
          </div>
        </div>

        {/* Completed Card */}
        <div className="rounded-xl border bg-card p-4 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Ukończone</span>
            <div className="size-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">{closedCount}</span>
            <span className="text-[11px] text-emerald-600 font-medium">{completionRate}% zrobione</span>
          </div>
        </div>

        {/* Story Points Card */}
        <div className="rounded-xl border bg-card p-4 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Story Points</span>
            <div className="size-7 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Flame className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">{totalPoints}</span>
            <span className="text-[11px] text-purple-600 font-medium">
              {completedPoints} ukończonych
            </span>
          </div>
        </div>
      </div>

      {/* ── Efficiency Progress Bar ──────────────────────────────── */}
      {totalAssigned > 0 && (
        <div className="rounded-xl border bg-card p-4 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground flex items-center gap-1.5">
              <TrendingUp className="size-3.5 text-primary" />
              Wskaźnik realizacji powierzonych zadań
            </span>
            <span className="font-mono font-semibold text-primary">
              {closedCount}/{totalAssigned} zadań ({completionRate}%)
            </span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      )}

      {/* ── Tasks Section with Tabs ──────────────────────────────── */}
      <div className="rounded-xl border bg-card p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('assigned')}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center gap-1.5',
                activeTab === 'assigned'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <ListTodo className="size-3.5" />
              Przypisane ({userAssignedTickets.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('in_progress')}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center gap-1.5',
                activeTab === 'in_progress'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Clock className="size-3.5 text-amber-500" />
              W toku ({userInProgressTickets.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reported')}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center gap-1.5',
                activeTab === 'reported'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Inbox className="size-3.5" />
              Zgłoszone ({userReportedTickets.length})
            </button>
          </div>

          {/* Quick status filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-muted-foreground mr-1 text-[11px]">Status:</span>
            {['all', 'nowy', 'w_toku', 'review', 'zamknięty'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={cn(
                  'px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer',
                  statusFilter === st
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted',
                )}
              >
                {st === 'all'
                  ? 'Wszystkie'
                  : st === 'w_toku'
                    ? 'W toku'
                    : st === 'zamknięty'
                      ? 'Zamknięte'
                      : st.charAt(0).toUpperCase() + st.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Task Cards List */}
        {isTicketsLoading ? (
          <div className="py-8 text-center">
            <Loader2 className="size-5 animate-spin mx-auto text-primary" />
            <p className="text-xs text-muted-foreground mt-2">Ładowanie zadań...</p>
          </div>
        ) : activeTicketsList.length === 0 ? (
          <div className="py-10 text-center border border-dashed rounded-lg space-y-1">
            <p className="text-xs font-medium text-foreground">Brak zadań w tej kategorii</p>
            <p className="text-[11px] text-muted-foreground">
              Użytkownik nie ma przypisanych zadań spełniających wybrane kryteria filtrowania.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {activeTicketsList.map((ticket) => (
              <Link
                key={ticket.id}
                to="/project/tickets/$ticketId"
                params={{ ticketId: ticket.id }}
                className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-card hover:bg-muted/30 hover:border-primary/30 transition-all group cursor-pointer block"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <TicketTypeIcon type={ticket.type} />
                  <span className="font-mono text-xs font-semibold text-primary shrink-0">
                    {ticket.id}
                  </span>
                  <span className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {ticket.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <PriorityBadge priority={ticket.priority} />
                  <StatusBadge status={ticket.status} />
                  <StoryPointsBadge points={ticket.storyPoints} />
                  <ExternalLink className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
