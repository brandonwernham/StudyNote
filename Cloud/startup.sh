#/bin/bash

# crontab config below
# 0 1 * * * /sbin/shutdown -r +5
# 0 13 * * * /sbin/shutdown -r +5
# @reboot sleep 15 && /home/ubuntu/startup.sh

killall screen
cd /var/www/StudyNote && git pull
screen -S client -dm bash -c 'cd /var/www/StudyNote/Client; npm start'
screen -S server -dm bash -c 'cd /var/www/StudyNote/Server; npm start'