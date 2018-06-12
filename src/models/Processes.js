import { types, getRoot } from 'mobx-state-tree';
import { reaction } from 'mobx';

//models
import Process from './Process';
import routes from 'config/routes';

export default types
  .model('Processes', {
    list: types.optional(types.array(types.reference(Process)), []),
    selectedProcess: types.maybe(types.reference(Process))
  })
  .actions(self => {
    let cancelReaction;

    return {
      setActive: pid => {
        self.selectedProcess = self.list.find(p => p.id === pid);
      },
      killActiveProcesses: () => {
        self.activeForPage.forEach(process => {
          process.stop();
          self.list = [];
          self.selectedProcess = null;
        });
      },
      closeProcess: process => {
        process.stop();
        self.list = self.list.filter(p => p.id !== process.id);
        self.selectedProcess = self.list.length > 0 ? self.list[0] : null;
      },
      isActive: process => {
        return self.selectedProcess.id === process.id;
      },
      add: process => {
        self.list.push(process);
        self.selectedProcess = process;
      },
      findActive: id => self.activeForPage.find(p => p.id === id),
      findInList: id => self.list.find(p => p.id === id),
      afterCreate() {
        /*
          When the user navigates to home/project/group the list of processes will change.
          If the currently selected process is not selected, the first process in the group should be selected.
        */
        cancelReaction = reaction(
          () => self.activeForPage,
          activeForPage => {
            if (activeForPage.length !== self.activeForPage) {
              let processIsFound = self.findInList(self.selectedProcess.id);
              let processIsFoundOnpage = self.findActive(self.selectedProcess.id);
              if (processIsFound && !processIsFoundOnpage) {
                self.setActive(self.activeForPage[0].id);
              }
            }
          }
        );
      },
      beforeDestroy() {
        cancelReaction();
      }
    };
  })
  .views(self => ({
    get hasRunning() {
      return self.hasProcesses && self.activeForPage.some(p => p.running);
    },
    get hasProcesses() {
      return self.activeForPage.length > 0;
    },
    get activeForPage() {
      const store = getRoot(self);
      const { router } = store;

      if (router.page === routes.project.id) {
        return self.list.filter(p => p.project.id === router.params.id);
      }
      if (router.page === routes.group.id) {
        return self.list.filter(process => {
          let group = store.groups.find(g => g.id === router.params.id);
          const allProjectIdsInGroup = store.projects
            .filter(p => p.group && p.group.id === group.id)
            .map(p => p.id);
          return process.project && allProjectIdsInGroup.includes(process.project.id);
        });
      } else {
        return self.list.filter(p => !p.project);
      }
    }
  }));
