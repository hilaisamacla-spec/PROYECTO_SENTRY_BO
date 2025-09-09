const { BrowserWindow, Menu, ipcMain, app } = require('electron');
const path = require('path');

let loginWindow;
let mainWindow;

function createLoginWindow() {
  Menu.setApplicationMenu(null);

  loginWindow = new BrowserWindow({
    width: 400,
    height: 580,
    resizable: false,
    frame: false,
    title: "SENTRY - BO",
    icon: path.join(__dirname, 'logo.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "../preload.js")
    }
  });

  loginWindow.loadFile(path.join(__dirname, 'index.html'));

  // Eventos IPC
  ipcMain.on('login-exitoso', (event, uid) => {
    console.log('Usuario autenticado UID:', uid);
    createMainWindow();
  });

  ipcMain.on('cerrar-aplicacion', () => {
    app.quit();
  });

  ipcMain.on('login-error', (e, msg) => {
    console.log("Error en login:", msg);
  });
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    fullscreen: true,
    title: "SENTRY - BO - Plataforma Operativa",
    icon: path.join(__dirname, 'logo.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload.js')
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'plataforma.html'));
   mainWindow.webContents.openDevTools();

  // Cierra la ventana de login si sigue abierta
  if (loginWindow) loginWindow.close();
}

module.exports = {
  createLoginWindow,
  createMainWindow
};
