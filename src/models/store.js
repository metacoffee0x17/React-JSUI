import { flow, getRoot, types } from 'mobx-state-tree';
//swal
import Swal from 'sweetalert2';
import { toast } from 'config/swal';
import { confirmDelete, prompt } from 'config/swal';

//utils
import { compact, uniqBy, pick, countBy, groupBy, orderBy } from 'lodash';

//models
import Group from './Group';
import Project from './Project';
import Process from './Process';
import File from './File';
import Actions from './actions';
//stores
import SettingsView from 'models/views/settings-view';
import HomeView from 'models/views/home-view';

import { RouterStore } from 'rttr';
//electron
import ipcc from 'ipcc/renderer';
import Processes from 'models/Processes';
import Boolean from 'models/Boolean';
import { createModel, whatever } from 'utils/mst-utils';
import { PACKAGE_REGISTRY_URL } from 'config/urls';
import { IMPORT_WORKSPACE_TYPES } from 'config/enums';
import { getLastFromString } from 'utils/string-utils';

//native
const fkill = window.require('electron').remote.require('fkill');
const fs = window.require('fs');
const path = window.require('path');

export default types
  .model('Store', {
    firstLoad: true,
    groups: types.optional(types.array(Group), []),
    projects: types.optional(types.array(Project), []),
    router: types.optional(RouterStore, {}),
    openedFile: types.maybe(File),
    settings: types.optional(SettingsView, {}),
    home: types.optional(HomeView, {}),
    processes: types.optional(Processes, Processes.create()),
    addingProjectToGroup: types.maybe(types.reference(Project)),
    activeGenerator: whatever(null),
    importingWorkspace: whatever(null),

    //booleans
    settingsOpened: createModel(Boolean),
    searchOpened: createModel(Boolean),
    actionsOpened: createModel(Boolean),
    cssConverterDialogOpen: createModel(Boolean),
    babelReplDialogOpen: createModel(Boolean),
    actions: createModel(Actions),
    generateDialogOpen: createModel(Boolean)
  })
  .actions(self => {
    return {
      killProcess: async () => {
        const { value: port } = await prompt('Kill port', 'Port');
        if (port) {
          fkill(`:${port}`)
            .then(() =>
              Swal({
                title: `Port ${port} was successfully killed.`,
                type: 'success'
              })
            )
            .catch(() =>
              Swal({
                title: 'Error',
                text: `Couldn't kill port ${port}.`,
                type: 'error'
              })
            );
        }
      },
      addProjectToGroup: project => {
        self.addingProjectToGroup = project;
      },
      bulkImport: flow(function*() {
        const ignored = ['node_modules'];
        const folderName = yield ipcc.callMain('open-dialog');

        let entries = fs.readdirSync(folderName);

        const foldersWithPackageJson = entries.filter(entry => {
          if (ignored.includes(entry)) {
            return false;
          }
          let folderPath = path.join(folderName, entry);
          let isFolder = fs.lstatSync(folderPath).isDirectory();
          if (isFolder) {
            const packageJsonExists = fs.existsSync(path.join(folderName, entry, 'package.json'));
            if (packageJsonExists) {
              return true;
            }
          }
        });

        if (foldersWithPackageJson.length > 1) {
          let groupName = getLastFromString(folderName, '/');
          const group = Group.create({ name: groupName });
          self.groups.push(group);
          foldersWithPackageJson.forEach(folder => {
            let folderPath = path.join(folderName, folder);
            const newProject = Project.create({
              name: getLastFromString(folderPath, '/'),
              path: folderPath,
              group
            });
            self.addNewProject(newProject);
          });
        }
      }),
      closeFile: () => {
        self.openedFile = null;
      },
      setOpenedFile: filePath => {
        const content = fs.readFileSync(filePath, 'utf8');
        self.openedFile = {
          content
        };
      },
      pickGroupForProject: group => {
        self.addingProjectToGroup.group = group.id;
        self.addingProjectToGroup = null;
      },
      addNewProject: project => {
        if (self.groups.length === 0) {
          self.groups.push({ id: 'other', name: 'Others', projects: [] });
        }

        if (!project.group) {
          let othersGroup = self.groups.find(g => g.id === 'other');
          project.setGroup(othersGroup);
        }

        self.projects.push(project);
      },
      openCodeWorkspace: flow(function*() {
        const workspacePath = yield ipcc.callMain('open-dialog', {
          properties: ['openFile'],
          filters: [{ name: 'Custom File Type', extensions: ['code-workspace'] }]
        });
        if (workspacePath) {
          self.importingWorkspace = JSON.parse(fs.readFileSync(workspacePath, 'utf8'));
        }
      }),
      importWorkspace: flow(function*({ type, groupName }) {
        switch (type) {
          case IMPORT_WORKSPACE_TYPES.SEPARATELY: {
            self.importingWorkspace.folders.forEach(folder => {
              const project = Project.create({
                name: getLastFromString(folder.path, '/'),
                path: folder.path
              });
              self.addNewProject(project);
            });
            break;
          }
          case IMPORT_WORKSPACE_TYPES.GROUP: {
            const group = Group.create({ name: groupName });
            self.groups.push(group);

            self.importingWorkspace.folders.forEach(folder => {
              const project = Project.create({
                name: getLastFromString(folder.path, '/'),
                path: folder.path,
                group: group
              });
              self.addNewProject(project);
            });
            break;
          }
        }

        self.importingWorkspace = false;

        toast({
          type: 'success',
          title: 'Successfully added the workspace!'
        });
      }),
      cancelImportingWorkspace: () => {
        self.importingWorkspace = null;
      },
      openFolder: flow(function*(groupId) {
        const folderName = yield ipcc.callMain('open-dialog');
        const splitted = folderName.split('/');
        const group = groupId && typeof groupId !== 'object' && self.groups.find(g => g.id === groupId);

        let createdProject = Project.create({
          name: splitted[splitted.length - 1],
          path: folderName,
          ...(group ? { group } : {})
        });

        self.addNewProject(createdProject);
      }),
      createGroup: flow(function*() {
        const { value: name } = yield prompt('Group title');
        if (name) {
          self.groups.push(
            Group.create({
              name
            })
          );
        }
      }),
      removeProject: flow(function*(projectId) {
        const confirmed = yield confirmDelete(
          'Are you sure?',
          `This will only remove the project from the dashboard, it won't delete any files on disk.`
        );

        if (confirmed) {
          self.projects = self.projects.filter(p => p.id !== projectId);
        }
      }),
      renameProject: flow(function*(projectId, projectName) {
        const project = self.projects.find(({ id }) => id === projectId);
        if (project === undefined) return;
        const { value: name } = yield prompt('Rename project', undefined, {
          inputValue: projectName
        });
        if (name) {
          project.setName(name);
        }
      }),
      renameGroup: flow(function*(groupName, groupId) {
        const { value: name } = yield prompt('Rename group', undefined, {
          inputValue: groupName
        });
        if (name) {
          const group = self.groups.find(g => g.id === groupId);
          group.setName(name);
        }
      }),
      deleteGroup: flow(function*(groupId) {
        const confirmed = yield confirmDelete(
          'Are you sure?',
          `This will also remove all the projects in the group. It won't delete anything on disk!`
        );
        if (confirmed) {
          self.projects = self.projects.filter(p => {
            if (groupId === 'other' || groupId === null) {
              return p.group !== null && p.group.id !== 'other';
            }
            return p.group ? p.group.id !== groupId : true;
          });
          self.groups = self.groups.filter(g => g.id !== groupId);
        }
      }),
      createProject: flow(function* createProject({ path, name, cli, cliName = cli, argz }) {
        const commandExists = yield ipcc.callMain('command-exists', cli);

        if (!commandExists) {
          self.home.clearActiveGenerator();

          const { value } = yield Swal({
            title: `The ${cli} CLI is not installed on your machine. Do you want to install it?`,
            type: 'warning',
            showCancelButton: true
          });

          if (value === true) {
            const newProcess = Process.create();
            self.processes.add(newProcess);
            newProcess.attach(`npm`, ['install', cliName, '-g']);
          }

          return false;
        }

        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
        }

        const newProcess = Process.create();

        const newProject = Project.create({
          name,
          path: `${path}${path[path.length - 1] === '/' ? '' : '/'}${name}`,
          ready: false
        });

        self.addNewProject(newProject);
        self.processes.add(newProcess);

        const resultCode = yield newProcess.attach(cli, argz, path);

        if (resultCode === 0) {
          newProject.setReady(true);
        } else {
          self.projects = self.projects.filter(p => p.path !== newProject.path);
        }
      }),
      setActiveGenerator: generator => {
        self.generateDialogOpen.setFalse();
        self.activeGenerator = generator;
      },
      clearActiveGenerator: () => {
        self.activeGenerator = null;
      },
      runCliGenerator: formValues => {
        const store = getRoot(self);
        const command = self.activeGenerator.getForProcess(formValues);
        store.createProject(command);
        self.clearActiveGenerator();
      },
      goToDependencyPage: dependencyName => {
        const shell = window.require('electron').shell;
        shell.openExternal(`${PACKAGE_REGISTRY_URL}${dependencyName}`);
      }
    };
  })
  .views(self => ({
    get collapsed() {
      return !!self.addingProjectToGroup;
    },
    get filteredProjects() {
      return self.projects;
    },
    get currentDependencies() {
      let allDependencies = self.filteredProjects.reduce((accum, project) => {
        let dependencies =
          project.packageJson && project.packageJson.dependencies
            ? Object.entries({
                ...project.packageJson.dependencies,
                ...project.packageJson.devDependencies
              }).map(([a]) => a)
            : [];
        accum = [...accum, ...dependencies];
        return accum;
      }, []);

      const grouped = Object.entries(countBy(allDependencies)).map(([name, count]) => ({ name, count }));
      const unique = uniqBy(grouped, a => a.name);
      const sorted = orderBy(unique, ['count'], ['desc']);
      return sorted;
    },
    get hasProjects() {
      return self.groupsWithProjects && self.groupsWithProjects.length > 0;
    },
    get showWelcomeScreen() {
      return self.projects.length === 0 && self.groups.length === 0;
    },
    get allProjects() {
      const projectsFromGroups = self.groups.reduce((accum, group) => {
        accum = [...accum, ...group.projects];
        return accum;
      }, []);
      return [...projectsFromGroups, ...self.projects];
    },
    get currentProject() {
      if (self.router.page === 'project') {
        return self.projects.find(project => project.id === self.router.params.id);
      }
    },
    get canMoveProject() {
      return self.groups.length > 1;
    },
    get groupsWithProjects() {
      const grouped = groupBy(self.projects, p => (p.group ? p.group.id : 'other'));
      return compact(
        [...self.groups].map(group => {
          if (!group) {
            return null;
          }
          return {
            ...group,
            projects: grouped[group.id] || []
          };
        })
      );
    }
  }));
