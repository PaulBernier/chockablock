#!/bin/bash

git reset --hard
git pull
git log -1
npm ci
npm run build
pm2 reload ecosystem.config.js --env production