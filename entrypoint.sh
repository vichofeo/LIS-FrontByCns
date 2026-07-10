#!/bin/bash

cd /usr/share/nginx/html

sed -i "s#API_BASE_URL#${API_BASE_URL}#g" *.js
sed -i "s#AUTH_BASE_URL#${AUTH_BASE_URL}#g" *.js
sed -i "s#AUTH_CLIENT_ID#${AUTH_CLIENT_ID}#g" *.js
sed -i "s#SALUD_BASE_URL#${SALUD_BASE_URL}#g" *.js
sed -i "s#AUTH_SCOPE#${AUTH_SCOPE}#g" *.js
# reload nginx with changues
nginx -g 'daemon off;'
