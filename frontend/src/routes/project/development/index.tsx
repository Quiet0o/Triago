import { createFileRoute } from '@tanstack/react-router';
import { PlaceholderTab } from '#/features/project/components/placeholder-tab';

export const Route = createFileRoute('/project/development/')({
  component: DevelopmentPage,
});

function DevelopmentPage() {
  return <PlaceholderTab tabId="development" />;
}
