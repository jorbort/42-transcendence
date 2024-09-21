up:	
	@if [ ! -d "/home/${USER}/data/postgres_data" ]; then \
		mkdir "/home/${USER}/data/postgres_data"; \
	fi
	docker-compose up -d
down:
	docker-compose down
clean:
	sudo rm -rf "/home/${USER}/data/postgres_data"\
	docker stop $$(docker ps -aq)\
	docker rm $$(docker ps -aq)\
	docker image rmi $$(docker image ls -aq)\
	docker volume rm $$(docker volume ls -q)\
	docker network rm $$(docker network ls -q --filter type=custom)

re: down up