module.exports = {
  name: 'Add plop',
  dir: 'add-plop',
  description: 'Install plop and few generators',
  packageModify: {
    addDevDependencies: ['plop@latest'],
    addScripts: {
      plop: 'plop'
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
