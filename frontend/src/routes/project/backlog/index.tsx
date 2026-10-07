import { createFileRoute } from '@tanstack/react-router';
import { BacklogView } from '#/features/tickets/components/backlog-view';
import { useProjectSearch } from '#/features/project/components/project-view';
import type { MockData } from '#/types/tickets';
import mockData from '#/data/mock-tickets.json';

const data = mockData as MockData;

export const Route = createFileRoute('/project/backlog/')({
  component: BacklogPage,
});

function BacklogPage() {
  const search = useProjectSearch();

  return <BacklogView tickets={data.tickets} sprints={data.sprints} externalSearch={search} />;
}
