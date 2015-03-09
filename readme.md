# installation (muss nur einmal gemacht werden)

* [virtualbox](https://www.vagrantup.com/downloads.html) installieren
* [vagrant](https://www.vagrantup.com/) installieren
* `git clone https://github.com/maximilianschmitt1/mmi-backend`
* `cd mmi-backend`
* `vagrant up`
* installation abwarten

# server starten

* `vagrant up` - startet die virtual machine
* `vagrant ssh` - login auf der virtual machine
* `cd /var/www/app` - wechselt ins app-verzeichnis
* `npm start` - startet das backend
* [http://192.168.55.55](http://192.168.55.55)

# server anhalten

* ggf. `strg + c` drücken, um backend-prozess zu beenden
* `exit` - aus der virtual machine ausloggen
* `vagrant halt` - virtual machine herunterfahren