import { types } from 'mobx-state-tree';

//models
import Process from './Process';

export default types
  .model('Processes', {
    list: types.optional(types.array(types.reference(Process)), []),
    selectedProcess: types.maybe(types.reference(Process))
  })
  .actions(self => ({
    setActive: pid => {
      self.selectedProcess = self.list.find(p => p.id === pid);
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
    }
  }))
  .views(self => ({
    get hasRunning() {
      return self.hasProcesses && self.list.some(p => p.running);
    },
    get hasProcesses(){
      return self.list.length > 0;
    }
  }));
