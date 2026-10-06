import { createFileRoute } from '@tanstack/react-router';
import { PlaceholderTab } from '#/components/dashboard/views/project/placeholder-tab';

export const Route = createFileRoute('/project/documents/')({
  component: DocumentsPage,
});

function DocumentsPage() {
  return <PlaceholderTab tabId="documents" />;
}
