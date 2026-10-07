import { createFileRoute } from '@tanstack/react-router';
import { PlaceholderTab } from '#/features/project/components/placeholder-tab';

export const Route = createFileRoute('/project/summary/')({
  component: SummaryPage,
});

function SummaryPage() {
  return <PlaceholderTab tabId="summary" />;
}
