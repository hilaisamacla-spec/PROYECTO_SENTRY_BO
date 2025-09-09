import { db, collection, getDocs } from "./firebase.js";

let markers = {};
const iconos = {
  img_patrulla: "assets/iconos/police-car.png",
};

export async function cargarZonasEnMapa() {
  const zonasSnapshot = await getDocs(collection(db, "zonas"));

  zonasSnapshot.forEach((doc) => {
    const zona = doc.data();
    const { nombre, descripcion, ubicacion } = zona;

    if (ubicacion?.lat && ubicacion?.lng) {
      const posicion = { lat: ubicacion.lat, lng: ubicacion.lng };

      // Crear marcador con infoWindow
      const marker = new google.maps.Marker({
        position: posicion,
        map: window.map,
        title: nombre,
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<strong>${nombre}</strong><br>${descripcion || "Sin descripción"}`
      });

      marker.addListener("click", () => {
        infoWindow.open(window.map, marker);
      });
      const color = zona.categoria === "riesgo" ? "#FF0000" : "#00FF00";
      // Crear círculo rojo alrededor de la zona
      new google.maps.Circle({
        strokeColor: color,
        strokeOpacity: 0.7,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.3,
        map: window.map,
        center: posicion,
        radius: 75 // ✅ Puedes cambiar el radio en metros
      });
    }
  });
}

// Actualizar o agregar marcador (ej: patrullas)
export function addOrUpdateMarker(id, lat, lng, placa) {
  if (markers[id]) {
    markers[id].setPosition({ lat, lng });
  } else {
    markers[id] = new google.maps.Marker({
      position: { lat, lng },
      map: window.map,
      title: placa,
      icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
    });
  }
}

// Inicializar el mapa
function initMap() {
  const mapElement = document.getElementById("map");
  if (!mapElement) {
    console.error("El elemento #map no está disponible");
    return;
  }

  const centro = { lat: -16.9724954, lng: -65.4190916 };

  window.map = new google.maps.Map(mapElement, {
    zoom: 15,
    center: centro
  });

  new google.maps.Marker({
    position: centro,
    map: window.map,
    title: "Centro de operaciones"
  });

  marcadores.forEach((m) => {
    new google.maps.Marker({
      position: m.position,
      map: window.map,
      title: m.title,
      icon: m.icon
    });
  });

  cargarZonasEnMapa();
}

// Esperar a que Google Maps esté disponible antes de iniciar
function waitForGoogleMapsAndInit() {
  const interval = setInterval(() => {
    if (window.google && window.google.maps) {
      clearInterval(interval);
      initMap();
    }
  }, 100);
}

waitForGoogleMapsAndInit();
