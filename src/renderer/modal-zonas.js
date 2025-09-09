//renderer/modal-zonas.js
let mapaZona;
let marcadorZona;
// ZONAS
window.abrirZonaModal = function () {
  document.getElementById('zonaModal').style.display = 'flex';
    // Esperar a que se renderice el modal
  setTimeout(() => {
    if (!mapaZona) {
      inicializarMapaZona();
    }
  }, 300);
  
};
window.cerrarZonaModal = function () {
  document.getElementById('zonaModal').style.display = 'none';
};

window.abrirListaZonasModal = function () {
  document.getElementById('listaZonasModal').style.display = 'flex';
};
window.cerrarListaZonasModal = function () {
  document.getElementById('listaZonasModal').style.display = 'none';
};

window.atajoCrearZonaDesdeLista = function () {
  cerrarListaZonasModal();
  setTimeout(() => abrirZonaModal(), 100);
};

function inicializarMapaZona() {
  const centroDefault = { lat: -16.9724954, lng: -65.4190916 }; // Cambia por tu ubicación base
  mapaZona = new google.maps.Map(document.getElementById("mapZona"), {
    zoom: 16,
    center: centroDefault,
  });

  mapaZona.addListener("click", (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    document.getElementById("zonaLat").value = lat;
    document.getElementById("zonaLng").value = lng;
    document.getElementById("zonaUbicacionTexto").textContent = `Ubicación seleccionada: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;

    if (marcadorZona) {
      marcadorZona.setMap(null);
    }

    marcadorZona = new google.maps.Marker({
      position: { lat, lng },
      map: mapaZona,
      title: "Ubicación seleccionada"
    });
  });
}
