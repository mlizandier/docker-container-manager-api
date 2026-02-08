.PHONY: help build up down restart logs shell clean dev

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build the Docker image
	docker-compose build

up: ## Start the containers
	docker-compose up -d

down: ## Stop and remove containers
	docker-compose down

restart: ## Restart the containers
	docker-compose restart

logs: ## View container logs
	docker-compose logs -f

shell: ## Open a shell in the running container
	docker-compose exec app /bin/sh

clean: ## Stop containers and remove volumes
	docker-compose down -v

dev: ## Build and start containers in foreground (with logs)
	docker-compose up --build

rebuild: ## Rebuild and restart containers
	docker-compose up -d --build

stop: ## Stop containers without removing them
	docker-compose stop

start: ## Start stopped containers
	docker-compose start
