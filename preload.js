const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  sendLoginExitoso: (uid) => ipcRenderer.send("login-exitoso", uid),
  sendLoginError: (msg) => ipcRenderer.send("login-error", msg),
  cerrarAplicacion: () => ipcRenderer.send("cerrar-aplicacion")
});