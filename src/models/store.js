import { flow, getRoot, types } from 'mobx-state-tree';
import ipcc from 'ipcc/renderer';
import pify from 'pify';

//config
import { PACKAGE_REGISTRY_URL } from 'config/urls';
import { IMPORT_WORKSPACE_TYPES, PROJECT_PRIVACY, PROJECT_REPO } from 'config/enums';

//swal
import Swal from 'sweetalert2';
import { toast } from 'config/swal';
import { confirmDelete, prompt } from 'config/swal';

//utils
import { compact, uniqBy, pick, countBy, groupBy, orderBy, get } from 'lodash';
import { createModel, whatever } from 'utils/mst-utils';
import { getLastFromString, includesLowercase } from 'utils/string-utils';

//models
import Group from './Group';
import Project from './Project';
import Process from './Process';
import File from './File';
import Actions from './actions';
import Processes from './Processes';
import Boolean from './Boolean';
import String from './String';
import ProjectFilters from 'models/ProjectFilters';

//stores
import SettingsView from 'models/views/settings-view';
import HomeView from 'models/views/home-view';
import { RouterStore } from 'rttr';
import routes from 'config/routes';
import { getSvnUrl } from 'utils/github-utils';

//native
const { remote } = window.require('electron');
const fkill = remote.require('fkill');
const rimraf = remote.require('rimraf');
const fs = window.require('fs');
const path = window.require('path');

export default types
  .model('Store', {
    //data
    groups: types.optional(types.array(Group), []),
    projects: types.optional(types.array(Project), []),

    //other
    firstLoad: true,
    router: types.optional(RouterStore, {}),
    openedFile: types.maybe(File),
    settings: types.optional(SettingsView, {}),
    home: types.optional(HomeView, {}),
    addingProjectToGroup: types.maybe(types.reference(Project)),
    activeGenerator: whatever(null),
    importingWorkspace: whatever(null),
    projectFilters: createModel(ProjectFilters),
    processes: createModel(Processes),

    //booleans
    settingsOpened: createModel(Boolean),
    searchOpened: createModel(Boolean),
    importingWebUrl: createModel(Boolean),
    actionsOpened: createModel(Boolean),
    cssConverterDialogOpen: createModel(Boolean),
    babelReplDialogOpen: createModel(Boolean),
    actions: createModel(Actions),
    generateDialogOpen: createModel(Boolean),
    importingGithubUrl: createModel(Boolean),
    focused: createModel(Boolean, { value: true })
  })
  .actions(self => {
    return {
      createNotification: (title, body = title, options = { type: 'success' }, cb) => {
        const { type } = options;
        if (self.focused.value === true) {
          if (!body) {
            toast({ title: `${title} ${body}`, type });
          }
        } else {
          let myNotification = new Notification(title, {
            body
          });
          if (cb) {
            myNotification.onclick = () => cb;
          }
        }
      },
      importWebProject: flow(function*({ name, url }) {
        self.importingWebUrl.setFalse();
        const newProject = Project.create({
          name,
          webUrl: url,
          isWebBased: true
        });
        self.projects.push(newProject);
      }),
      importGithubUrl: flow(function*(formValues) {
        const { name, url, installDependencies, keepGit, isSpecificFolder } = formValues;

        self.importingGithubUrl.setFalse();

        const downloadPath = path.join(self.settings.projectsPath, name);

        const newProject = Project.create({
          name,
          path: downloadPath,
          ready: !installDependencies
        });

        self.projects.push(newProject);
        self.router.openPage(routes.project, { id: newProject.id });

        const newProcess = Process.create({
          project: newProject
        });

        self.processes.add(newProcess);

        if (isSpecificFolder) {
          try {
            const svnUrlOfDir = getSvnUrl(url);
            yield newProcess.attach(`svn`, ['checkout', svnUrlOfDir, downloadPath]);
          } catch (err) {
            console.error(err);
          }
        } else {
          try {
            yield newProcess.attach(`git`, ['clone', url, downloadPath]);
          } catch (err) {
            console.error(err);
          }
        }

        self.createNotification('Done!', `The project ${name} has been cloned from GitHub!`, {
          type: 'success'
        });

        if (!keepGit && !isSpecificFolder) {
          yield pify(rimraf)(path.join(downloadPath, '.git'));
        }

        newProject.setReady(true);

        if (installDependencies) {
          if (!fs.existsSync(path.join(downloadPath, 'package.json'))) {
            toast({
              title: `No dependencies found for ${name}.`,
              type: 'warning'
            });
          } else {
            yield newProcess.attach(`yarn`, ['install'], downloadPath);
            self.createNotification('Done!', `Dependencies for project ${name} have been installed!`, {
              type: 'success'
            });
          }
        }
      }),
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

        if (!folderName) {
          return null;
        }

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
      },
      startAllInCurrentGroup: () => {
        self.currentGroup.projects.forEach(project => project.start());
      },
      navigateToGroupAndStartAll: id => {
        if (id) {
          self.router.openPage(routes.group, { id });
        }
        setTimeout(() => {
          self.startAllInCurrentGroup();
        }, 250);
      }
    };
  })
  .views(self => ({
    get collapsed() {
      return !!self.addingProjectToGroup;
    },
    get filteredGroups() {
      return self.groups.filter(group => !self.projectFilters.hiddenGroups.items.includes(group.id));
    },
    get hasProjects() {
      return self.projects.length > 0;
    },
    get filteredProjects() {
      const { searchText, hiddenRepoTypes, hiddenPrivacyTypes, selectedDependencies } = self.projectFilters;
      return self.projects.filter(project => {
        const rules = [
          includesLowercase(project.name, searchText.value),
          hiddenRepoTypes.items.every(repoType => {
            if (repoType === PROJECT_REPO.NO_REPO) {
              return !!project.origin;
            }
            return project.origin ? !project.origin.includes(repoType.toLowerCase()) : true;
          }),
          selectedDependencies.items.every(dependency => {
            return (
              project.packageJson &&
              project.packageJson.dependencies &&
              !!project.packageJson.dependencies[dependency]
            );
          }),
          hiddenPrivacyTypes.items.every(privacyType => {
            const isPrivate = get(project, 'packageJson.private');
            return isPrivate !== (privacyType === PROJECT_PRIVACY.PRIVATE);
          })
        ];
        return rules.every(r => r === true);
      });
    },
    get currentDependencies() {
      let allDependencies = self.filteredProjects.reduce((accum, project) => {
        let dependencies =
          project.packageJson && project.packageJson.dependencies
            ? Object.entries({
                ...project.packageJson.dependencies
              }).map(([a]) => a)
            : [];
        accum = [...accum, ...dependencies];
        return accum;
      }, []);

      const grouped = Object.entries(countBy(allDependencies)).map(([name, count]) => ({ name, count }));
      const unique = uniqBy(grouped, a => a.name);
      const sorted = orderBy(unique, ['count', 'name'], ['desc', 'asc']);
      return sorted;
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
      if (self.router.page === routes.project.id || self.router.page === routes.webProject.id) {
        return self.projects.find(project => project.id === self.router.params.id);
      }
    },
    get currentGroup() {
      if (self.router.page === routes.group.id) {
        let group = self.groups.find(groups => groups.id === self.router.params.id);
        const projects = self.projects.filter(project => project.group && project.group.id === group.id);

        return {
          ...group,
          projects: projects || []
        };
      }
    },
    get canMoveProject() {
      return self.groups.length > 1;
    },
    get groupsWithProjects() {
      const groupedProjects = groupBy(self.filteredProjects, p => (p.group ? p.group.id : 'other'));

      return compact(
        [...self.filteredGroups].map(group => {
          if (!group) {
            return null;
          }
          return {
            ...group,
            projects: groupedProjects[group.id] || []
          };
        })
      );
    }
  }));
