// Abrir modal de historial
window.verHistorial = function () {
  document.getElementById("historialModal").style.display = "flex";
  cargarHistorialVehiculos();
};

// Cerrar modal de historial
window.cerrarHistorialModal = function () {
  document.getElementById("historialModal").style.display = "none";
};

// Simulación de historial estático
function cargarHistorialVehiculos() {

  const tbody = document.getElementById("tablaHistorialVehiculos");
  tbody.innerHTML = "";

  historial.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.vehiculo}</td>
      <td>${item.placa}</td>
      <td>${item.ruta}</td>
      <td>${item.fecha}</td>
    `;
    tbody.appendChild(tr);
  });
}