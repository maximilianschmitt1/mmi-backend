# Habit Backend

## Dependencies

* [virtualbox](https://www.vagrantup.com/downloads.html)
* [vagrant](https://www.vagrantup.com/)

## Installation

```
$ git clone https://github.com/maximilianschmitt1/mmi-backend
$ cd mmi-backend
$ vagrant up
```

## Start

```
$ vagrant ssh
$ cd /var/www/app
$ pm2 start ecosystem.json
```