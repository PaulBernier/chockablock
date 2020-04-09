#!/bin/bash

git reset --hard
git pull
git log -1
npm ci
npm run build
rm -rf www
mv dist www
pm2 reload ecosystem.config.js --env production