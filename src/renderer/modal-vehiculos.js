// src/renderer/modal-vehiculos.js
window.abrirModal = function() {
  document.getElementById('vehicleModal').style.display = 'flex';
};
window.cerrarVehiculoModal = function() {
  document.getElementById('vehicleModal').style.display = 'none';
};
window.abrirListaVehiculos = function() {
  document.getElementById('listaModal').style.display = 'flex';
};
window.cerrarListaVehiculos = function() {
  document.getElementById('listaModal').style.display = 'none';
};
window.atajoCrearDesdeLista = function() {
  cerrarListaVehiculos();
  setTimeout(() => {
    abrirModal();
  }, 100);
};

window.onclick = function (event) {
  const modal = document.getElementById('vehicleModal');
  const modalList = document.getElementById('listaModal');
  if (event.target === modal) cerrarVehiculoModal();
  if (event.target === modalList) cerrarListaVehiculos();
};
