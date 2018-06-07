const { ipcRenderer: ipc } = window.require('electron');

export const bridge = {
  changeTitle: title => ipc.send('changeTitle', title),
  getMb: () => ipc.send('getMb'),
  openDialog: () => ipc.send('openDialog')
};
