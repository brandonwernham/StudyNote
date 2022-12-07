#/bin/bash

# crontab config below
# 0 9 * * * root reboot
# @reboot /home/ubuntu/startup.sh

killall screen
cd /var/www/StudyNote && git pull
screen -S client -dm bash -c 'cd /var/www/StudyNote/Client; npm start'
screen -S server -dm bash -c 'cd /var/www/StudyNote/Server; npm start'