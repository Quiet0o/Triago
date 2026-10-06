import { ChevronUp } from 'lucide-react';

export const CriticalIcon = ({
  className = 'h-4 w-4',
}: {
  className?: string;
}) => (
  <div className={`relative inline-flex shrink-0 overflow-hidden ${className}`}>
    <ChevronUp className="absolute inset-0 size-full -translate-y-1/4" />
    <ChevronUp className="absolute inset-0 size-full" />
    <ChevronUp className="absolute inset-0 size-full translate-y-1/4" />
  </div>
);
