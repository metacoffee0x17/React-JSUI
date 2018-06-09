module.exports = {
  name: 'CRA to Electron',
  dir: 'cra-to-electron',
  description: 'Add Electron to a CRA app',
  packageModify: {
    addDevDependencies: [
      'electron',
      'electron-builder',
      'electron-is-dev',
      'concurrently',
      'wait-on',
      'cross-env'
    ],
    removeScripts: ['build', 'start', 'test'],
    addScripts: {
      'react-start': 'react-scripts start',
      'react-build': 'react-scripts build',
      'react-test': 'react-scripts test --env=jsdom',
      'electron-pack': 'electron-builder',
      'copy-electron': 'cp -r ./electron/. ./build',
      prebuild: 'rm -rf ./build && rm -rf ./dist',
      build: 'yarn react-build && yarn copy-electron && yarn electron-pack',
      start:
        'concurrently "cross-env BROWSER=none yarn react-start" "wait-on http://localhost:3000 && electron electron/electron.js"'
    },
    merge: {
      build: {
        productName: 'Example',
        appId: 'com.example.jsui',
        extends: null,
        files: ['build/**/*'],
        extraMetadata: {
          main: 'build/electron.js'
        },
        directories: {
          buildResources: 'assets'
        }
      }
    }
  },
  actions: [
    {
      name: 'copy',
      fileOrFolder: 'files',
      copyToDir: '/electron'
    }
  ]
};
