#! /bin/bash

if [ "$DATABASE" = "postgres" ]; then
    echo "Waiting for postgres..."

    while ! nc -z $DATABASE_HOST $SQL_PORT; do
        sleep 0.1
    done

    echo "PostgresSQL started"
fi


pip install -r requirements.txt
python3 manage.py makemigrations
echo "TODO CORRECTO HASTA AQUI MIGRATIONS"
python3 manage.py migrate
echo "TODO CORRECTO HASTA AQUI MIGRATE"
python3 manage.py showmigrations
gunicorn --bind 0.0.0.0:8001 tournament.wsgi:application