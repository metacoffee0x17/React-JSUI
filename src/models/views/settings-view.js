import { types } from 'mobx-state-tree';
import { remote } from 'electron';
import { isEmptyString } from 'utils/string-utils';

let homepath = remote.app.getPath('home');

export default types
  .model('SettingsStore', {
    editor: 'code',
    projectsPath: types.optional(types.string, homepath),
    indexFiles: types.optional(types.boolean, false),
    highlightProjectsWithoutRepo: types.optional(types.boolean, false),
    showHomeSidebar: types.optional(types.boolean, true),
    horizontalLayout: types.optional(types.boolean, true)
  })
  .actions(self => ({
    changeEditor: editor => {
      self.editor = editor;
    },
    setShowHomeSidebar: value => {
      self.showHomeSidebar = value;
    },
    setHorizontalLayout: value => {
      self.horizontalLayout = value;
    },
    changePath: projectsPath => {
      self.projectsPath = projectsPath;
    },
    toggleHomeSidebar: () => {
      self.showHomeSidebar = !self.showHomeSidebar;
    },
    setIndexFiles: value => {
      self.indexFiles = value;
    },
    setHighlightProjectsWithoutRepo: value => {
      self.highlightProjectsWithoutRepo = value;
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
