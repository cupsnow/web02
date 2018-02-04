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
if [ ! -f google-services.json ] || [ ! -h google-services.json ]; then
  ln -sf ../google-services.json google-services.json
fi
