const { SHORTCUTS } = require('./enums');

const buildMenu = ({
  config: { appName },
  methods: { resetCache, editCache, importConfig, exportConfig, callShortcut }
}) => {
  return [
    {
      label: appName,
      submenu: [
        {
          label: 'Preferences',
          accelerator: 'CmdOrCtrl+,',
          click: () => callShortcut(SHORTCUTS.OPEN_SETTINGS)
        },
        {
          label: 'Actions',
          accelerator: 'CmdOrCtrl+Shift+A',
          click: () => callShortcut(SHORTCUTS.OPEN_ACTIONS)
        },
        {
          label: 'Go Home',
          accelerator: 'CmdOrCtrl+Shift+H',
          click: () => callShortcut(SHORTCUTS.GO_HOME)
        },
        {
          label: 'Search projects',
          accelerator: 'CmdOrCtrl+Shift+P',
          click: () => callShortcut(SHORTCUTS.OPEN_PROJECTS)
        },
        { type: 'separator' },
        { role: 'about' },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Settings',
      submenu: [
        {
          label: 'Reset app cache',
          click() {
            resetCache();
          }
        },
        {
          label: 'Edit app cache',
          click() {
            editCache();
          }
        },
        { type: 'separator' },
        {
          label: 'Import config',
          click() {
            importConfig();
          }
        },
        {
          label: 'Export config',
          click() {
            exportConfig();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [{ role: 'reload' }, { role: 'forcereload' }]
    },
    {
      role: 'window',
      submenu: [
        { role: 'close' },
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' }
      ]
    }
  ];
};

module.exports = buildMenu;
