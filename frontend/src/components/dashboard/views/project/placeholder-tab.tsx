'use client';

import {
  LayoutGrid,
  Columns3,
  Code2,
  Clock,
  FileText,
  ClipboardList,
} from 'lucide-react';

const placeholderContent: Record<string, { icon: typeof LayoutGrid; description: string }> = {
  podsumowanie: {
    icon: LayoutGrid,
    description: 'Przegląd projektu — statystyki, wykresy velocity, burndown chart i podsumowanie sprintu.',
  },
  tablica: {
    icon: Columns3,
    description: 'Widok Kanban — przeciągnij i upuść zgłoszenia między kolumnami statusów.',
  },
  programowanie: {
    icon: Code2,
    description: 'Integracja z repozytorium — commity, pull requesty i branche powiązane ze zgłoszeniami.',
  },
  'oś czasu': {
    icon: Clock,
    description: 'Widok Gantt — oś czasu z terminami, zależnościami i postępem prac.',
  },
  dokumenty: {
    icon: FileText,
    description: 'Baza wiedzy — dokumentacja, procedury i FAQ powiązane z projektem.',
  },
  formularze: {
    icon: ClipboardList,
    description: 'Konfiguracja formularzy zgłoszeniowych — pola, walidacja, szablony.',
  },
};

export const PlaceholderTab = ({ tabId }: { tabId: string }) =>  {
  const config = placeholderContent[tabId];

  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-muted-foreground/15 bg-muted/10 py-20 px-8">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted shadow-sm ring-1 ring-border">
        <Icon className="size-7 text-muted-foreground" />
      </div>
      <div className="text-center max-w-md">
        <h3 className="text-sm font-semibold text-foreground capitalize">
          {tabId}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
          {config.description}
        </p>
        <p className="mt-3 text-xs text-muted-foreground/60">
          Wkrótce dostępne
        </p>
      </div>
    </div>
  );
}
