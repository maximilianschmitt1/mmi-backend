#!/bin/bash
sudo apt-get update
# common dependencies
sudo apt-get install -y build-essential git-core

# install nginx
sudo apt-get update
sudo apt-get install -y nginx
sudo service nginx start # start nginx
update-rc.d nginx defaults # start nginx on boot
sudo bash -c 'echo "upstream app {
  server 127.0.0.1:8080;
}

server {
  listen 80;

  location / {
    proxy_pass http://app;
  }
}" > /etc/nginx/sites-available/default'
sudo service nginx reload

# install node.js
sudo apt-get install -y python-software-properties
sudo apt-add-repository -y ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install -y nodejs
sudo chown -R $USER ~/.npm

sudo debconf-set-selections <<< "mysql-server mysql-server/root_password password root"
sudo debconf-set-selections <<< "mysql-server mysql-server/root_password_again password root"

# install mysql
sudo apt-get install -y --force-yes mysql-server

# 0.0.0.0 instead of 127.0.0.1
sed -i "s/bind-address.*/bind-address = 0.0.0.0/" /etc/mysql/my.cnf

# give root user with root password privileges to access from outside
mysql -uroot -proot -e "GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'root' WITH GRANT OPTION; FLUSH PRIVILEGES";
mysql -uroot -proot -e "CREATE DATABASE root;"
# mysql -uroot -proot -e "SET PASSWORD = PASSWORD('cleartext password');"
service mysql restart

# install pm2
sudo npm install -g pm2

# run app setup
cd /var/www/app # we have to cd here because of environment variables
sudo npm install
npm run setup