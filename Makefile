up:	
	@if [ ! -d "${HOME}/data/postgres_data" ]; then \
		 sudo mkdir "${HOME}/data"; \
		 sudo mkdir "${HOME}/data/postgres_data"; \
	fi
	docker-compose up 
down:
	docker-compose down
	@if [ -n "$$(docker image ls -aq)" ]; then \
		docker image rmi $$(docker image ls -aq); \
	fi
clean:
	sudo rm -rf "${HOME}/data/postgres_data"
	docker stop $$(docker ps -aq)
	docker rm $$(docker ps -aq)
	docker image rmi $$(docker image ls -aq)
	docker volume rm $$(docker volume ls -q)
	docker network rm $$(docker network ls -q --filter type=custom)

re: down up