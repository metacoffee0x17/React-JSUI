import { PROJECT_TAGS } from 'config/enums';
import { types, getRoot, flow } from 'mobx-state-tree';
import ipcc from 'ipcc/renderer';
import { prompt, confirmDelete } from 'config/swal';
import { toast } from 'config/swal';
import axios from 'axios';
import routes from 'config/routes';

//utils
import get from 'lodash/get';
import omitBy from 'lodash/omitBy';
import omit from 'lodash/omit';
import { getProjectType } from 'project-utils/get-project-type';
import { getHttpsGitURL } from 'utils/string-utils';
import uuid from 'uuid';
import gitBranch from 'utils/git-branch';
// import nodePlop from 'node-plop';

//models
import Tab from './Tab';
import Group from './Group';
import Process from './Process';

//native
import getFoldersAsObjects from 'utils/file-utils/get-folders-as-objects';
import getAllItems from 'utils/file-utils/get-all-items';

//native
const fs = window.require('fs');
const path = window.require('path');
const { spawn } = window.require('child_process');
const parseGitConfig = window.require('electron').remote.require('parse-git-config');
const which = window.require('electron').remote.require('which');
const nodePlop = window.require('electron').remote.require('node-plop');

const Generator = types.model({
  name: types.string,
  description: types.string
});

export default types
  .model('Project', {
    id: types.optional(types.identifier(), () => uuid.v4()),
    group: types.maybe(types.reference(Group)),
    generatorList: types.optional(types.array(Generator), []),
    name: '',
    path: '',
    type: '',
    //frozen
    packageJson: types.frozen,
    gitConfig: types.frozen,
    gitBranch: types.frozen,
    contents: types.frozen,
    allItems: types.optional(types.frozen, []),
    tabs: types.optional(types.array(Tab), []),
    ready: true
  })
  .actions(self => {
    let plop;

    return {
      edit: async () => {
        const store = getRoot(self);
        const editorExists = await ipcc.callMain('command-exists', store.settings.editor);
        if (editorExists) {
          const editor = which.sync(store.settings.editor);
          spawn(editor, ['.'], { cwd: self.path });
        } else {
          toast({
            type: 'error',
            title: `The cli "${store.settings.editor}" couldn't be found. Please make sure it's installed.`
          });
        }
      },
      setName: name => {
        self.name = name;
      },
      setReady: ready => {
        self.ready = ready;
        if (ready === true) {
          self.readProjectInfo();
        }
      },
      openDir: () => {
        const shell = window.require('electron').shell;
        shell.openExternal(self.path);
      },
      build: () => {
        self.runScript('build');
      },
      installDependency: flow(function*(formValues) {
        if (!formValues) {
          return null;
        }
        const { name, version, isDev = false } = formValues;

        if (name) {
          yield self.runScript('add', [`${name}${version ? `@${version}` : ''}`, isDev ? '--dev' : '--prod']);
          self.readProjectInfo();
        }
      }),
      deleteDependency: flow(function*(name) {
        const confirm = yield confirmDelete();
        if (confirm) {
          yield self.runScript('remove', [name]);
          self.readProjectInfo();
        }
      }),
      upgradeDependency: flow(function*(name) {
        self.runScript('upgrade', [`${name}@latest`]);
      }),
      setGroup(group) {
        self.group = group;
      },
      moveDependency: flow(function*(name, version, isDev) {
        const packageJson = self.packageJson;
        const keys = isDev ? ['devDependencies', 'dependencies'] : ['dependencies', 'devDependencies'];
        const [moveFrom, moveTo] = keys;
        const newPackageJson = {
          ...packageJson,
          [moveFrom]: omit(packageJson[moveFrom], [name]),
          [moveTo]: {
            ...packageJson[moveTo],
            [name]: version
          }
        };
        self.packageJson = newPackageJson;
        const pkgPath = path.join(self.path, 'package.json');
        fs.writeFileSync(pkgPath, JSON.stringify(newPackageJson, null, 2));
      }),

      generate: flow(function*(generatorName) {
        const { value: name } = yield prompt('Name');
        if (name) {
          try {
            yield ipcc.callMain('run-plop-generator', {
              generatorName,
              actions: { name },
              projectPath: self.path
            });
            toast({
              title: `Successfully generated "${name}"!`,
              type: 'success'
            });
            self.readContents();
          } catch (err) {
            toast({
              title: `Couldn't generate file. Please try again.`,
              type: 'error'
            });
          }
        }
      }),
      showPluginSuccess(name) {
        toast({
          title: `The plugin "${name}" has been successfully applied!`,
          type: 'success'
        });
      },
      applyPlugin: flow(function*(plugin) {
        if (plugin.actions) {
          yield ipcc.callMain('apply-plugin-actions', {
            actions: plugin.actions,
            dir: plugin.dir,
            projectPath: self.path
          });
          self.readProjectInfo();
          self.readContents();
        }

        const packageModify = plugin.packageModify;

        if (!packageModify) {
          self.showPluginSuccess(plugin.name);
          return false;
        }

        const {
          addScripts = [],
          removeScripts = [],
          addDependencies = [],
          addDevDependencies = [],
          removeDependencies = [],
          merge = {}
        } = packageModify;

        const { scripts, ...rest } = self.packageJson;

        const newPackageJson = {
          ...rest,
          scripts: {
            ...omitBy(scripts, removeScripts),
            ...addScripts
          },
          ...merge
        };

        const pkgPath = path.join(self.path, 'package.json');

        fs.writeFileSync(pkgPath, JSON.stringify(newPackageJson, null, 2));

        self.readProjectInfo();

        if (removeDependencies.length > 0) {
          yield self.addProcess('yarn', ['remove', ...removeDependencies]);
        }
        if (addDependencies.length > 0) {
          yield self.addProcess('yarn', ['add', ...addDependencies]);
        }
        if (addDevDependencies.length > 0) {
          yield self.addProcess('yarn', ['add', ...addDevDependencies, '--dev']);
        }

        self.showPluginSuccess(plugin.name);
      }),
      runScript: (scriptName, extraArgs = []) => {
        return self.addProcess('yarn', [scriptName, ...extraArgs]);
      },
      addProcess: async (cli, args) => {
        const store = getRoot(self);

        const proc = Process.create({
          project: self
        });

        proc.attachStore(store);

        const prom = proc.attach(cli, args, self.path);
        store.processes.add(proc);
        prom.then(self.readProjectInfo);
        return prom;
      },
      /*deleteDependencies: () => {
        exec(bashCommands.deleteDependencies, { cwd: self.path });
      },
      installDependencies: () => {
        exec(bashCommands.installDependencies, { cwd: self.path });
      },
      reinstallDependencies: () => {
        /!* execMultiple(
          [bashCommands.deleteDependencies, bashCommands.installDependencies],
          self.path
        );*!/
      },*/
      start: () => self.runScript(self.startScriptName || 'start'),
      navigateThenStart: () => {
        const store = getRoot(self);
        store.router.openPage(routes.project, { id: self.id });
        setTimeout(() => {
          self.start();
        }, 250);
      },
      goToOrigin: () => {
        const shell = window.require('electron').shell;
        shell.openExternal(self.origin);
      },
      previewFile: () => {
        const store = getRoot(self);
        let openedFilePath = path.join(self.path, 'package.json');
        store.setOpenedFile(openedFilePath);
      },
      clone: async () => {
        const dialog = await ipcc.callMain('open-dialog');
      },
      closeFile: () => {
        self.openedFile = null;
      },
      readContents: () => {
        const store = getRoot(self);
        if (store.settings.indexFiles === true) {
          try {
            self.contents = getFoldersAsObjects(self.path);
            self.allItems = getAllItems(self.path).map(i => ({
              ...i,
              projectPath: i.path.replace(`${self.path}/`, '')
            }));
          } catch (err) {
            console.error(err);
          }
        }
      },
      fetchGithubInfo: flow(function*(gitRepo) {
        const result = yield axios.get('https://api.github.com/repos/kitze/jsui');
        console.log('result, result', result);
      }),
      readProjectInfo: () => {
        const packageJsonPath = path.join(self.path, 'package.json');

        try {
          plop = nodePlop(path.join(self.path, 'plopfile.js'));
          let generators = plop.getGeneratorList();
          self.generatorList = generators.map(({ description, name }) => ({ name, description }));
        } catch (err) {
          console.log('err', err);
          self.generatorList = [];
        }

        try {
          self.packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
          self.type = getProjectType(self.packageJson);
          self.startScriptName = ['start', 'dev', 'develop'].find(s => self.packageJson.scripts[s]);

          //origin
          const gitConfigPath = path.join(self.path, '.git/config');
          const gitConfig = parseGitConfig.sync({
            cwd: 'foo',
            path: gitConfigPath
          });
          const url = get(gitConfig, 'remote "origin".url') || '';
          const gitRepoURL = getHttpsGitURL(url);
          self.origin = gitRepoURL;
        } catch (err) {
          console.error(err);
          self.type = PROJECT_TAGS.UNKNOWN;
        }

        try {
          self.gitBranch = gitBranch(self.path);
        } catch (err) {
          console.error(err);
        }
      },
      afterCreate() {
        self.readProjectInfo();
      }
    };
  });
