#/bin/bash

# crontab config below
# 0 9 * * * sudo /sbin/shutdown -r
# @reboot sleep 60 && sudo /home/ubuntu/startup.sh

cd /var/www/StudyNote && git pull
rm -r /var/www/StudyNote/build
cd /var/www/StudyNote && npm run build 
sudo systemctl restart nginx