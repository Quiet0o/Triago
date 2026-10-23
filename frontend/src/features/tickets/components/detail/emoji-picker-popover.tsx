'use client';

import * as React from 'react';
import { Search, SmilePlus, X } from 'lucide-react';
import { Input } from '#/components/ui/input.tsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover.tsx';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip.tsx';

export interface EmojiItem {
  emoji: string;
  name: string;
  tags: string;
}

export const COMMON_EMOJIS: string[] = ['👍', '❤️', '🎉', '🚀', '👀', '🔥'];

export const ALL_EMOJIS: EmojiItem[] = [
  // Najpopularniejsze reakcje
  { emoji: '👍', name: 'Kciuk w górę', tags: 'plus like tak super polecam zgoda okej' },
  { emoji: '👎', name: 'Kciuk w dół', tags: 'minus dislike nie słabe przeciw' },
  { emoji: '❤️', name: 'Serce', tags: 'love miłość super dzięki wdzięczność' },
  { emoji: '🔥', name: 'Ogień', tags: 'fire gorące sztos hit mega czad' },
  { emoji: '🎉', name: 'Tada / Konfetti', tags: 'impreza świętowanie sukces gratulacje brawo' },
  { emoji: '🚀', name: 'Rakieta', tags: 'rocket deploy szybko w górę launch start' },
  { emoji: '👀', name: 'Oczy', tags: 'sprawdzam patrzę review zerkam badam' },
  { emoji: '💡', name: 'Żarówka', tags: 'pomysł idea rozwiązanie koncepcja myśl' },
  { emoji: '✨', name: 'Błysk', tags: 'nowość świeże magia ulepszenie czysto' },

  // Zadania & status
  { emoji: '✅', name: 'Zrobione / Ptaszek', tags: 'check gotowe tak sukces zaakceptowane' },
  { emoji: '❌', name: 'Krzyżyk', tags: 'błąd anulowane odrzucone stop brak' },
  { emoji: '⚠️', name: 'Ostrzeżenie', tags: 'warning uwaga problem ostrożnie alert' },
  { emoji: '🐛', name: 'Pluskwa / Bug', tags: 'błąd bug defekt usterka awaria' },
  { emoji: '⚡', name: 'Błyskawica', tags: 'szybko express moc speed energia' },
  { emoji: '🔒', name: 'Kłódka', tags: 'bezpieczeństwo blokada prywatne lock secure' },
  { emoji: '📌', name: 'Pinezka', tags: 'przypięte ważne pin notatka istotne' },
  { emoji: '🎯', name: 'Cel', tags: 'trafiony w dziesiątkę cel target zadanie' },
  { emoji: '💯', name: 'Sto procent', tags: 'sto punktów idealnie perfekcja max' },

  // Emocje & twarze
  { emoji: '😄', name: 'Uśmiech', tags: 'radość wesoły zadowolony haha' },
  { emoji: '😂', name: 'Płacz ze śmiechu', tags: 'śmiech lol beka haha rotfl' },
  { emoji: '🥳', name: 'Świętowanie', tags: 'impreza radość party urodziny' },
  { emoji: '🤔', name: 'Zastanowienie', tags: 'myślenie hm ciekawe pomyślmy pytanie' },
  { emoji: '🫡', name: 'Salut', tags: 'szacunek tak jest rozkaz zrobione przyjęte' },
  { emoji: '😎', name: 'Okulary / Cool', tags: 'luz kozak cool szpan mistrz' },
  { emoji: '🤩', name: 'Gwiazdy w oczach', tags: 'wow zachwyt niesamowite super' },
  { emoji: '😅', name: 'Uff / Ulga', tags: 'pot ulga stresik prawie' },
  { emoji: '🙌', name: 'Dłonie w górze', tags: 'hura radość dzięki wspaniale' },
  { emoji: '👏', name: 'Brawa', tags: 'oklaski brawo super robota gratki' },
  { emoji: '💪', name: 'Siła / Biceps', tags: 'damy radę moc team determinacja' },

  // Praca & Styl życia
  { emoji: '💻', name: 'Laptop / Kod', tags: 'komputer praca programowanie kod dev' },
  { emoji: '☕', name: 'Kawa', tags: 'kawa przerwa coffee chill odpoczynek' },
  { emoji: '🕒', name: 'Zegar / Czas', tags: 'czas deadline wkrótce czekam timer' },
];

export interface EmojiPickerPopoverProps {
  onSelectEmoji: (emoji: string) => void;
  variant?: 'badge' | 'icon';
  hasReactions?: boolean;
}

export function EmojiPickerPopover({
  onSelectEmoji,
  variant = 'badge',
  hasReactions = false,
}: EmojiPickerPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [hoveredEmoji, setHoveredEmoji] = React.useState<EmojiItem | null>(null);

  const filteredEmojis = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ALL_EMOJIS;
    return ALL_EMOJIS.filter(
      (e) =>
        e.emoji.includes(q) ||
        e.name.toLowerCase().includes(q) ||
        e.tags.toLowerCase().includes(q),
    );
  }, [search]);

  const handleSelect = (emoji: string) => {
    onSelectEmoji(emoji);
    setOpen(false);
    setSearch('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            {variant === 'icon' ? (
              <button
                type="button"
                className="size-6 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                aria-label="Dodaj reakcję"
              >
                <SmilePlus className="size-3.5" />
              </button>
            ) : hasReactions ? (
              <button
                type="button"
                className="flex items-center justify-center size-6 rounded-full border border-dashed border-border text-muted-foreground hover:border-primary/50 hover:bg-muted/60 hover:text-foreground transition-all cursor-pointer"
                aria-label="Dodaj reakcję"
              >
                <SmilePlus className="size-3" />
              </button>
            ) : (
              <button
                type="button"
                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-full px-2 py-0.5 border border-transparent hover:border-border transition-all cursor-pointer opacity-70 group-hover:opacity-100"
                aria-label="Dodaj reakcję"
              >
                <SmilePlus className="size-3" />
                <span className="text-[10px]">Reakcja</span>
              </button>
            )}
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent className="text-[10px] py-0.5 px-2">Dodaj reakcję</TooltipContent>
      </Tooltip>

      <PopoverContent
        align="start"
        sideOffset={6}
        collisionPadding={12}
        className="w-72 p-2.5 space-y-2 bg-popover/95 backdrop-blur-sm border shadow-lg rounded-xl z-50 overflow-hidden"
      >
        {/* Quick select bar */}
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 px-1">
            Szybka reakcja
          </div>
          <div className="flex items-center justify-between bg-muted/40 rounded-lg p-1">
            {COMMON_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleSelect(emoji)}
                className="flex size-7 items-center justify-center rounded-md text-base hover:bg-background active:bg-background/80 transition-colors cursor-pointer select-none"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Szukaj emotki (np. tak, bug, ogień)..."
            className="h-7 text-xs pl-7 pr-6 rounded-md bg-muted/30 focus-visible:ring-1"
            autoFocus={open}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
            >
              <X className="size-3" />
            </button>
          )}
        </div>

        {/* Emojis Grid */}
        <div className="max-h-[195px] overflow-y-auto overflow-x-hidden p-1 space-y-1 scrollbar-thin">
          {filteredEmojis.length === 0 ? (
            <div className="text-center py-6 text-xs text-muted-foreground">
              Nie znaleziono pasującej emotki.
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {filteredEmojis.map((item) => (
                <button
                  key={item.emoji}
                  type="button"
                  onMouseEnter={() => setHoveredEmoji(item)}
                  onMouseLeave={() => setHoveredEmoji(null)}
                  onClick={() => handleSelect(item.emoji)}
                  className="flex size-8 items-center justify-center rounded-md hover:bg-muted active:bg-muted/80 transition-colors cursor-pointer text-base select-none"
                  title={item.name}
                >
                  {item.emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer with preview */}
        <div className="border-t border-border/60 pt-2 flex items-center justify-between text-[11px] text-muted-foreground h-7 px-1 shrink-0 select-none">
          {hoveredEmoji ? (
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-base leading-none shrink-0">{hoveredEmoji.emoji}</span>
              <span className="font-medium text-foreground truncate">{hoveredEmoji.name}</span>
            </div>
          ) : (
            <span className="text-[10px] text-muted-foreground/80">Wybierz emotkę aby zareagować</span>
          )}
          <span className="text-[9px] font-mono text-muted-foreground/60 shrink-0 ml-1">{filteredEmojis.length} emotek</span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
