module.exports = {
  name: 'custom-react-scripts',
  dir: 'custom-react-scripts',
  description: 'Replace react-scripts with custom-react-scripts',
  packageModify: {
    addDevDependencies: ['custom-react-scripts'],
    removeDependencies: ['react-scripts']
  }
};
