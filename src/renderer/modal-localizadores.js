// LOCALIZADOR
window.abrirLocalizadorModal = function () {
  document.getElementById('localizadorModal').style.display = 'flex';
};
window.cerrarLocalizadorModal = function () {
  document.getElementById('localizadorModal').style.display = 'none';
};

window.abrirListaLocalizadoresModal = function () {
  document.getElementById('listaLocalizadoresModal').style.display = 'flex';
};
window.cerrarListaLocalizadoresModal = function () {
  document.getElementById('listaLocalizadoresModal').style.display = 'none';
};

window.cerrarAsignarPatrullaModal = function () {
  document.getElementById("asignarPatrullaModal").style.display = "none";
};

window.atajoCrearLocalizadorDesdeLista = function () {
  cerrarListaLocalizadoresModal();
  setTimeout(() => abrirLocalizadorModal(), 100);
};
