# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant::Config.run do |config|
	config.vm.box = "precise64"
	config.vm.box_url = "http://files.vagrantup.com/precise64.box"

	config.vm.forward_port 80, 2280, :auto => true
	config.vm.forward_port 8080, 2288 :auto => true

	config.vm.network :hostonly, "192.168.50.4"
	config.vm.share_folder("v-root", "/vagrant", ".", :nfs => true)

	config.vm.provision :chef_solo do |chef|
		chef.cookbooks_path = "provision"

		chef.add_recipe "apt"
		chef.add_recipe "box"
	end
end
