FROM python:3.12-bookworm

RUN apt-get update && apt-get install -y netcat-openbsd

EXPOSE 8000

WORKDIR /app
COPY ./tools/django/ /app
RUN chmod 777 /app

ENTRYPOINT ["/app/django_start.sh"]
