<?php

declare(strict_types=1);

namespace App\Story;

use App\Entity\ActivityEvent;
use App\Entity\Comment;
use App\Entity\Sprint;
use App\Entity\Subtask;
use App\Entity\Ticket;
use App\Factory\UserFactory;
use Symfony\Component\Uid\Uuid;
use Zenstruck\Foundry\Attribute\AsFixture;

use function Zenstruck\Foundry\Persistence\save;

use Zenstruck\Foundry\Story;

#[AsFixture(name: 'main')]
final class AppStory extends Story
{
    public function build(): void
    {
        // 1. Team members
        $aleksandra = UserFactory::createOne([
            'email' => 'a.nowak@triago.pl',
            'fullName' => 'Aleksandra Nowak',
            'jobTitle' => 'Senior Developer',
            'password' => 'password123',
            'roles' => ['ROLE_USER'],
        ]);

        $tomasz = UserFactory::createOne([
            'email' => 't.zielinski@triago.pl',
            'fullName' => 'Tomasz Zieliński',
            'jobTitle' => 'Product Owner',
            'password' => 'password123',
            'roles' => ['ROLE_USER'],
        ]);

        $michal = UserFactory::createOne([
            'email' => 'm.kowalczyk@triago.pl',
            'fullName' => 'Michał Kowalczyk',
            'jobTitle' => 'QA Engineer',
            'password' => 'password123',
            'roles' => ['ROLE_USER'],
        ]);

        $ewa = UserFactory::createOne([
            'email' => 'e.wisniewska@triago.pl',
            'fullName' => 'Ewa Wiśniewska',
            'jobTitle' => 'UX Designer',
            'password' => 'password123',
            'roles' => ['ROLE_USER'],
        ]);

        $kamil = UserFactory::createOne([
            'email' => 'k.lewandowski@triago.pl',
            'fullName' => 'Kamil Lewandowski',
            'jobTitle' => 'Backend Dev',
            'password' => 'password123',
            'roles' => ['ROLE_USER'],
        ]);

        // 2. Sprints
        $sprint4 = new Sprint('sprint-4', 'Sprint 4 — September', 'active');
        $sprint4->setGoal('Email notifications integration and form UX improvement');
        $sprint4->setStartDate(new \DateTimeImmutable('2026-09-14'));
        $sprint4->setEndDate(new \DateTimeImmutable('2026-09-28'));

        $sprint3 = new Sprint('sprint-3', 'Sprint 3 — September', 'completed');
        $sprint3->setGoal('Reports module and analytics dashboard');
        $sprint3->setStartDate(new \DateTimeImmutable('2026-08-31'));
        $sprint3->setEndDate(new \DateTimeImmutable('2026-09-13'));

        // 3. Tickets & Epics
        $epic100 = new Ticket(
            id: 'TRG-100',
            title: 'Nowy system powiadomień i automatyzacji',
            description: 'Kompleksowy moduł powiadomień wielokanałowych (e-mail, webhooki, in-app) dla całego systemu Triago.',
            type: 'epic',
            priority: 'wysoki',
            status: 'w_toku',
            reporter: $tomasz,
        );
        $epic100->setAssignee($aleksandra);
        $epic100->setLabels(['epic', 'notifications', 'core']);

        $ticket142 = new Ticket(
            id: 'TRG-142',
            title: 'Email notifications are not sent after escalation',
            description: 'After automatic ticket escalation to L2, the system does not trigger an email notification to the assigned agent. SMTP timeout appears in logs.',
            type: 'bug',
            priority: 'krytyczny',
            status: 'w_toku',
            reporter: $tomasz,
        );
        $ticket142->setAssignee($aleksandra);
        $ticket142->setSprint($sprint4);
        $ticket142->setEpic($epic100);
        $ticket142->setStoryPoints(5);
        $ticket142->setLabels(['email', 'escalation', 'production']);
        $ticket142->setDueDate(new \DateTimeImmutable('2026-09-28'));
        $ticket142->setTimeEstimate('8h');
        $ticket142->setTimeSpent('6h 30m');
        $ticket142->setAttachmentsCount(2);

        $sub1 = new Subtask('TRG-142-1', $ticket142, 'Diagnose SMTP issue', 'zamknięty');
        $sub2 = new Subtask('TRG-142-2', $ticket142, 'Implement retry logic', 'w_toku');
        $sub3 = new Subtask('TRG-142-3', $ticket142, 'Integration tests', 'nowy');
        $ticket142->addSubtask($sub1);
        $ticket142->addSubtask($sub2);
        $ticket142->addSubtask($sub3);

        $c1 = new Comment('c1', $ticket142, $tomasz, 'Sprawdziłem logi na produkcji — timeout występuje przy próbie nawiązania połączenia TLS z serwerem pocztowym.');
        $c1->setReactions([
            ['emoji' => '👍', 'count' => 2, 'reacted' => false],
            ['emoji' => '👀', 'count' => 1, 'reacted' => true],
        ]);
        $ticket142->addComment($c1);

        $c2 = new Comment('c2', $ticket142, $aleksandra, 'Przygotowuję patch zwiększający timeout oraz dodający retry policy z exponential backoff. Do końca dnia wrzucę MR.');
        $c2->setReactions([
            ['emoji' => '🚀', 'count' => 3, 'reacted' => true],
            ['emoji' => '💪', 'count' => 2, 'reacted' => false],
        ]);
        $ticket142->addComment($c2);

        $act1 = new ActivityEvent(
            id: (string) Uuid::v7(),
            ticket: $ticket142,
            userName: 'Tomasz Zieliński',
            userAvatarFallback: 'TZ',
            action: 'utworzył(a) zadanie',
            target: 'TRG-142',
            type: 'created',
            user: $tomasz,
        );
        $act2 = new ActivityEvent(
            id: (string) Uuid::v7(),
            ticket: $ticket142,
            userName: 'Aleksandra Nowak',
            userAvatarFallback: 'AN',
            action: 'zmieniła status na',
            target: 'w_toku',
            type: 'status',
            user: $aleksandra,
        );
        $ticket142->addActivityEvent($act1);
        $ticket142->addActivityEvent($act2);

        $ticket141 = new Ticket(
            id: 'TRG-141',
            title: 'Dashboard — SLA summary view per team',
            description: 'Add a new dashboard view showing percentage SLA compliance broken down by support teams (L1, L2, L3) with a 30-day trend chart.',
            type: 'story',
            priority: 'wysoki',
            status: 'review',
            reporter: $tomasz,
        );
        $ticket141->setAssignee($michal);
        $ticket141->setSprint($sprint4);
        $ticket141->setStoryPoints(8);
        $ticket141->setLabels(['dashboard', 'sla', 'analytics']);
        $ticket141->setTimeEstimate('16h');

        $ticket140 = new Ticket(
            id: 'TRG-140',
            title: 'Optimize search index for tickets',
            description: 'Full-text search on ticket comments causes high database CPU utilization during peak hours.',
            type: 'task',
            priority: 'średni',
            status: 'nowy',
            reporter: $aleksandra,
        );
        $ticket140->setAssignee($kamil);
        $ticket140->setSprint($sprint4);
        $ticket140->setStoryPoints(3);
        $ticket140->setLabels(['performance', 'database']);
        $ticket140->setTimeEstimate('6h');

        $ticket139 = new Ticket(
            id: 'TRG-139',
            title: 'Automated test suite flaky in CI pipeline',
            description: 'End-to-end Cypress tests randomly fail with timeout on modal transition.',
            type: 'bug',
            priority: 'wysoki',
            status: 'testowanie',
            reporter: $michal,
        );
        $ticket139->setAssignee($michal);
        $ticket139->setSprint($sprint4);
        $ticket139->setStoryPoints(3);
        $ticket139->setLabels(['qa', 'ci-cd', 'cypress']);
        $ticket139->setTimeEstimate('4h');

        $ticket138 = new Ticket(
            id: 'TRG-138',
            title: 'Update design system tokens to Tailwind v4 palette',
            description: 'Harmonize CSS variables and component states across all dialogs and dropdown menus.',
            type: 'improvement',
            priority: 'niski',
            status: 'zamknięty',
            reporter: $ewa,
        );
        $ticket138->setAssignee($ewa);
        $ticket138->setSprint($sprint3);
        $ticket138->setStoryPoints(2);
        $ticket138->setLabels(['ui', 'design-system']);
        $ticket138->setTimeEstimate('5h');
        $ticket138->setTimeSpent('5h');

        $ticket145 = new Ticket(
            id: 'TRG-145',
            title: 'Kryteria akceptacji & Podzadania w widoku zgłoszenia',
            description: 'Użytkownicy potrzebują możliwości definiowania i odznaczania kryteriów akceptacji oraz podzadań, a także łączenia zadań z nadrzędnymi Epikami.',
            type: 'story',
            priority: 'wysoki',
            status: 'w_toku',
            reporter: $tomasz,
        );
        $ticket145->setAssignee($aleksandra);
        $ticket145->setSprint($sprint4);
        $ticket145->setEpic($epic100);
        $ticket145->setStoryPoints(5);
        $ticket145->setLabels(['frontend', 'features', 'epics']);
        $ticket145->setTimeEstimate('12h');
        $ticket145->setTimeSpent('4h');

        $st1 = new Subtask('TRG-145-1', $ticket145, 'Integracja API dodawania podzadań (POST)', 'zamknięty');
        $st2 = new Subtask('TRG-145-2', $ticket145, 'Zapisywanie stanu ukończenia podzadania (PATCH)', 'zamknięty');
        $st3 = new Subtask('TRG-145-3', $ticket145, 'Dodanie typu Epik do wyboru w formularzu', 'nowy');
        $st4 = new Subtask('TRG-145-4', $ticket145, 'Możliwość podpinania i odpinania zadań od Epika', 'nowy');
        $ticket145->addSubtask($st1);
        $ticket145->addSubtask($st2);
        $ticket145->addSubtask($st3);
        $ticket145->addSubtask($st4);

        // Persist via Foundry save()
        save($sprint4);
        save($sprint3);
        save($epic100);
        save($ticket145);
        save($ticket142);
        save($ticket141);
        save($ticket140);
        save($ticket139);
        save($ticket138);
    }
}
