import { createFileRoute } from '@tanstack/react-router';
import { PlaceholderTab } from '#/features/project/components/placeholder-tab';

export const Route = createFileRoute('/project/documents/')({
  component: DocumentsPage,
});

function DocumentsPage() {
  return <PlaceholderTab tabId="documents" />;
}
