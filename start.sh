#!/usr/bin/env bash
vagrant up
vagrant ssh -c "cd /var/www/app; pm2 start ecosystem.json"
