#! /bin/bash

if [ "$DATABASE" = "postgres" ]; then
    echo "Waiting for postgres..."
    while ! nc -z $DATABASE_HOST $SQL_PORT; do
        sleep 0.1
    done
fi

pip install -r requirements.txt
python3 manage.py makemigrations
python3 manage.py migrate
gunicorn --bind 0.0.0.0:8001 tournament.wsgi:application