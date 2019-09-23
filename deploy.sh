#!/bin/bash

git reset --hard
git pull
git log -1
npm ci --only=production
pm2 reload ecosystem.config.js --env production