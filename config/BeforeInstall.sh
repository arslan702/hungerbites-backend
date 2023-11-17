#!/bin/bash
cd /home/ubuntu/prod-api
npm install bcrypt@3.0.6
npm install express 
npm install --save-dev node-pre-gyp
npm install husky --save-dev
npm install -g nodemon
npm install --no-package-lock
sudo apt-get install git -y
sudo chown -R $(whoami) ~/.npm



