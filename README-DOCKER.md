# Docker Environment for Triago

This project is fully containerized using **Docker** and **Docker Compose**.

## Services Overview

| Service | Container | Container Port | Host Port | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Database** | `triago-database` | `5432` | `5434` | PostgreSQL 17 (data volume: `triago_db_data`) |
| **Backend** | `triago-backend` | `9000` | - | PHP 8.5 FPM + OPcache + Composer |
| **Web Server** | `triago-backend-web` | `80` | `8000` | Nginx reverse proxy for Symfony API |
| **Frontend** | `triago-frontend` | `5173` | `5173` | React 19 + Vite (HMR enabled) |

---

## Quick Start

### Start all containers:
```bash
docker compose up -d
```

### View real-time logs:
```bash
docker compose logs -f
```
*(or specify a service, e.g., `docker compose logs -f backend`)*

### Stop containers:
```bash
docker compose down
```

---

## Application Access

- **Frontend (React / Vite)**: [http://localhost:5173](http://localhost:5173)
- **Backend API (Symfony)**: [http://localhost:8000](http://localhost:8000)
- **Database (PostgreSQL)**:
  - Host: `localhost`
  - Port: `5434` (from host) or `database:5432` (within Docker network)
  - Username: `triago`
  - Password: `triago`
  - Database: `triago`

---

## Useful Development Commands

### Symfony Console (`bin/console`):
```bash
docker compose exec backend php bin/console <command>
```
Examples:
```bash
docker compose exec backend php bin/console about
docker compose exec backend php bin/console cache:clear
docker compose exec backend php bin/console debug:router
```

### Composer package management:
```bash
docker compose exec backend composer install
docker compose exec backend composer require <package-name>
```

### Database migrations:
```bash
docker compose exec backend php bin/console make:migration
docker compose exec backend php bin/console doctrine:migrations:migrate
```

### Check PHP modules and OPcache:
```bash
docker compose exec backend php -v
docker compose exec backend php -m
docker compose exec backend php -i | grep opcache
```

### Access container shell:
```bash
docker compose exec backend bash
docker compose exec database psql -U triago -d triago
```
