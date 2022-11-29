from node:14 as builder

workdir /opt/frontend
add package.json yarn.lock /opt/frontend/

run yarn

add . /opt/frontend/
run yarn build
run find /opt/frontend/build -type f -size +200c ! -iname '*.gz' -execdir gzip -9 --keep --force {} \;
run rm -f /opt/frontend/build/index.html.gz
from nginx:1.19.6
add  contrib/nginx/99-envsubst-react-app.sh /docker-entrypoint.d/
add  contrib/nginx/nginx.conf /etc/nginx/nginx.conf
copy --from=builder /opt/frontend/build/ /usr/share/nginx/html
