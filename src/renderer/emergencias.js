import { db } from './firebase.js';
import { collection, addDoc, onSnapshot } 
  from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Obtener ubicación actual
function getUbicacion() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("La geolocalización no está soportada en este navegador.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      }),
      (err) => reject(err),
      { enableHighAccuracy: true }
    );
  });
}

// REGISTRAR EMERGENCIA
document.getElementById('emergenciaForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const descripcion = document.getElementById('emergenciaDescripcion').value;
  const tipo = document.getElementById('emergenciaTipo').value;

  let ubicacion = null;
try {
  ubicacion = await getUbicacionGoogle();
} catch (error) {
  alert("No se pudo obtener la ubicación desde la API de Google.");
  return;
}

  try {
    await addDoc(collection(db, 'emergencias'), {
      fecha_reporte: new Date(),
      descripcion,
      tipo_emergencia: tipo,
      ubicacion,
      estado: 'Pendiente'
    });

    window.cerrarEmergenciaModal();
    e.target.reset();
  } catch (error) {
    console.error('Error al guardar emergencia:', error);
  }
});

  async function getUbicacionGoogle() {
    const apiKey = "AIzaSyA2hnKp0HOefSXQmvvuFaK_Xbpfb_C9pqo"; // Usa tu misma clave de Google Maps

    const res = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`, {
        method: "POST"
    });

    if (!res.ok) throw new Error("Error en la API de geolocalización");

    const data = await res.json();
    return {
        lat: data.location.lat,
        lng: data.location.lng
    };
  }

// LISTAR EMERGENCIAS
onSnapshot(collection(db, 'emergencias'), (snapshot) => {
  const tbody = document.getElementById('emergenciasList');
  if (!tbody) return;
  tbody.innerHTML = '';
  snapshot.forEach(doc => {
    const data = doc.data();
    const tr = document.createElement('tr');
  
    tr.innerHTML = `
      <td>${new Date(data.fecha_reporte.seconds * 1000).toLocaleString()}</td>
      <td>${data.descripcion}</td>
      <td>${data.tipo_emergencia}</td>
      <td>${data.ubicacion ? `${data.ubicacion.lat.toFixed(4)}, ${data.ubicacion.lng.toFixed(4)}` : ''}</td>
      <td>${data.estado}</td>
      <td>
        <button class="button small" onclick="abrirAsignarMovilPorEmail('${doc.id}')">
          Asignar móvil
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
});
