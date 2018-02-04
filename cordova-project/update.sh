cd `dirname $0`

if [ ! -d node_modules ]; then
  npm install
fi
if [ ! -d www ] || [ ! -h www ]; then
  ln -sf ../www www
fi
if [ ! -d platforms ]; then
  cordova platform add android browser
fi
