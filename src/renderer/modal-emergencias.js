// EMERGENCIAS
window.abrirEmergenciaModal = function () {
  document.getElementById('emergenciaModal').style.display = 'flex';
};
window.cerrarEmergenciaModal = function () {
  document.getElementById('emergenciaModal').style.display = 'none';
};

window.abrirListaEmergenciasModal = function () {
  document.getElementById('listaEmergenciasModal').style.display = 'flex';
};
window.cerrarListaEmergenciasModal = function () {
  document.getElementById('listaEmergenciasModal').style.display = 'none';
};

window.atajoCrearEmergenciaDesdeLista = function () {
  cerrarListaEmergenciasModal();
  setTimeout(() => abrirEmergenciaModal(), 100);
};
