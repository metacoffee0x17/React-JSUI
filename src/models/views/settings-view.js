import { types } from 'mobx-state-tree';
import { remote } from 'electron';
import { isEmptyString } from 'utils/string-utils';

let homepath = remote.app.getPath('home');

export default types
  .model('SettingsStore', {
    editor: 'code',
    projectsPath: types.optional(types.string, homepath),
    indexFiles: types.optional(types.boolean, false)
  })
  .actions(self => ({
    changeEditor: editor => {
      self.editor = editor;
    },
    changePath: projectsPath => {
      self.projectsPath = projectsPath;
    },
    setIndexFiles: value => {
      self.indexFiles = value;
    },
    afterCreate() {
      if (isEmptyString(self.projectsPath)) {
        self.projectsPath = homepath;
      }
    }
  }))
  .views(self => ({
    get valid() {
      return [self.editor, self.projectsPath].every(e => !isEmptyString(e));
    }
  }));
