import { createFileRoute } from '@tanstack/react-router';
import { Pattern } from '#/components/dashboard/views/project/kanban/kanban';

export const Route = createFileRoute('/project/board/')({
  component: BoardPage,
});

function BoardPage() {
  return <Pattern />;
}
