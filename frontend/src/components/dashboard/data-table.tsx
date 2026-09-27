'use client';

import * as React from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Download,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  XCircle,
} from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table.tsx';
import { Button } from '#/components/ui/button.tsx';
import { Input } from '#/components/ui/input.tsx';
import { Badge } from '#/components/ui/badge.tsx';
import { Checkbox } from '#/components/ui/checkbox.tsx';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu.tsx';
import { Avatar, AvatarFallback } from '#/components/ui/avatar.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card.tsx';

export type TransactionStatus = 'paid' | 'pending' | 'refunded' | 'failed';

export type Transaction = {
  id: string;
  customer: {
    name: string;
    email: string;
    avatarFallback: string;
  };
  type: 'Subskrypcja' | 'Jednorazowy' | 'Licencja B2B';
  status: TransactionStatus;
  method: string;
  date: string;
  amount: number;
  currency: string;
};

export const initialTransactions: Transaction[] = [
  {
    id: 'TRX-9481',
    customer: {
      name: 'Aleksandra Nowak',
      email: 'a.nowak@technova.pl',
      avatarFallback: 'AN',
    },
    type: 'Licencja B2B',
    status: 'paid',
    method: 'Przelew P24',
    date: '2026-09-23 20:45',
    amount: 3499.0,
    currency: 'PLN',
  },
  {
    id: 'TRX-9480',
    customer: {
      name: 'Mateusz Wiśniewski',
      email: 'm.wisniewski@gmail.com',
      avatarFallback: 'MW',
    },
    type: 'Subskrypcja',
    status: 'paid',
    method: 'Visa •••• 4242',
    date: '2026-09-23 19:12',
    amount: 149.0,
    currency: 'PLN',
  },
  {
    id: 'TRX-9479',
    customer: {
      name: 'Karolina Dąbrowska',
      email: 'karolina@dabrowska-studio.com',
      avatarFallback: 'KD',
    },
    type: 'Jednorazowy',
    status: 'pending',
    method: 'BLIK',
    date: '2026-09-23 18:30',
    amount: 620.0,
    currency: 'PLN',
  },
  {
    id: 'TRX-9478',
    customer: {
      name: 'Piotr Lewandowski',
      email: 'piotr.lewandowski@apexcorp.pl',
      avatarFallback: 'PL',
    },
    type: 'Licencja B2B',
    status: 'paid',
    method: 'Mastercard •••• 8812',
    date: '2026-09-23 16:55',
    amount: 8900.0,
    currency: 'PLN',
  },
  {
    id: 'TRX-9477',
    customer: {
      name: 'Ewa Kamińska',
      email: 'ewa.k@onet.pl',
      avatarFallback: 'EK',
    },
    type: 'Subskrypcja',
    status: 'refunded',
    method: 'Visa •••• 1092',
    date: '2026-09-22 14:20',
    amount: -149.0,
    currency: 'PLN',
  },
  {
    id: 'TRX-9476',
    customer: {
      name: 'Tomasz Zieliński',
      email: 'tomasz@zielinskigroup.eu',
      avatarFallback: 'TZ',
    },
    type: 'Jednorazowy',
    status: 'failed',
    method: 'Mastercard •••• 5531',
    date: '2026-09-22 11:05',
    amount: 1250.0,
    currency: 'PLN',
  },
  {
    id: 'TRX-9475',
    customer: {
      name: 'Monika Szymańska',
      email: 'm.szymanska@vortex.io',
      avatarFallback: 'MS',
    },
    type: 'Licencja B2B',
    status: 'paid',
    method: 'Przelew SEPA',
    date: '2026-09-22 09:40',
    amount: 4500.0,
    currency: 'PLN',
  },
  {
    id: 'TRX-9474',
    customer: {
      name: 'Krzysztof Kozłowski',
      email: 'krzysztof.k@wp.pl',
      avatarFallback: 'KK',
    },
    type: 'Subskrypcja',
    status: 'paid',
    method: 'BLIK',
    date: '2026-09-21 21:18',
    amount: 89.0,
    currency: 'PLN',
  },
  {
    id: 'TRX-9473',
    customer: {
      name: 'Magdalena Wójcik',
      email: 'magda.wojcik@designlab.pl',
      avatarFallback: 'MW',
    },
    type: 'Jednorazowy',
    status: 'paid',
    method: 'Visa •••• 9923',
    date: '2026-09-21 17:50',
    amount: 490.0,
    currency: 'PLN',
  },
  {
    id: 'TRX-9472',
    customer: {
      name: 'Jakub Jankowski',
      email: 'jakub@jankowski-it.com',
      avatarFallback: 'JJ',
    },
    type: 'Licencja B2B',
    status: 'pending',
    method: 'Przelew tradycyjny',
    date: '2026-09-21 13:10',
    amount: 2800.0,
    currency: 'PLN',
  },
  {
    id: 'TRX-9471',
    customer: {
      name: 'Zofia Mazur',
      email: 'zofia.mazur@outlook.com',
      avatarFallback: 'ZM',
    },
    type: 'Subskrypcja',
    status: 'paid',
    method: 'Mastercard •••• 4114',
    date: '2026-09-20 18:22',
    amount: 149.0,
    currency: 'PLN',
  },
  {
    id: 'TRX-9470',
    customer: {
      name: 'Rafał Krawczyk',
      email: 'rafal.krawczyk@krawczyk-logistyka.pl',
      avatarFallback: 'RK',
    },
    type: 'Licencja B2B',
    status: 'paid',
    method: 'Przelew P24',
    date: '2026-09-20 10:15',
    amount: 5200.0,
    currency: 'PLN',
  },
];

function renderStatusBadge(status: TransactionStatus) {
  switch (status) {
    case 'paid':
      return (
        <Badge
          variant="outline"
          className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        >
          <CheckCircle2 className="mr-1 size-3" />
          Opłacono
        </Badge>
      );
    case 'pending':
      return (
        <Badge
          variant="outline"
          className="border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
        >
          <Clock className="mr-1 size-3" />
          Oczekuje
        </Badge>
      );
    case 'refunded':
      return (
        <Badge
          variant="outline"
          className="border-slate-500/20 bg-slate-500/10 text-slate-600 dark:text-slate-400"
        >
          <RotateCcw className="mr-1 size-3" />
          Zwrócono
        </Badge>
      );
    case 'failed':
      return (
        <Badge
          variant="outline"
          className="border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400"
        >
          <XCircle className="mr-1 size-3" />
          Błąd
        </Badge>
      );
  }
}

type SortField = 'customer' | 'date' | 'amount';

export function DataTable({
  externalSearch = '',
}: {
  externalSearch?: string;
}) {
  const [data] = React.useState<Transaction[]>(() => initialTransactions);
  const [sortField, setSortField] = React.useState<SortField | null>('date');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [internalSearch, setInternalSearch] = React.useState<string>('');
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = React.useState<
    Record<string, boolean>
  >({
    id: true,
    customer: true,
    type: true,
    status: true,
    method: true,
    date: true,
    amount: true,
  });
  const [page, setPage] = React.useState<number>(1);
  const pageSize = 8;

  const activeSearch = externalSearch || internalSearch;

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else {
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedData = React.useMemo(() => {
    let result = [...data];

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((item) => item.status === statusFilter);
    }

    // Search filter
    if (activeSearch.trim()) {
      const q = activeSearch.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.id.toLowerCase().includes(q) ||
          item.customer.name.toLowerCase().includes(q) ||
          item.customer.email.toLowerCase().includes(q) ||
          item.method.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortField) {
      result.sort((a, b) => {
        let valA: string | number = '';
        let valB: string | number = '';

        if (sortField === 'customer') {
          valA = a.customer.name;
          valB = b.customer.name;
        } else if (sortField === 'date') {
          valA = a.date;
          valB = b.date;
        } else {
          valA = a.amount;
          valB = b.amount;
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, statusFilter, activeSearch, sortField, sortOrder]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedData.length / pageSize)
  );
  const paginatedData = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredAndSortedData.slice(start, start + pageSize);
  }, [filteredAndSortedData, page, pageSize]);

  // Select all handler
  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item) => selectedIds.has(item.id));

  const toggleSelectAll = () => {
    const next = new Set(selectedIds);
    if (isAllSelected) {
      paginatedData.forEach((item) => next.delete(item.id));
    } else {
      paginatedData.forEach((item) => next.add(item.id));
    }
    setSelectedIds(next);
  };

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Klient',
      'Email',
      'Typ',
      'Status',
      'Metoda',
      'Data',
      'Kwota',
    ];
    const rows = filteredAndSortedData.map((trx) => [
      trx.id,
      `"${trx.customer.name}"`,
      `"${trx.customer.email}"`,
      `"${trx.type}"`,
      trx.status,
      `"${trx.method}"`,
      `"${trx.date}"`,
      `${trx.amount} ${trx.currency}`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `transakcje_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 size-3 text-muted-foreground" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="ml-1 size-3 text-foreground" />
    ) : (
      <ArrowDown className="ml-1 size-3 text-foreground" />
    );
  };

  return (
    <Card className="rounded-xl border shadow-sm">
      <CardHeader className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-xl font-bold tracking-tight">
            Transakcje
          </CardTitle>
          <CardDescription className="text-sm">
            Przeglądaj historię transakcji, płatności i zamówień w Twojej
            aplikacji.
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={handleExportCSV}
          >
            <Download className="size-3.5" />
            Eksportuj CSV
          </Button>
          <Button size="sm" className="gap-1.5 text-xs">
            <Plus className="size-3.5" />
            Nowa operacja
          </Button>
        </div>
      </CardHeader>

      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b bg-muted/20">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { label: 'Wszystkie', value: 'all', count: data.length },
            {
              label: 'Opłacone',
              value: 'paid',
              count: data.filter((d) => d.status === 'paid').length,
            },
            {
              label: 'W toku',
              value: 'pending',
              count: data.filter((d) => d.status === 'pending').length,
            },
            {
              label: 'Zwrócone',
              value: 'refunded',
              count: data.filter((d) => d.status === 'refunded').length,
            },
            {
              label: 'Błędy',
              value: 'failed',
              count: data.filter((d) => d.status === 'failed').length,
            },
          ].map((tab) => (
            <Button
              key={tab.value}
              variant={statusFilter === tab.value ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => {
                setStatusFilter(tab.value);
                setPage(1);
              }}
              className={`h-8 rounded-lg px-3 text-xs transition-colors ${
                statusFilter === tab.value
                  ? 'bg-background font-medium shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
              <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.2 text-[10px] font-mono text-muted-foreground">
                {tab.count}
              </span>
            </Button>
          ))}
        </div>

        {/* Filter input & column toggle */}
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filtruj tabelę..."
              value={internalSearch}
              onChange={(e) => {
                setInternalSearch(e.target.value);
                setPage(1);
              }}
              className="h-8 pl-8 text-xs bg-background"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs"
              >
                <SlidersHorizontal className="size-3.5" />
                Kolumny
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {[
                { id: 'id', label: 'ID' },
                { id: 'customer', label: 'Klient' },
                { id: 'type', label: 'Typ' },
                { id: 'status', label: 'Status' },
                { id: 'method', label: 'Płatność' },
                { id: 'date', label: 'Data' },
                { id: 'amount', label: 'Kwota' },
              ].map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  className="text-xs"
                  checked={visibleColumns[col.id]}
                  onCheckedChange={(checked) =>
                    setVisibleColumns((prev) => ({
                      ...prev,
                      [col.id]: !!checked,
                    }))
                  }
                >
                  {col.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 px-4">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Zaznacz wszystko"
                />
              </TableHead>
              {visibleColumns.id && (
                <TableHead className="w-24 text-xs">ID</TableHead>
              )}
              {visibleColumns.customer && (
                <TableHead className="text-xs">
                  <Button
                    variant="ghost"
                    className="-ml-3 h-8 text-xs font-medium"
                    onClick={() => toggleSort('customer')}
                  >
                    Klient
                    {renderSortIcon('customer')}
                  </Button>
                </TableHead>
              )}
              {visibleColumns.type && (
                <TableHead className="w-32 text-xs">Typ</TableHead>
              )}
              {visibleColumns.status && (
                <TableHead className="w-32 text-xs">Status</TableHead>
              )}
              {visibleColumns.method && (
                <TableHead className="text-xs">Płatność</TableHead>
              )}
              {visibleColumns.date && (
                <TableHead className="text-xs">
                  <Button
                    variant="ghost"
                    className="-ml-3 h-8 text-xs font-medium"
                    onClick={() => toggleSort('date')}
                  >
                    Data
                    {renderSortIcon('date')}
                  </Button>
                </TableHead>
              )}
              {visibleColumns.amount && (
                <TableHead className="text-right text-xs">
                  <Button
                    variant="ghost"
                    className="-mr-3 h-8 text-xs font-medium"
                    onClick={() => toggleSort('amount')}
                  >
                    Kwota
                    {renderSortIcon('amount')}
                  </Button>
                </TableHead>
              )}
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length ? (
              paginatedData.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={selectedIds.has(row.id) && 'selected'}
                  className="transition-colors hover:bg-muted/40"
                >
                  <TableCell className="px-4">
                    <Checkbox
                      checked={selectedIds.has(row.id)}
                      onCheckedChange={() => toggleSelectRow(row.id)}
                      aria-label={`Zaznacz ${row.id}`}
                    />
                  </TableCell>
                  {visibleColumns.id && (
                    <TableCell className="font-mono text-xs font-semibold text-muted-foreground">
                      {row.id}
                    </TableCell>
                  )}
                  {visibleColumns.customer && (
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-8 rounded-full border">
                          <AvatarFallback className="text-xs font-semibold bg-muted text-foreground">
                            {row.customer.avatarFallback}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {row.customer.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {row.customer.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.type && (
                    <TableCell className="text-xs text-muted-foreground">
                      {row.type}
                    </TableCell>
                  )}
                  {visibleColumns.status && (
                    <TableCell>{renderStatusBadge(row.status)}</TableCell>
                  )}
                  {visibleColumns.method && (
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CreditCard className="size-3 text-muted-foreground" />
                        <span>{row.method}</span>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.date && (
                    <TableCell className="text-xs tabular-nums text-muted-foreground">
                      {row.date}
                    </TableCell>
                  )}
                  {visibleColumns.amount && (
                    <TableCell className="text-right font-medium tabular-nums">
                      <span
                        className={
                          row.amount < 0
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-foreground font-semibold'
                        }
                      >
                        {row.amount > 0 ? '+' : ''}
                        {new Intl.NumberFormat('pl-PL', {
                          style: 'currency',
                          currency: row.currency,
                        }).format(row.amount)}
                      </span>
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="size-8 p-0">
                          <span className="sr-only">Otwórz menu</span>
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>
                          Akcje dla {row.id}
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => navigator.clipboard.writeText(row.id)}
                        >
                          Kopiuj ID transakcji
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          Pokaż szczegóły klienta
                        </DropdownMenuItem>
                        <DropdownMenuItem>Pobierz fakturę VAT</DropdownMenuItem>
                        <DropdownMenuItem>
                          Wyślij potwierdzenie
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          Zwróć płatność
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  Nie znaleziono transakcji odpowiadających kryteriom.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          {selectedIds.size > 0 ? (
            <span>
              Zaznaczono {selectedIds.size} z {filteredAndSortedData.length}{' '}
              wierszy
            </span>
          ) : (
            <span>Łącznie: {filteredAndSortedData.length} pozycji</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span>
            Strona {page} z {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              <ChevronLeft className="size-4" />
              <span className="sr-only">Poprzednia strona</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              <ChevronRight className="size-4" />
              <span className="sr-only">Następna strona</span>
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
