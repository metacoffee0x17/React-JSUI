module.exports = {
  name: 'Add .env',
  dir: 'add-env',
  folderPath: 'add-env',
  description: 'Add an .env file for customizing create-react-app',
  actions: [
    {
      name: 'copy',
      fileOrFolder: 'files',
      copyToDir: '/'
    }
  ]
};
