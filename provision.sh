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

# install mongodb
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo service mongod restart