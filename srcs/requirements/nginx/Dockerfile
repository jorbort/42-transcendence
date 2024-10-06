FROM nginx:latest

COPY ./conf/nginx.conf /etc/nginx/nginx.conf
WORKDIR /usr/share/nginx/html
COPY /front/ /usr/share/nginx/html
COPY /tools/nginx.sh /usr/share/nginx/html
RUN chmod 777 /usr/share/nginx/html
RUN chmod +x /usr/share/nginx/html/nginx.sh

EXPOSE	443 

CMD ["./nginx.sh"]