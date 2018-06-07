module.exports = {
  name: 'Rewire',
  dir: 'rewire',
  description: 'Install react-rewired for customizing react-scripts',
  packageModify: {
    addDevDependencies: [
      'react-app-rewired',
      'babel-plugin-transform-decorators-legacy',
      'babel-plugin-transform-do-expressions',
      'babel-plugin-emotion',
      'babel-plugin-preval'
    ],
    removeScripts: ['build', 'start', 'test'],
    addScripts: {
      start: 'react-app-rewired start',
      build: 'react-app-rewired build',
      test: 'react-app-rewired test --env=jsdom'
    }
  },
  actions: [
    {
      name: 'copy',
      fileOrFolder: 'files',
      copyToDir: '/'
    }
  ]
};
