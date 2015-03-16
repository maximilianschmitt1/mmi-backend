# dependencies

* [virtualbox](https://www.vagrantup.com/downloads.html)
* [vagrant](https://www.vagrantup.com/)

# installation

```bash
git clone https://github.com/maximilianschmitt1/mmi-backend
cd mmi-backend
vagrant up
```

# start

```bash
vagrant ssh
cd /var/www/app
pm2 start ecosystem.json
```