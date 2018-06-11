import { types, getRoot } from 'mobx-state-tree';
import routes from 'config/routes';
import { createModel } from 'utils/mst-utils';
import Boolean from 'models/Boolean';
import generators from 'generators';

const generatorsActions = generators.map(g => ({
  name: `${g.description} (${g.name})`,
  command: store => {
    store.router.openPage(routes.home);
    store.setActiveGenerator(g);
  }
}));

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
    command: store => {
      store.router.openPage(routes.home);
      store.generateDialogOpen.setTrue();
    }
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
  },
  {
    name: 'Import a VS Code workspace',
    command: store => store.openCodeWorkspace()
  },
  {
    name: 'Toggle home sidebar',
    command: store => store.settings.toggleHomeSidebar()
  },
  {
    name: 'Toggle horizontal layout',
    command: store => store.settings.toggleHorizontalLayout()
  },
  ...generatorsActions
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
