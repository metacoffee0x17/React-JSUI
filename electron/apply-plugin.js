const fsExtra = require('fs-extra');
const path = require('path');
const logger = require('electron-timber');
const { promisify } = require('util');
const copyAsync = promisify(fsExtra.copy);

const applyPlugin = async ({ actions, pluginName, dir, projectPath }) =>
  Promise.all(
    actions.map(async action => {
      if (action.name === 'copy') {
        logger.log('copying');
        try {
          let copyFromDir = path.join(__dirname, 'plugins', dir, action.fileOrFolder);
          let copyToDir = path.join(projectPath, action.copyToDir);
          logger.log('copying', copyFromDir, copyToDir);
          return await copyAsync(copyFromDir, copyToDir);
        } catch (err) {
          logger.log('err', err);
        }
      }
    })
  );

module.exports = applyPlugin;
