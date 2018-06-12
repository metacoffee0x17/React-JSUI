import routes from 'config/routes';

//todo: share enums with electron folder
const SHORTCUTS = {
  OPEN_SETTINGS: 'open-settings',
  OPEN_ACTIONS: 'open-actions',
  OPEN_PROJECTS: 'open-projects',
  GO_HOME: 'go-home'
};

const actions = {
  [SHORTCUTS.OPEN_ACTIONS]: store => store.actions.opened.setTrue(),
  [SHORTCUTS.OPEN_SETTINGS]: store => store.settingsOpened.setTrue(),
  [SHORTCUTS.GO_HOME]: store => store.router.openPage(routes.home),
  [SHORTCUTS.OPEN_PROJECTS]: store => {
    if (store.hasProjects) {
      store.searchOpened.setTrue();
    }
  }
};

export const executeShortcut = (shortcut, store) => {
  actions[shortcut](store);
};
