import { createFileRoute } from '@tanstack/react-router';
import { BacklogView } from '#/components/dashboard/views/project/backlog-view';
import { useProjectSearch } from '#/components/dashboard/views/project/project-view';
import type { MockData } from '#/components/dashboard/tickets/types';
import mockData from '#/components/dashboard/data/mock-tickets.json';

const data = mockData as MockData;

export const Route = createFileRoute('/project/backlog/')({
  component: BacklogPage,
});

function BacklogPage() {
  const search = useProjectSearch();

  return (
    <BacklogView
      tickets={data.tickets}
      sprints={data.sprints}
      externalSearch={search}
    />
  );
}
