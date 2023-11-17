#!/bin/bash



cd /home/ubuntu/prod-api
export PATH="$PATH:/usr/lib/node_modules/pm2/bin"

pm2 describe "kt-backend-api"
if [ $? -eq 0 ]
then
    pm2 restart "kt-backend-api"
else
    pm2 start npm --name "kt-backend-api" -- start
fi
pm2 startup systemd
pm2 save
