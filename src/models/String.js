import { types } from 'mobx-state-tree';

export default types
  .model('String', {
    value: types.maybe(types.string)
  })
  .actions(self => ({
    clear() {
      self.value = undefined;
    },
    setValue(s) {
      self.value = s;
    }
  }))
  .views(self => ({
    get hasValue() {
      return self.value && self.value.trim() !== '';
    }
  }));
