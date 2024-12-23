#! /bin/bash

if [ "$DATABASE" = "postgres" ]; then
    while ! nc -z $DATABASE_HOST $SQL_PORT; do
        sleep 0.5
    done
fi
sleep 5
python3 -m venv .venv && source .venv/bin/activate\
&& pip install -r requirements.txt
sleep 10
python3 manage.py makemigrations
sleep 5
python3 manage.py migrate
sleep 5
gunicorn --bind 0.0.0.0:8001 tournament.wsgi:application