import { types } from 'mobx-state-tree';
import routes from 'config/routes';
import { createModel } from 'utils/mst-utils';
import Boolean from 'models/Boolean';
import generators from 'generators';
import map from 'lodash/map';
import flatten from 'lodash/flatten';
import compact from 'lodash/compact';
import get from 'lodash/get';

const getMappedActions = actions => map(actions, ({ name, command }) => ({ name, command, id: name }));

const generatorsActions = store =>
  generators.map(g => ({
    name: `${g.description} (${g.name})`,
    command: () => {
      store.router.openPage(routes.home);
      store.setActiveGenerator(g);
    }
  }));

export const pluginsActions = store => [
  {
    name: 'Open Babel REPL',
    command: () => store.babelReplDialogOpen.setTrue()
  },
  {
    name: 'Convert CSS to css-in-js',
    command: () => store.cssConverterDialogOpen.setTrue()
  },
  {
    name: 'Kill a port',
    command: () => store.killProcess()
  }
];

export const organizeActions = store => [
  {
    name: 'Create a project group',
    command: () => store.createGroup()
  },
  {
    name: 'Import a project',
    command: () => store.openFolder()
  },
  {
    name: 'Import a VS Code workspace',
    command: () => store.openCodeWorkspace()
  }
];

export const generateActions = store => [
  {
    name: 'Generate a new project',
    command: () => {
      store.router.openPage(routes.home);
      store.generateDialogOpen.setTrue();
    }
  }
];

export const layoutActions = store => [
  {
    name: 'Toggle home sidebar',
    command: () => store.settings.toggleHomeSidebar()
  },
  {
    name: 'Toggle horizontal layout',
    command: () => store.settings.toggleHorizontalLayout()
  }
];

export const defaultActions = store => [
  {
    name: 'Go Home',
    command: () => store.router.openPage(routes.home)
  }
];

export const scriptsActions = store => {
  const scripts = get(store, 'currentProject.packageJson.scripts');
  console.log('scripts', scripts);

  if (!scripts) {
    return [];
  }

  return map(scripts, (value, scriptName) => ({
    name: `Run ${scriptName} script`,
    command: () => store.currentProject.runScript(scriptName)
  }));
};

export const webProjectActions = store => [
  {
    name: 'Open in browser',
    command: () => store.currentProject.openWebUrl()
  }
];
export const projectActions = store => [
  {
    name: 'Delete node_modules folder',
    command: () => store.currentProject.deleteNodeModulesFolder(true)
  },
  {
    name: 'Reinstall dependencies',
    command: store.currentProject.reinstallDependencies
  },
  {
    name: 'Install dependencies',
    command: store.currentProject.installDependencies
  },
  {
    name: 'Open in Finder',
    command: store.currentProject.openDir
  },
  {
    name: 'Open in code editor',
    command: store.currentProject.edit
  }
  /*{
    name: 'Install a dependency',
    command: () => {}
  },
  {
    name: 'Install a dev dependency',
    command: () => {}
  },
  {
    name: 'Apply a plugin',
    command: () => {}
  }*/
];

export const terminalActions = store => {
  const { processes } = store;
  if (processes.hasProcesses) {
    return [
      {
        name: 'Kill all processes',
        command: processes.killActiveProcesses
      },
      {
        name: 'Kill current process',
        command: () => processes.closeProcess(processes.selectedProcess)
      },
      {
        name: 'Stop current process',
        command: () => processes.selectedProcess.stop()
      },
      {
        name: 'Restart current process',
        command: () => processes.selectedProcess.restart()
      }
    ];
  }

  return [];
};

export const getActionsForPopup = store => {
  const { router } = store;

  const isInProject = router.page === routes.project.id;
  const isInWebProject = router.page === routes.webProject.id;

  const enabledActionGroups = [
    defaultActions,
    generateActions,
    generatorsActions,
    layoutActions,
    organizeActions,
    pluginsActions,
    scriptsActions,
    terminalActions,
    //depending on page
    isInProject && projectActions,
    isInWebProject && webProjectActions
  ];

  const allActions = compact(flatten(enabledActionGroups.map(a => a && a(store))));
  return getMappedActions(allActions);
};

export default types
  .model('Actions', {
    opened: createModel(Boolean)
  })
  .actions(() => ({
    runAction: command => {
      //delay command so the popup selector can be closed properly
      setTimeout(() => {
        command();
      }, 300);
    }
  }));
