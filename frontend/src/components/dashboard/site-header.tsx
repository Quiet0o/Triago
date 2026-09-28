import { Bell, Plus, Search, Settings } from 'lucide-react';

import { Button } from '#/components/ui/button.tsx';
import { Input } from '#/components/ui/input.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function SiteHeader({
  searchQuery,
  onSearchChange,
}: {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}) {
  return (
    <header className="sticky top-0 z-10 grid h-16 grid-cols-[1fr_auto_1fr] items-center border-b bg-background/95 px-4 backdrop-blur-sm transition-[width,height] ease-linear lg:px-6">
      <div className="col-start-2 flex items-center gap-2">
        <Input
          type="search"
          placeholder="Search..."
          value={searchQuery ?? ''}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="h-9 w-[min(50vw,28rem)] bg-muted/40 pr-9 pl-4 text-sm focus-visible:bg-background"
        />
        <Search className="pointer-events-none -ml-7 mr-3 size-4 shrink-0 text-muted-foreground" />
        <Button>
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
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-32" align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
