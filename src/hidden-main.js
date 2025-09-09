const { app, BrowserWindow } = require('electron');
const path = require('path');

let loginWindow;    // Ventana de inicio de sesión

// Función para crear la ventana de inicio de sesión (con logo)
// function createLoginWindow() {
//   loginWindow = new BrowserWindow({
//     width: 400,
//     height: 580,
//     resizable: false,
//     frame: false,
//     title: "SENTRY - BO",
//     icon: path.join(__dirname, 'src/logo.png'),
//     webPreferences: {
//       nodeIntegration: true,
//       contextIsolation: false
//     }
//   });

//   loginWindow.loadFile('src/index.html');  // Cargar el archivo de login
// }
function createLoginWindow() {
  loginWindow = new BrowserWindow({
    width: 400,
    height: 580,
    resizable: false,
    frame: false,
    title: "SENTRY - BO",
    icon: path.join(__dirname, 'src/logo.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    }
  });

  loginWindow.loadFile('src/index.html');
}

// Cuando la aplicación esté lista, crear la ventana de inicio de sesión
app.whenReady().then(createLoginWindow);

// Cerrar la aplicación cuando todas las ventanas se cierren
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
