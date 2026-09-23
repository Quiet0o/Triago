import { Bell, Search } from "lucide-react"

import { Separator } from "#/components/ui/separator.tsx"
import { SidebarTrigger } from "#/components/ui/sidebar.tsx"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "#/components/ui/breadcrumb.tsx"
import { Button } from "#/components/ui/button.tsx"
import { Input } from "#/components/ui/input.tsx"

export function SiteHeader({
  searchQuery,
  onSearchChange,
}: {
  searchQuery?: string
  onSearchChange?: (val: string) => void
}) {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b bg-background/95 px-4 backdrop-blur-sm transition-[width,height] ease-linear lg:px-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-1 h-4 sm:mx-2"
        />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Triago</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Pulpit</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Transakcje</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-48 sm:w-64 md:w-80">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Szukaj..."
            value={searchQuery ?? ""}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="h-9 w-full bg-muted/40 pl-8 pr-3 text-sm focus-visible:bg-background"
          />
        </div>

        <Button
          variant="outline"
          size="icon"
          className="relative size-9 shrink-0"
          aria-label="Powiadomienia"
        >
          <Bell className="size-4" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-emerald-500 ring-2 ring-background" />
        </Button>
      </div>
    </header>
  )
}
