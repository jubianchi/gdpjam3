include_recipe "apt"

apt_repository "nginx-php" do
    uri "http://ppa.launchpad.net/chris-lea/node.js/ubuntu"
end

package "node"
package "npm"