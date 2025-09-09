const { ipcMain } = require('electron');
const { createMainWindow } = require('./windows');

ipcMain.on('login-success', () => {
  createMainWindow();
});
