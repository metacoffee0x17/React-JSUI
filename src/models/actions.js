import { types, getRoot } from 'mobx-state-tree';
import routes from 'config/routes';
import { createModel } from 'utils/mst-utils';
import Boolean from 'models/Boolean';

export const actionsList = [
  {
    name: 'Open Babel REPL',
    command: store => store.babelReplDialogOpen.setTrue()
  },
  {
    name: 'Convert CSS to css-in-js',
    command: store => store.cssConverterDialogOpen.setTrue()
  },
  {
    name: 'Generate a new project',
    command: store => store.generateDialogOpen.setTrue()
  },
  {
    name: 'Create a project group',
    command: store => store.createGroup()
  },
  {
    name: 'Kill a port',
    command: store => store.killProcess()
  },
  {
    name: 'Import a project',
    command: store => store.openFolder()
  },
  {
    name: 'Go Home',
    command: store => store.router.openPage(routes.home)
  }
];

export default types
  .model('Actions', {
    opened: createModel(Boolean)
  })
  .actions(self => ({
    runAction: command => {
      const store = getRoot(self);
      if (command) {
        command(store);
      }
    }
  }));
