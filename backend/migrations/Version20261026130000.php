<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Migration adding parent_id and epic_id to ticket table for hierarchy and epics.
 */
final class Version20261026130000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add parent_id and epic_id to ticket for hierarchy and epics support';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE ticket ADD parent_id VARCHAR(64) DEFAULT NULL');
        $this->addSql('ALTER TABLE ticket ADD epic_id VARCHAR(64) DEFAULT NULL');
        $this->addSql('CREATE INDEX IDX_ticket_parent ON ticket (parent_id)');
        $this->addSql('CREATE INDEX IDX_ticket_epic ON ticket (epic_id)');
        $this->addSql('ALTER TABLE ticket ADD CONSTRAINT FK_ticket_parent FOREIGN KEY (parent_id) REFERENCES ticket (id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE ticket ADD CONSTRAINT FK_ticket_epic FOREIGN KEY (epic_id) REFERENCES ticket (id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE ticket DROP CONSTRAINT FK_ticket_parent');
        $this->addSql('ALTER TABLE ticket DROP CONSTRAINT FK_ticket_epic');
        $this->addSql('DROP INDEX IDX_ticket_parent');
        $this->addSql('DROP INDEX IDX_ticket_epic');
        $this->addSql('ALTER TABLE ticket DROP parent_id');
        $this->addSql('ALTER TABLE ticket DROP epic_id');
    }
}
