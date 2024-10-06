#!/bin/bash

mkdir -p /etc/nginx/ssl
mkdir -p /run/nginx

openssl req -newkey rsa:4096 -x509 -sha256 -days 365 -nodes \
       -out $CERTS_CRT \
       -keyout $CERTS_KEY \
       -subj "/C=ES/ST=Spain/L=Barcelona/O=42 School/OU='${NAME}'/CN='${DOMAIN_NAME}'/"

nginx -g "daemon off;"