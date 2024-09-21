#! /bin/bash

if [ "$DATABASE" = "postgres" ]; then
    echo "Waiting for postgres..."

    while ! nc -z $DATABASE_HOST $SQL_PORT; do
        sleep 0.1
    done

    echo "PostgresSQL started"
fi

apt-get install cron -y 

python3 -m venv .venv && source .venv/bin/activate\
&& pip install -r requirements.txt\


if [ ! -d "staticfiles" ]; then
    mkdir staticfiles
fi

# cd trascendance
# django-admin startproject trascendance .
# django-admin startapp users
# python3 manage.py flush --no-input
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py collectstatic --no-input
python3 manage.py crontab add 

gunicorn trascendance.wsgi:application --bind 0.0.0.0:8000
