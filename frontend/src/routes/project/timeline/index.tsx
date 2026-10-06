import { createFileRoute } from '@tanstack/react-router';
import { PlaceholderTab } from '#/components/dashboard/views/project/placeholder-tab';

export const Route = createFileRoute('/project/timeline/')({
  component: TimelinePage,
});

function TimelinePage() {
  return <PlaceholderTab tabId="timeline" />;
}
