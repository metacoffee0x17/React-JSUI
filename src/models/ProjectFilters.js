import { types } from 'mobx-state-tree';

import { createModel } from 'utils/mst-utils';
import ToggleArray from './ToggleArray';
import String from './String';

export default types
  .model('ProjectFilters', {
    searchText: createModel(String, { value: '' }),
    hiddenGroups: createModel(ToggleArray),
    hiddenPrivacyTypes: createModel(ToggleArray),
    hiddenRepoTypes: createModel(ToggleArray),
    selectedDependencies: createModel(ToggleArray)
  })
  .actions(self => ({
    setSearch: s => {
      self.searchText = s;
    },
    resetFilters: () => {
      // self.pickedTags.reset();
      // self.pickedDependencies.reset();
    }
  }));
