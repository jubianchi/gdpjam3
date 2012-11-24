# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant::Config.run do |config|
	config.vm.box = "precise64"
	config.vm.box_url = "http://files.vagrantup.com/precise64.box"

	config.vm.forward_port 80, 2280

    config.vm.network :hostonly, "192.168.50.4"
    config.vm.share_folder("v-root", "/vagrant", ".", :nfs => true)
end
