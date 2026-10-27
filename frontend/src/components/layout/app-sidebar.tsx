'use client';

import type { ComponentProps } from 'react';
import { Link } from '@tanstack/react-router';
import {
  Clock,
  Command,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Sparkles,
  Users,
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
import { m } from '#/paraglide/messages';
import { cn } from 'cn';

type BadgeType = 'urgent' | 'info' | 'subtle';

const badgeStyles: Record<BadgeType, string> = {
  urgent:
    'bg-destructive/15 text-destructive dark:bg-destructive/25 dark:text-destructive-foreground ring-1 ring-destructive/20',
  info: 'bg-blue-500/12 text-blue-700 dark:bg-blue-400/20 dark:text-blue-300 ring-1 ring-blue-500/15',
  subtle: 'bg-muted text-muted-foreground ring-1 ring-border',
};

export const NavBadge = ({ count, type = 'subtle' }: { count: number; type?: BadgeType }) => {
  return (
    <span
      className={cn(
        'ml-auto inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md px-1.5 text-[0.6875rem] font-semibold leading-none tabular-nums transition-colors group-data-[collapsible=icon]:hidden',
        badgeStyles[type],
      )}
    >
      {count}
    </span>
  );
};

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
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              tooltip="Triago"
              className="group-data-[collapsible=icon]:p-0! hover:bg-sidebar-accent/50 cursor-pointer"
            >
              <Link to="/project" className="flex items-center gap-2">
                <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold tracking-tight text-foreground">
                    Triago
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive} tooltip={item.title}>
                    <a href={item.url} className="flex min-w-0 items-center gap-2">
                      <item.icon className="size-4 shrink-0" />
                      <span className="truncate">{item.title}</span>
                      {item.badge !== null && <NavBadge count={item.badge} type={item.badgeType} />}
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
            <SidebarMenuButton
              onClick={toggleSidebar}
              tooltip={state === 'collapsed' ? 'Rozwiń pasek boczny' : 'Zwiń pasek boczny'}
              className="text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {state === 'collapsed' ? (
                <PanelLeftOpen className="size-4 shrink-0" />
              ) : (
                <PanelLeftClose className="size-4 shrink-0" />
              )}
              <span className="truncate group-data-[collapsible=icon]:hidden">
                {state === 'collapsed' ? 'Rozwiń pasek boczny' : 'Zwiń pasek boczny'}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
