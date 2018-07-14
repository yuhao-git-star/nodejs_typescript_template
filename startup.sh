#!/bin/sh

if [ "${NODE_ENV}" = "production" ]; then
  node ./dist/server.js
else
  nodemon ./dist/server.js
fi
exit 0