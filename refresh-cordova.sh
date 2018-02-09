cd `dirname $0`

if [ ! -d node_modules ]; then
  npm install
fi

GSVC_FILE=google-services.json
if [ ! -f ${GSVC_FILE} ] && [ ! -h ${GSVC_FILE} ]; then
  ln -sf src/${GSVC_FILE} .
fi

if [ ! -d platforms ]; then
  cordova platform add android browser
fi

cordova telemetry off
