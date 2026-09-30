'use client';

import type { ComponentProps } from 'react';
import {
  LayoutDashboard,
  Users,
  Settings,
  Sparkles,
  ChevronsUpDown,
  LogOut,
  User,
  Bell,
  Command,
  PanelLeftOpen,
  PanelLeftClose,
  Clock,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '#/components/ui/sidebar.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu.tsx';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '#/components/ui/avatar.tsx';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip.tsx';
import { Button } from '#/components/ui/button.tsx';
import { m } from '#/paraglide/messages';
import { cn } from 'cn';

type BadgeType = 'urgent' | 'info' | 'subtle';

const badgeStyles: Record<BadgeType, string> = {
  urgent:
    'bg-destructive/15 text-destructive dark:bg-destructive/25 dark:text-destructive-foreground ring-1 ring-destructive/20',
  info: 'bg-blue-500/12 text-blue-700 dark:bg-blue-400/20 dark:text-blue-300 ring-1 ring-blue-500/15',
  subtle: 'bg-muted text-muted-foreground ring-1 ring-border',
};

export const NavBadge = ({
  count,
  type = 'subtle',
}: {
  count: number;
  type?: BadgeType;
}) => {
  return (
    <span
      className={cn(
        'ml-auto inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md px-1.5 text-[0.6875rem] font-semibold leading-none tabular-nums transition-colors group-data-[collapsible=icon]:hidden',
        badgeStyles[type]
      )}
    >
      {count}
    </span>
  );
}

export const AppSidebar = ({ ...props }: ComponentProps<typeof Sidebar>) => {
  const { state, toggleSidebar } = useSidebar();

  const mainNavItems = [
    {
      title: m['navbar.assign'](),
      url: '#',
      icon: Clock,
      badge: 12,
      badgeType: 'urgent' as BadgeType,
      isActive: false,
    },
    {
      title: m['navbar.recent'](),
      url: '#',
      icon: LayoutDashboard,
      badge: 8,
      badgeType: 'info' as BadgeType,
      isActive: false,
    },
    {
      title: m['navbar.favorites'](),
      url: '#',
      icon: Sparkles,
      badge: null,
      badgeType: null,
      isActive: false,
    },
    {
      title: m['navbar.teams'](),
      url: '#',
      icon: Users,
      badge: null,
      badgeType: null,
      isActive: false,
    },
  ];

  const secondaryNavItems = [
    {
      title: m['navbar.settings'](),
      url: '#',
      icon: Settings,
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between p-1 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-2">
          <div className="flex items-center gap-2 overflow-hidden px-1">
            <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Command className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-semibold tracking-tight text-foreground">
                Triago
              </span>
            </div>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                data-sidebar="trigger"
                data-slot="sidebar-trigger"
                className="size-8 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                {state === 'collapsed' ? (
                  <PanelLeftOpen className="size-4" />
                ) : (
                  <PanelLeftClose className="size-4" />
                )}
                <span className="sr-only">
                  {state === 'collapsed'
                    ? 'Rozwiń panel boczny'
                    : 'Zwiń panel boczny'}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side={state === 'collapsed' ? 'right' : 'bottom'}>
              {state === 'collapsed'
                ? 'Rozwiń panel boczny'
                : 'Zwiń panel boczny'}
            </TooltipContent>
          </Tooltip>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    tooltip={item.title}
                  >
                    <a href={item.url} className="flex min-w-0 items-center gap-2">
                      <item.icon className="size-4 shrink-0" />
                      <span className="truncate">{item.title}</span>
                      {item.badge !== null && (
                        <NavBadge count={item.badge} type={item.badgeType} />
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url} className="flex min-w-0 items-center gap-2">
                      <item.icon className="size-4 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8 rounded-lg shrink-0">
                    <AvatarImage src="" alt="Jan Kowalski" />
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-medium">
                      JK
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold">Jan Kowalski</span>
                    <span className="truncate text-xs text-muted-foreground">
                      jan.kowalski@triago.pl
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 shrink-0 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="size-8 rounded-lg">
                      <AvatarImage src="" alt="Jan Kowalski" />
                      <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-medium">
                        JK
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        Jan Kowalski
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        jan.kowalski@triago.pl
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles className="mr-2 size-4" />
                    Ulepsz do Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User className="mr-2 size-4" />
                    Konto
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 size-4" />
                    Powiadomienia
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 size-4" />
                    Ustawienia
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 size-4" />
                  Wyloguj się
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
