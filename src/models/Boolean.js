import { types } from 'mobx-state-tree';

const Boolean = types
  .model('Boolean', {
    value: false
  })
  .actions(self => ({
    setTrue() {
      console.log('set true');
      self.value = true;
    },
    setFalse() {
      console.log('set false');
      self.value = false;
    },
    toggle() {
      console.log('set toggle');
      self.value = !self.value;
    },
    setValue(value) {
      console.log('setting value to', value);
      self.value = value;
    }
  }));

export default Boolean;
