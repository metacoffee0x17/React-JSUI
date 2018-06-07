import { types, getRoot } from 'mobx-state-tree';
import { createModel, whatever } from 'utils/mst-utils';
import Boolean from 'models/Boolean';

export default types
  .model('Home', {
    activeGenerator: whatever(null),
    generateDialogOpen: createModel(Boolean)
  })
  .actions(self => ({
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
    }
  }));
