import { createFileRoute } from '@tanstack/react-router';
import { TicketDetailView } from '#/features/tickets/components/ticket-detail-view';

export const Route = createFileRoute('/project/tickets/$ticketId')({
  component: TicketDetailPage,
});

function TicketDetailPage() {
  const { ticketId } = Route.useParams();
  return <TicketDetailView ticketId={ticketId} />;
}
