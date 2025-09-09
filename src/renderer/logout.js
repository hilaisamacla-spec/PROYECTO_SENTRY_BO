// renderer/logout.js
window.nuevoOperador = () => { console.log('Nuevo Operador'); };
window.zonaRiesgo = () => { console.log('Zonas de riesgo'); };
window.localizador = () => { console.log('Localizador'); };
// window.verHistorial = () => { console.log('Ver historial'); };
window.salir = () => {
  document.getElementById('salirModal').style.display = 'flex';
};
window.cerrarModal = () => {
  document.getElementById('salirModal').style.display = 'none';
};
window.salirDefinitivo = () => {
  window.electronAPI && window.electronAPI.cerrarAplicacion
    ? window.electronAPI.cerrarAplicacion()
    : console.log('Cerrar aplicación');
};
