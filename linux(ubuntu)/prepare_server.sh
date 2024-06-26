#!/usr/bin/env bash
# a script that installs nginx and configures the server to use on master computer

sudo apt -y update
sudo apt -y install nginx
sudo service nginx start

sudo cp -r ./base_model/templates/* /var/www/html/

sudo rm /etc/nginx/sites-enabled/default
username=$(whoami)
static_dir="/home/$username/NIBO-Test-Network/staticfiles/"

sudo tee /etc/nginx/sites-available/nibo_network.conf <<EOF
server {
        listen 80 default_server;
        listen [::]:80 default_server;
        server_name nibo.exam;

        location / {
            proxy_pass http://127.0.0.1:8000;
        }
        location /static/ {
                alias "$static_dir";
                try_files $uri $uri/ =404;
        }
        location /admin/ {
                proxy_pass http://0.0.0.0:8000/admin/;
        }
        location /student/ {
                proxy_pass http://0.0.0.0:8000/student/;
        }
        location /exam/ {
                proxy_pass http://0.0.0.0:8000/exam/;
        }

        error_page 404 /404.html;
        location = /nibo_error_404.html {
                root /var/www/html;
                internal;
        }

}
EOF
sudo ln -s /etc/nginx/sites-available/nibo_network.conf /etc/nginx/sites-enabled/
sudo tee -a /etc/hosts <<EOF
127.0.1.1       nibo.exam
EOF

sudo service nginx restart
