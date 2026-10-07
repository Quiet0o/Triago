import { createFileRoute } from '@tanstack/react-router';
import { ProjectKanbanBoard } from '#/features/tickets/components/kanban/kanban';

export const Route = createFileRoute('/project/board/')({
  component: BoardPage,
});

function BoardPage() {
  return <ProjectKanbanBoard />;
}
