'use client';

import * as React from 'react';
import {
  LayoutDashboard,
  CreditCard,
  Users,
  ShoppingBag,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
  Sparkles,
  ChevronsUpDown,
  LogOut,
  User,
  Bell,
  Command,
  PanelLeftOpen,
  PanelLeftClose,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, toggleSidebar } = useSidebar();

  const mainNavItems = [
    {
      title: m['navbar.recent'](),
      url: '#',
      icon: LayoutDashboard,
      badge: null,
      isActive: false,
    },
    {
      title: m['navbar.favorites'](),
      url: '#',
      icon: Sparkles,
      badge: null,
      isActive: false,
    },
    {
      title: m['navbar.teams'](),
      url: '#',
      icon: Users,
      badge: null,
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
              {state === 'collapsed' ? 'Rozwiń panel boczny' : 'Zwiń panel boczny'}
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
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
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
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
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
                  <Avatar className="size-8 rounded-lg">
                    <AvatarImage src="" alt="Jan Kowalski" />
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-medium">
                      JK
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Jan Kowalski</span>
                    <span className="truncate text-xs text-muted-foreground">
                      jan.kowalski@triago.pl
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
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
