import { createFileRoute } from '@tanstack/react-router';
import { PlaceholderTab } from '#/features/project/components/placeholder-tab';
import Editor from '#/components/editor/examples/full/editor';

export const Route = createFileRoute('/project/documents/')({
  component: DocumentsPage,
});

function DocumentsPage() {
  return (
    <div>
      <Editor />
    </div>
  );
}
