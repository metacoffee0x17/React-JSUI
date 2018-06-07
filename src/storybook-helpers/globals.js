window.require = () => ({
  ipcRenderer: () => {},
  remote: {
    require: () => {}
  }
});
