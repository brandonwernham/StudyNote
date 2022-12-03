#/bin/bash

# crontab config below
# 0 9 * * * root reboot
# @reboot /home/ubuntu/startup.sh

cd /var/www/StudyNote && git pull
/usr/bin/screen -S studynote -dm cd /var/www/StudyNote && npm run start