import { createFileRoute } from '@tanstack/react-router';
import { BacklogView } from '#/features/tickets/components/backlog-view';
import { useProjectSearch } from '#/features/project/components/project-view';

export const Route = createFileRoute('/project/backlog/')({
  component: BacklogPage,
});

function BacklogPage() {
  const search = useProjectSearch();

  return <BacklogView externalSearch={search} />;
}
