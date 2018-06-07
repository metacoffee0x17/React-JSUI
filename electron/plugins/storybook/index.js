module.exports = {
  name: 'Storybook',
  dir: 'storybook',
  description: 'Install storybook',
  packageModify: {
    addDevDependencies: ['babel-core', '@storybook/react'],
    addScripts: {
      storybook: 'start-storybook -p 9001 -c .storybook'
    }
  },
  actions: [
    {
      name: 'copy',
      fileOrFolder: 'rootconfig',
      copyToDir: '/.storybook'
    },
    {
      name: 'copy',
      fileOrFolder: 'stories',
      copyToDir: '/stories'
    }
  ]
};
