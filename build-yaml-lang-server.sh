cd node_modules/yaml-language-server &&

npm install && npm run compile &&

serverPath='out/server/src/server.js'

echo "Checking built yaml lang server path: $serverPath"

if [ ! -f "$serverPath" ]
then
    echo "Yaml lang server $serverPath not found. Build failed."
    exit -1;
fi

echo "Server build is success."
