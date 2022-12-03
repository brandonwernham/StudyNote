#/bin/bash

# crontab config below
# 0 9 * * * root reboot
# @reboot /home/ubuntu/startup.sh

cd /var/www/StudyNote && git pull
screen -S studynote -dm bash -c 'cd /var/www/StudyNote/Client; npm start'