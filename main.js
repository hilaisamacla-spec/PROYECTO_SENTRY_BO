const { app, session } = require('electron');
const { createLoginWindow } = require('./src/windows');

try {
  require('electron-reload')(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`)
  });
} catch (_) {}

app.whenReady().then(() => {
  // Habilitar permisos de geolocalización para Electron
  // session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
  //   if (permission === 'geolocation') {
  //     callback(true); // permitir
  //   } else {
  //     callback(false); // denegar otros permisos
  //   }
  // });

  createLoginWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
