import pick from 'lodash/pick';

import SettingsView from 'models/views/settings-view';

export const importStore = ElectronStore => {
  const { settings, ...rest } = ElectronStore.store;

  let settingsStore;

  const settingsValid = SettingsView.is(settings);

  if (settingsValid) {
    settingsStore = settings;
  } else {
    let newSettings = SettingsView.create();
    settingsStore = newSettings;
    ElectronStore.set('settings', newSettings);
  }

  return {
    settings: settingsStore,
    ...rest
  };
};

export const exportStore = store => {
  return {
    settings: store.settings,
    projects: store.projects.map(project => pick(project, ['name', 'path', 'id', 'group'])),
    groups: store.groups.map(groups => pick(groups, ['name', 'id']))
  };
};
