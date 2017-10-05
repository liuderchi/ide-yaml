const fs= require('fs')
const path= require('path')

const serverPath = path.join(
  __dirname,
  'node_modules/yaml-language-server/out/server/src/server.js'
)
console.log(`Checking built yaml lang server path: ${serverPath}`)

try {
  fs.accessSync(serverPath)
} catch (e) {
  console.log(`Yaml lang server ${serverPath} not found. Build failed.`)
  process.exit(-1)
}
console.log('Server build success.')
