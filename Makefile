.DEFAULT_GOAL := help

# Docker Compose executable
DOCKER_COMPOSE := docker compose

# Containers & Exec shortcuts
EXEC_BACKEND  := $(DOCKER_COMPOSE) exec backend
EXEC_FRONTEND := $(DOCKER_COMPOSE) exec frontend
EXEC_DATABASE := $(DOCKER_COMPOSE) exec database
CONSOLE       := $(EXEC_BACKEND) php bin/console

# Colors for terminal output
COLOR_RESET   := \033[0m
COLOR_INFO    := \033[36m
COLOR_SUCCESS := \033[32m
COLOR_WARNING := \033[33m

# ==============================================================================
# Main Setup & Initialization
# ==============================================================================

.PHONY: init
init: ## Complete project initialization (build, start, composer, npm, migrations, fixtures)
	@echo "$(COLOR_INFO)Starting Triago project initialization...$(COLOR_RESET)"
	@$(MAKE) up-build
	@echo "$(COLOR_INFO)Installing backend dependencies (Composer)...$(COLOR_RESET)"
	@$(MAKE) composer-install
	@echo "$(COLOR_INFO)Installing frontend dependencies (npm)...$(COLOR_RESET)"
	@$(MAKE) npm-install
	@echo "$(COLOR_INFO)Running database migrations...$(COLOR_RESET)"
	@$(MAKE) migrate
	@echo "$(COLOR_INFO)Loading database fixtures...$(COLOR_RESET)"
	@$(MAKE) fixtures
	@echo "$(COLOR_SUCCESS)Project initialized successfully!$(COLOR_RESET)"
	@echo "$(COLOR_INFO)Frontend:$(COLOR_RESET) http://localhost:5173"
	@echo "$(COLOR_INFO)Backend:$(COLOR_RESET)  http://localhost:8000"

# ==============================================================================
# Docker Management
# ==============================================================================

.PHONY: up up-build down down-v stop restart build logs logs-backend logs-frontend logs-web ps
up: ## Start all containers in background
	@echo "$(COLOR_INFO)Starting containers...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) up -d

up-build: ## Build and start all containers in background
	@echo "$(COLOR_INFO)Building and starting containers...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) up -d --build

down: ## Stop and remove all containers and networks
	@echo "$(COLOR_WARNING)Stopping and removing containers...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) down

down-v: ## Stop and remove containers, networks, and persistent volumes (WARNING: wipes DB)
	@echo "$(COLOR_WARNING)Stopping containers and wiping volumes...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) down -v

stop: ## Stop all containers without removing them
	@echo "$(COLOR_INFO)Stopping containers...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) stop

restart: ## Restart all containers
	@echo "$(COLOR_INFO)Restarting containers...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) restart

build: ## Rebuild all docker images
	@echo "$(COLOR_INFO)Building images...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) build

logs: ## View real-time logs from all containers
	@$(DOCKER_COMPOSE) logs -f

logs-backend: ## View real-time logs for backend container
	@$(DOCKER_COMPOSE) logs -f backend

logs-frontend: ## View real-time logs for frontend container
	@$(DOCKER_COMPOSE) logs -f frontend

logs-web: ## View real-time logs for Nginx web server
	@$(DOCKER_COMPOSE) logs -f backend-web

ps: ## List status of containers
	@$(DOCKER_COMPOSE) ps

# ==============================================================================
# Backend & Symfony
# ==============================================================================

.PHONY: composer-install composer-update cc migrate migration fixtures console
composer-install: ## Install PHP dependencies inside backend container
	@$(EXEC_BACKEND) composer install

composer-update: ## Update PHP dependencies inside backend container
	@$(EXEC_BACKEND) composer update

cc: ## Clear Symfony cache
	@echo "$(COLOR_INFO)Clearing Symfony cache...$(COLOR_RESET)"
	@$(CONSOLE) cache:clear

migrate: ## Execute database migrations
	@$(EXEC_BACKEND) bash -c "if php bin/console list | grep -q 'doctrine:migrations:migrate'; then php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration; else echo 'Doctrine Migrations is not yet installed in Symfony.'; fi"

migration: ## Generate a new Doctrine migration
	@$(CONSOLE) make:migration

fixtures: ## Load database fixtures
	@$(EXEC_BACKEND) bash -c "if php bin/console list | grep -q 'doctrine:fixtures:load'; then php bin/console doctrine:fixtures:load --no-interaction; else echo 'Doctrine Fixtures Bundle is not yet installed in Symfony.'; fi"

console: ## Run Symfony console command (usage: make console cmd="about")
	@$(CONSOLE) $(cmd)

# ==============================================================================
# Frontend
# ==============================================================================

.PHONY: npm-install npm-build
npm-install: ## Install frontend npm packages
	@$(EXEC_FRONTEND) npm install

npm-build: ## Build frontend assets for production
	@$(EXEC_FRONTEND) npm run build

# ==============================================================================
# Shell Access
# ==============================================================================

.PHONY: sh-backend sh-frontend sh-db
sh-backend: ## Open bash shell inside backend container
	@$(EXEC_BACKEND) bash

sh-frontend: ## Open shell inside frontend container
	@$(EXEC_FRONTEND) sh

sh-db: ## Connect to PostgreSQL database CLI (psql)
	@$(EXEC_DATABASE) psql -U triago -d triago

# ==============================================================================
# Help
# ==============================================================================

.PHONY: help
help: ## Display this help message
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Available targets:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(COLOR_INFO)%-18s$(COLOR_RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
