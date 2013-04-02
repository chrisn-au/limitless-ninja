limitless-ninja
===============

ssh to your block

download the git to the drivers direc

cd /opt/ninja/drivers

git clone git://github.com/chrisn-au/limitless-ninja.git

Temporary hack

mkdir /opt/ninja/config/limitless-ninja

cp /opt/ninja/drivers/limitless-ninja/limitless/* /opt/ninja/config/limitless-ninja

edit the config.json file to update your ip addresses in /opt/ninja/config/limitless-ninja



sudo service ninjablock restart


