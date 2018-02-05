cd `dirname $0`

if [ ! -d node_modules ]; then
  npm install
fi

WWW_DIR=www
if [ ! -d ${WWW_DIR} ] && [ ! -h ${WWW_DIR} ]; then
  ln -sf ../www ${WWW_DIR}
fi

GSVC_FILE=google-services.json
if [ ! -f ${GSVC_FILE} ] && [ ! -h ${GSVC_FILE} ]; then
  ln -sf ../${GSVC_FILE} ${GSVC_FILE}
fi

if [ ! -d platforms ]; then
  cordova platform add android browser
fi

cordova telemetry off
