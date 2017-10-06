const fs= require('fs')
const path= require('path')
const childProcess = require('child_process')

const commands = [
  {
    name: 'Server Install',
    run: () => childProcess.spawnSync(
      'npm',
      ['install', '--prefix', 'node_modules/yaml-language-server'],
      { encoding: 'utf8' }
    ),
  },
  {
    name: 'Server Compile',
    run: () => childProcess.spawnSync(
      'npm',
      ['run', 'compile', '--prefix', 'node_modules/yaml-language-server'],
      { encoding: 'utf8' }
    ),
  },
]

commands.forEach(cmd => {
  console.log(`Doing ${cmd.name}...`)
  const { status } = cmd.run()
  if (status !== 0) {
    console.log(`${cmd.name} failed. Exit ${status}`)
    process.exit(-1)
  }
})

const serverPath = path.join(__dirname, 'node_modules/yaml-language-server/out/server/src/server.js')
console.log(`Checking built yaml lang server path: ${serverPath}`)

try {
  fs.accessSync(serverPath)
} catch (e) {
  console.log(`Yaml lang server ${serverPath} not found. Build failed.`)
  process.exit(-1)
}
console.log('Server build success.')
