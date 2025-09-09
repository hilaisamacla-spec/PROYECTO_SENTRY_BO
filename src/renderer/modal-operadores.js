// MODAL OPERADOR
window.abrirOperadorModal = function () {
  document.getElementById('operadorModal').style.display = 'flex';
};
window.cerrarOperadorModal = function () {
  document.getElementById('operadorModal').style.display = 'none';
};
window.abrirListaOperadoresModal = function () {
  document.getElementById('listaOperadoresModal').style.display = 'flex';
};
window.cerrarListaOperadoresModal = function () {
  document.getElementById('listaOperadoresModal').style.display = 'none';
};

// Atajo para abrir registro desde lista
window.atajoCrearOperadorDesdeLista = function () {
  cerrarListaOperadoresModal();
  setTimeout(() => {
    abrirOperadorModal();
  }, 100);
};