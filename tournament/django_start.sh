#! /bin/bash

if [ "$DATABASE" = "postgres" ]; then
    echo "Waiting for postgres..."

    while ! nc -z $DATABASE_HOST $SQL_PORT; do
        sleep 0.1
    done

    echo "PostgresSQL started"
fi

python3 -m venv .venv && source .venv/bin/activate\
&& pip install -r requirements.txt\

#python manage.py startapp app
# python3 manage.py flush --no-input
# python3 manage.py makemigrations app
# python3 manage.py migrate
#python manage.py crontab run 89b108a04c1e9d09c7bf36ceecf7f0e3 comando para debuggear el cron antes que se ejecute el servidor de gunicorn



python manage.py makemigrations
# python manage.py makemigrations app

# # python manage.py migrate admin zero --fake
# # python manage.py migrate app zero --fake
# python manage.py migrate app 0001_initial --fake
# python manage.py migrate admin 0001_initial --fake

# daphne -b 0.0.0.0 -p 8001 trascendance.:application
gunicorn --bind 0.0.0.0:8001 tournament.wsgi:application