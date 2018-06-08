const electron = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { app, BrowserWindow } = electron;

const localUrl = 'http://localhost:3000';
const buildUrl = `file://${path.join(__dirname, '../build/index.html')}`;
const appUrl = isDev ? localUrl : buildUrl;

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({ width: 1200, height: 800 });
  mainWindow.loadURL(appUrl);
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
};

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow();
  }
});
