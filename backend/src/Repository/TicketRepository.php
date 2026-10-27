<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Ticket;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Ticket>
 */
class TicketRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Ticket::class);
    }

    /**
     * @return list<Ticket>
     */
    public function findByFilters(
        ?string $status = null,
        ?string $priority = null,
        ?string $sprint = null,
        ?string $search = null,
    ): array {
        $qb = $this->createQueryBuilder('t')
            ->leftJoin('t.assignee', 'a')
            ->addSelect('a')
            ->leftJoin('t.reporter', 'r')
            ->addSelect('r')
            ->leftJoin('t.sprint', 's')
            ->addSelect('s')
            ->leftJoin('t.subtasks', 'sub')
            ->addSelect('sub')
            ->leftJoin('t.comments', 'c')
            ->addSelect('c')
            ->orderBy('t.rank', 'ASC')
            ->addOrderBy('t.createdAt', 'DESC');

        if ($status && 'all' !== $status) {
            $qb->andWhere('t.status = :status')
                ->setParameter('status', $status);
        }

        if ($priority && 'all' !== $priority) {
            $qb->andWhere('t.priority = :priority')
                ->setParameter('priority', $priority);
        }

        if ($sprint && 'all' !== $sprint) {
            $qb->andWhere('s.id = :sprint')
                ->setParameter('sprint', $sprint);
        }

        if ($search && '' !== trim($search)) {
            $term = '%'.mb_strtolower(trim($search)).'%';
            $qb->andWhere('LOWER(t.id) LIKE :term OR LOWER(t.title) LIKE :term OR LOWER(t.description) LIKE :term')
                ->setParameter('term', $term);
        }

        /** @var list<Ticket> $result */
        $result = $qb->getQuery()->getResult();

        return $result;
    }

    public function findWithDetails(string $id): ?Ticket
    {
        /** @var Ticket|null $ticket */
        $ticket = $this->createQueryBuilder('t')
            ->leftJoin('t.assignee', 'a')
            ->addSelect('a')
            ->leftJoin('t.reporter', 'r')
            ->addSelect('r')
            ->leftJoin('t.sprint', 's')
            ->addSelect('s')
            ->leftJoin('t.subtasks', 'sub')
            ->addSelect('sub')
            ->leftJoin('t.comments', 'c')
            ->addSelect('c')
            ->leftJoin('t.activityEvents', 'ae')
            ->addSelect('ae')
            ->where('t.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();

        return $ticket;
    }

    public function generateNextTicketId(string $prefix = 'TRG'): string
    {
        // Find highest existing ID starting with prefix
        $tickets = $this->createQueryBuilder('t')
            ->select('t.id')
            ->where('t.id LIKE :prefix')
            ->setParameter('prefix', $prefix.'-%')
            ->getQuery()
            ->getSingleColumnResult();

        $maxNumber = 0;
        foreach ($tickets as $id) {
            if (preg_match('/^'.preg_quote($prefix, '/').'-(\d+)$/', (string) $id, $matches)) {
                $num = (int) $matches[1];
                if ($num > $maxNumber) {
                    $maxNumber = $num;
                }
            }
        }

        return sprintf('%s-%d', $prefix, $maxNumber + 1);
    }
}
