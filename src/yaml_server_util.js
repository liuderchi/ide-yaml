const fs= require('fs')
const path= require('path')
const childProcess = require('child_process')


const serverExists = () => {
  const serverPath = path.join(__dirname, '../node_modules/yaml-language-server/out/server/src/server.js')
  console.log(`Checking built yaml lang server path: ${serverPath}`)

  try {
    fs.accessSync(serverPath)
  } catch (e) {
    console.log(`Yaml lang server ${serverPath} not found`)
    return false
  }
  return true
}

const installCmd = {
  name: 'Server Install',
  run: () => childProcess.spawnSync(
    'npm',
    ['install', '--prefix', path.join(__dirname, '../node_modules/yaml-language-server')],
    { encoding: 'utf8' }
  ),
}

const compileCmd = {
  name: 'Server Compile',
  run: () => childProcess.spawnSync(
    'npm',
    ['run', 'compile', '--prefix', path.join(__dirname, '../node_modules/yaml-language-server')],
    { encoding: 'utf8' }
  ),
}

const runCmd = (cmd) => {
  console.log(`Doing ${cmd.name}...`)
  const { status } = cmd.run()
  if (status !== 0) {
    console.log(`${cmd.name} failed. Exit ${status}`)
    process.exit(-1)
  }
}

const installServer = () => {
  runCmd(installCmd)
}
const compileServer = () => {
  runCmd(compileCmd)
}

const registerBuildServerCommand = () => {
  const buildServer = () => {
    installServer()
    compileServer()
    serverExists() && atom.notifications.addSuccess(
      '### YAML Server Build Success\n\nPlease reload Atom to apply changes.', {
        buttons: [{
          text: 'Reload',
          onDidClick: () => atom.reload(),
        }],
        dismissable: true,
      }
    )
  }
  atom.commands.add('atom-workspace', 'ide-yaml:build-server', () => {
    atom.notifications.addInfo(
      '## Please build yaml server after install ide-yaml',
      {
        buttons: [{
          text: 'Build Yaml Server',
          className: 'btn btn-info icon-tools',
          onDidClick: buildServer,
        }],
        dismissable: true,
      }
    )
  })
}

module.exports = {
  serverExists,
  installServer,
  compileServer,
  registerBuildServerCommand,
}
