# Habit Backend

## Installation

* [Virtualbox](https://www.vagrantup.com/downloads.html) installieren
* [Vagrant](https://www.vagrantup.com/) installieren
* `git clone https://github.com/maximilianschmitt1/mmi-backend`
* `cd mmi-backend`
```

## Backend starten

```
* `vagrant up`
* `vagrant ssh`
* `cd /var/www/app`
* `pm2 start ecosystem.json`
```

## Konfiguration

Im Normalfall ist keine Konfiguration erforderlich. Für den Fall, dass der "Reminder"-Service (der Service, der die Erinnungsmails raussendet) getestet werden soll, muss ein gültiger [Mandrill](http://mandrillapp.com/) API-Key in der `ecosystem.json` [angegeben werden](https://github.com/maximilianschmitt1/mmi-backend/blob/a02089f7dcb2691fcd3a71d3502727fe44c7cdf8/ecosystem.json#L8).
