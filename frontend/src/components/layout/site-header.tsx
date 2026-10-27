import { Bell, Plus, Search, Settings } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';

import { Button } from '#/components/ui/button.tsx';
import { Input } from '#/components/ui/input.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu.tsx';
import { useAuth } from '#/features/auth/queries';
import { useCreateTicketModal } from '#/features/tickets/context/create-ticket-context';
import { useUserAvatar } from '#/lib/avatar';

export const SiteHeader = ({
  searchQuery,
  onSearchChange,
}: {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}) => {
  const { user, logout } = useAuth();
  const { openCreateModal } = useCreateTicketModal();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    await navigate({ to: '/auth/login' });
  };

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email
      ? user.email.slice(0, 2).toUpperCase()
      : 'U';

  const avatarUrl = useUserAvatar(user);

  return (
    <header className="sticky top-0 z-10 grid h-16 grid-cols-[1fr_auto_1fr] items-center border-b bg-background/95 px-4 backdrop-blur-sm transition-[width,height] ease-linear lg:px-6">
      <div className="col-start-2 flex items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            value={searchQuery ?? ''}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="h-9 w-[min(50vw,28rem)] bg-muted/40 pl-9 pr-4 text-sm focus-visible:bg-background"
          />
        </div>
        <Button onClick={() => openCreateModal()} className="cursor-pointer">
          <Plus className="size-4" />
          Create
        </Button>
      </div>

      <div className="col-start-3 flex items-center justify-end gap-2 px-2">
        <Button
          variant="outline"
          size="icon"
          className="relative size-9 shrink-0"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-emerald-500 ring-2 ring-background" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="relative size-9 shrink-0"
              aria-label="Settings"
            >
              <Settings className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem>Global settings</DropdownMenuItem>
              <DropdownMenuItem>Notifications settings</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
            >
              <Avatar className="size-8">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={user?.fullName ?? ''} />}
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <div className="flex items-center gap-2.5 p-2">
              <Avatar className="size-9 shrink-0">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={user?.fullName ?? ''} />}
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-0.5 min-w-0">
                <p className="text-sm font-semibold leading-none truncate text-foreground">
                  {user?.fullName ?? 'Użytkownik'}
                </p>
                <p className="text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/project/profile" className="cursor-pointer w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
