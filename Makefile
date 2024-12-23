
up:	
	@if [ ! -d "./postgres/res" ]; then \
		mkdir "./postgres/res"; \
	fi
	docker compose -f docker-compose.yaml up  --build
down:
	docker-compose down
	@if [ -n "$$(docker image ls -aq)" ]; then \
		docker image rmi $$(docker image ls -aq); \
	fi
clean:
	@if [ ! -z "$$(docker ps -aq)" ]; then \
		docker stop $$(docker ps -aq); \
		docker rm $$(docker ps -aq); \
	fi
	@if [ ! -z "$$(docker images -aq)" ]; then \
		docker rmi $$(docker images -aq); \
	fi	
	@if [ ! -z "$$(docker volume ls -q)" ]; then \
		docker volume rm $$(docker volume ls -q); \
	fi
	@if [ ! -z "$$(docker network ls -q --filter type=custom)" ]; then \
		docker network rm $$(docker network ls -q --filter type=custom); \
	fi
	@echo "Deleted all docker containers, volumes, networks, and images succesfully"

re: clean up