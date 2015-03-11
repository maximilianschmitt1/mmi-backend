# Server Configuration

server_ip             = "192.168.55.55"
server_memory         = "256" # MB

Vagrant.configure("2") do |config|

  config.vm.box = "precise64"
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"

  config.vm.hostname = "webapp.dev"
  config.vm.network :private_network, ip: server_ip
  # config.vm.network :public_network, bridge: "en1: Wi-Fi (AirPort)"
  # config.vm.network :forwarded_port, guest: 8080, host: 8080 # api

  # Use NFS for the shared folder
  config.vm.synced_folder ".", "/var/www/app",
            id: "core",
            :nfs => true,
            :mount_options => ['nolock,vers=3,udp,noatime']

  config.vm.provider :virtualbox do |vb|

    # Set server memory
    vb.customize ["modifyvm", :id, "--memory", server_memory]

    # Set the timesync threshold to 10 seconds, instead of the default 20 minutes.
    # If the clock gets more than 15 minutes out of sync (due to your laptop going
    # to sleep for instance, then some 3rd party services will reject requests.
    vb.customize ["guestproperty", "set", :id, "/VirtualBox/GuestAdd/VBoxService/--timesync-set-threshold", 10000]

  end

  config.vm.provision "shell", path: "provision.sh"

end
