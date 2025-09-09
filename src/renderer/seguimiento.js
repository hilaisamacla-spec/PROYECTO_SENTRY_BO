import { db } from "./firebase.js";
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { addOrUpdateMarker } from "./mapa.js";

console.log("🟢 seguimiento.js cargado correctamente");

// ID del documento del usuario a seguir
const userId = "EJRBuRzJcmgNo8acGsiywFiHz0a2";

// Referencia al documento
const userRef = doc(db, "users", userId);

// Escuchar cambios en tiempo real
onSnapshot(userRef, (docSnapshot) => {
  if (docSnapshot.exists()) {
    const data = docSnapshot.data();
    console.log("📦 Datos del documento Firestore:", data);

    const ubicacion = data.ubicacion;

    if (ubicacion?.latitude != null && ubicacion?.longitude != null) {
      const lat = ubicacion.latitude;
      const lng = ubicacion.longitude;
      console.log(`📍 Coordenadas recibidas: lat=${lat}, lng=${lng}`);

      // Esperar a que el mapa esté listo
      function esperarYAgregar() {
        if (window.map) {
          addOrUpdateMarker(userId, lat, lng, data.placa || "Sin placa");
          console.log("📍 Marcador agregado/actualizado en el mapa");
        } else {
          console.warn("⏳ Esperando que el mapa esté listo...");
          setTimeout(esperarYAgregar, 500); // reintentar cada 500ms
        }
      }

      esperarYAgregar();
    } else {
      console.warn("⚠️ El campo 'ubicacion' está ausente o mal formado.");
    }
  } else {
    console.warn("⚠️ El documento no existe.");
  }
});
