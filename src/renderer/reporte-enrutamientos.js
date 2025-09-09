import { db } from './firebase.js';
import {
  collection, getDocs, query, where, doc, getDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Haversine para calcular distancias en km
function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio Tierra km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

async function filtrarEnrutamientos() {
  console.log("📆 Ejecutando filtro de enrutamientos...");

  const fechaInput = document.getElementById('filtroFechaEnrutamientos').value;
  const verTodos = document.getElementById('verTodosEnrutamientos').checked;

  if (!verTodos && !fechaInput) {
    alert('Selecciona una fecha o marca "ver todos".');
    return;
  }

  const tbody = document.querySelector('#tablaEnrutamientos tbody');
  tbody.innerHTML = '';
  let totalGeneral = 0;

  try {
    const snapshot = await getDocs(collection(db, 'enrutamientos'));

    for (const docSnap of snapshot.docs) {
      const idDoc = docSnap.id;

      // Filtrar por fecha si no está activado "Ver todos"
      if (!verTodos && !idDoc.includes(fechaInput)) continue;

      const data = docSnap.data();
      const rutas = data.rutas || [];
      const uid = data.patrulla_uid;

      if (rutas.length < 2) continue;

      // Obtener nombre/placa
      let placa = "SIN PLACA";
      try {
        const userRef = await getDoc(doc(db, 'users', uid));
        if (userRef.exists()) {
          const userData = userRef.data();
          console.log("🪪 Datos del usuario:", userData);
          placa = userData.placa || "SIN PLACA";
        } else {
          console.warn("⚠️ Usuario no encontrado para UID:", uid);
        }
      } catch (e) {
        console.error("❌ Error al obtener usuario:", e);
      }

      // Calcular distancia
      let distancia = 0;
      for (let i = 1; i < rutas.length; i++) {
        const p1 = rutas[i - 1];
        const p2 = rutas[i];
        const delta = calcularDistanciaKm(p1.latitude, p1.longitude, p2.latitude, p2.longitude);

        if (delta >= 0.01) {
          distancia += delta;
        }
      }

      // Mostrar fila
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${placa}</td>
        <td>${idDoc.split('_')[1] || 'Sin fecha'}</td>
        <td>${rutas[0].latitude.toFixed(4)}, ${rutas[0].longitude.toFixed(4)}</td>
        <td>${rutas[rutas.length - 1].latitude.toFixed(4)}, ${rutas[rutas.length - 1].longitude.toFixed(4)}</td>
        <td>${distancia.toFixed(2)} km</td>
      `;
      tbody.appendChild(tr);

      totalGeneral += distancia;
    }

    document.getElementById('totalKm').textContent = `${totalGeneral.toFixed(2)} km`;

  } catch (error) {
    console.error('Error al obtener enrutamientos:', error);
  }
}

window.filtrarEnrutamientos = filtrarEnrutamientos;
window.abrirPanelEnrutamientos = function () {
  document.querySelectorAll('[id^="panel"]').forEach(div => div.style.display = 'none');
  document.getElementById('panelEnrutamientos').style.display = 'block';

  const inputFecha = document.getElementById('filtroFechaEnrutamientos');
  if (!inputFecha.value) {
    inputFecha.value = new Date().toISOString().slice(0, 10);
  }

  filtrarEnrutamientos();
};
window.cerrarPanelEnrutamientos = function () {
  document.getElementById('panelEnrutamientos').style.display = 'none';
};

document.addEventListener('DOMContentLoaded', () => {
  const verTodosCheckbox = document.getElementById('verTodosEnrutamientos');
  const btnFiltrar = document.getElementById('btnFiltrarEnrutamientos');

  if (verTodosCheckbox && btnFiltrar) {
    verTodosCheckbox.addEventListener('change', () => {
      btnFiltrar.disabled = verTodosCheckbox.checked;
      filtrarEnrutamientos(); // Ejecutar al marcar o desmarcar
    });
  }
});