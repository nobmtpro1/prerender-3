#!/bin/sh

cp /usr/share/nginx/html/index.html /tmp/index.html
envsubst '${REACT_APP_API_URL}' < /tmp/index.html > /usr/share/nginx/html/index.html
