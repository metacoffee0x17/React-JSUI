import { types } from 'mobx-state-tree';

const Boolean = types
  .model('Boolean', {
    value: false
  })
  .actions(self => ({
    setTrue() {
      self.value = true;
    },
    setFalse() {
      self.value = false;
    },
    toggle() {
      self.value = !self.value;
    },
    setValue(value) {
      self.value = value;
    }
  }));

export default Boolean;
