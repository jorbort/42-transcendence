all: host vol
	sudo chmod 777 /var/run/docker.sock
	@docker compose -f ./srcs/docker-compose.yml up -d --build

host:
	sudo sed -i 's|localhost|trascendence.42.es|g' /etc/hosts

down:
	@docker compose -f ./srcs/docker-compose.yml down
	@if [ -n "$$(docker image ls -aq)" ]; then \
		docker image rmi $$(docker image ls -aq); \
	fi
re: down clean all

reset: down all

vol:
	mkdir -p $(HOME)/data/postgres_data
	mkdir -p $(HOME)/data/django_data
	sudo chown -R $(USER) $(HOME)/data
	sudo chmod -R 777 $(HOME)/data

status :
	@docker ps -a

clean: down
	@docker stop $$(docker ps -qa);\
	docker rm $$(docker ps -qa);\
	docker image rmi $$(docker image ls -aq); \
	docker volume rm $$(docker volume ls -q);\
	docker network rm $$(docker network ls -q --filter type=custom);\
	sudo rm -rf $(HOME)/data/

.PHONY: all re down clean
