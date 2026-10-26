<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Migration creating Sprint, Ticket, Subtask, Comment, ActivityEvent and updating User.
 */
final class Version20261026115600 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create Sprint, Ticket, Subtask, Comment and ActivityEvent entities and add job_title to user';
    }

    public function up(Schema $schema): void
    {
        // 1. User update
        $this->addSql('ALTER TABLE "user" ADD job_title VARCHAR(255) DEFAULT NULL');

        // 2. Sprint table
        $this->addSql('CREATE TABLE sprint (
            id VARCHAR(64) NOT NULL,
            name VARCHAR(255) NOT NULL,
            goal TEXT DEFAULT NULL,
            start_date DATE DEFAULT NULL,
            end_date DATE DEFAULT NULL,
            status VARCHAR(30) NOT NULL,
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            PRIMARY KEY(id)
        )');

        // 3. Ticket table
        $this->addSql('CREATE TABLE ticket (
            id VARCHAR(64) NOT NULL,
            assignee_id UUID DEFAULT NULL,
            reporter_id UUID DEFAULT NULL,
            sprint_id VARCHAR(64) DEFAULT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            description_html TEXT DEFAULT NULL,
            type VARCHAR(50) NOT NULL,
            priority VARCHAR(50) NOT NULL,
            status VARCHAR(50) NOT NULL,
            reporter_name VARCHAR(255) DEFAULT NULL,
            reporter_email VARCHAR(255) DEFAULT NULL,
            story_points INT NOT NULL DEFAULT 0,
            labels JSON NOT NULL DEFAULT \'[]\',
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            due_date DATE DEFAULT NULL,
            time_estimate VARCHAR(50) DEFAULT NULL,
            time_spent VARCHAR(50) DEFAULT NULL,
            blocked_by VARCHAR(64) DEFAULT NULL,
            blocked_reason TEXT DEFAULT NULL,
            attachments_count INT NOT NULL DEFAULT 0,
            PRIMARY KEY(id)
        )');
        $this->addSql('CREATE INDEX IDX_ticket_assignee ON ticket (assignee_id)');
        $this->addSql('CREATE INDEX IDX_ticket_reporter ON ticket (reporter_id)');
        $this->addSql('CREATE INDEX IDX_ticket_sprint ON ticket (sprint_id)');
        $this->addSql('CREATE INDEX idx_ticket_status ON ticket (status)');
        $this->addSql('CREATE INDEX idx_ticket_priority ON ticket (priority)');

        $this->addSql('ALTER TABLE ticket ADD CONSTRAINT FK_ticket_assignee FOREIGN KEY (assignee_id) REFERENCES "user" (id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE ticket ADD CONSTRAINT FK_ticket_reporter FOREIGN KEY (reporter_id) REFERENCES "user" (id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE ticket ADD CONSTRAINT FK_ticket_sprint FOREIGN KEY (sprint_id) REFERENCES sprint (id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE');

        // 4. Subtask table
        $this->addSql('CREATE TABLE subtask (
            id VARCHAR(64) NOT NULL,
            ticket_id VARCHAR(64) NOT NULL,
            title VARCHAR(255) NOT NULL,
            status VARCHAR(50) NOT NULL,
            position INT NOT NULL DEFAULT 0,
            PRIMARY KEY(id)
        )');
        $this->addSql('CREATE INDEX IDX_subtask_ticket ON subtask (ticket_id)');
        $this->addSql('ALTER TABLE subtask ADD CONSTRAINT FK_subtask_ticket FOREIGN KEY (ticket_id) REFERENCES ticket (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');

        // 5. Comment table
        $this->addSql('CREATE TABLE comment (
            id VARCHAR(64) NOT NULL,
            ticket_id VARCHAR(64) NOT NULL,
            author_id UUID DEFAULT NULL,
            author_name VARCHAR(255) DEFAULT NULL,
            content TEXT NOT NULL,
            content_html TEXT DEFAULT NULL,
            reactions JSON NOT NULL DEFAULT \'[]\',
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL,
            PRIMARY KEY(id)
        )');
        $this->addSql('CREATE INDEX IDX_comment_ticket ON comment (ticket_id)');
        $this->addSql('CREATE INDEX IDX_comment_author ON comment (author_id)');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_comment_ticket FOREIGN KEY (ticket_id) REFERENCES ticket (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_comment_author FOREIGN KEY (author_id) REFERENCES "user" (id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE');

        // 6. ActivityEvent table
        $this->addSql('CREATE TABLE activity_event (
            id VARCHAR(64) NOT NULL,
            ticket_id VARCHAR(64) NOT NULL,
            user_id UUID DEFAULT NULL,
            user_name VARCHAR(255) NOT NULL,
            user_avatar_fallback VARCHAR(10) NOT NULL,
            action VARCHAR(255) NOT NULL,
            target VARCHAR(255) NOT NULL,
            type VARCHAR(50) DEFAULT NULL,
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            PRIMARY KEY(id)
        )');
        $this->addSql('CREATE INDEX IDX_activity_event_ticket ON activity_event (ticket_id)');
        $this->addSql('CREATE INDEX IDX_activity_event_user ON activity_event (user_id)');
        $this->addSql('ALTER TABLE activity_event ADD CONSTRAINT FK_activity_event_ticket FOREIGN KEY (ticket_id) REFERENCES ticket (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE activity_event ADD CONSTRAINT FK_activity_event_user FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE activity_event');
        $this->addSql('DROP TABLE comment');
        $this->addSql('DROP TABLE subtask');
        $this->addSql('DROP TABLE ticket');
        $this->addSql('DROP TABLE sprint');
        $this->addSql('ALTER TABLE "user" DROP job_title');
    }
}
