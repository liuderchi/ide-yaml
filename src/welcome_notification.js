// show welcome message on first installation
const path = require('path')
const fs = require('fs')
const packageJSON = require('../package.json')

const { name: pkgName, atomRequirements: requirements, enhancedScopes } = packageJSON
const REQUIREMENTS_CHECK_PASSED = path.join(__dirname, '..', 'REQUIREMENTS_CHECK_PASSED')

const touchFile = (path) => fs.closeSync(fs.openSync(path, 'w'))

// TODO make it pure
const generateWelcomeMsg = () => {
  const grammarName = enhancedScopes[0].split('.')[1].toUpperCase()
  return `## Welcome to ${pkgName}\n\nQuick start:\n${[
    `Open ${grammarName} file from your Project`,
    'Dispatch command `Outline View: Toggle`',
  ].map((str, i) => `${i}. ${str}\n`).join('')
  }\nHappy Using Atom IDE : )`
}

// TODO make it pure
const generateWarnMsg = () => {
  return `## Welcome to ${pkgName}\n\nPlease install and activate these requirements:\n${
    requirements
      .map((name, i) => `${i+1}. [\`${name}\`](https://atom.io/packages/${name})\n`)
      .join('')
  }\nso that ${pkgName} can work properly.`
}

// TODO dismiss on click
const helpButton = {
  text: ' Help',
  onDidClick: () => {
    atom.commands.dispatch(
      atom.views.getView(atom.workspace.getActivePane()),
      `${pkgName}:help`
    )
  },
  className: 'btn btn-lg icon-light-bulb',
}

// TODO dismiss on click
const settingsButton = {
  text: ' Open Settings Page',
  onDidClick: () => {
    atom.commands.dispatch(
      atom.views.getView(atom.workspace.getActivePane()),
      'settings-view:install-packages-and-themes'
    )
  },
  className: 'btn btn-lg icon-tools',
}

const checkRequirementsThenWelcome = () => {
  try {
    fs.accessSync(REQUIREMENTS_CHECK_PASSED)
  } catch (err) {
    if (requirements.every(req => atom.packages.isPackageLoaded(req))) {
      atom.notifications.addSuccess(
        generateWelcomeMsg(),
        {
          buttons: [helpButton],
          dismissable: true,
          icon: 'thumbsup',
        }
      )
      touchFile(REQUIREMENTS_CHECK_PASSED)
    } else {
      const notification = atom.notifications.addWarning(
        generateWarnMsg(),
        {
          buttons: [
            settingsButton,
            {
              text: ' Ignore This Message',
              onDidClick: () => {
                notification.dismiss()
                touchFile(REQUIREMENTS_CHECK_PASSED)
              },
              className: 'btn btn-lg icon-circle-slash',
            },
          ],
          dismissable: true,
          icon: 'info',
        }
      )
    }
  }
}


module.exports = {
  checkRequirementsThenWelcome,
}
