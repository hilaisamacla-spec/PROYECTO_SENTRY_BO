// renderer/zonas.js
import { cargarZonasEnMapa } from './mapa.js'; 
import { db } from './firebase.js';
import { collection, addDoc, onSnapshot,doc, getDoc, updateDoc, deleteDoc }
  from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Reutilizamos la misma función de emergencias
async function getUbicacionGoogle() {
  const apiKey = "AIzaSyA2hnKp0HOefSXQmvvuFaK_Xbpfb_C9pqo"; // usa tu misma clave
  const res = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Error en la API de geolocalización");
  const data = await res.json();
  return { lat: data.location.lat, lng: data.location.lng };
}

document.getElementById('zonaForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('zonaNombre').value;
  const categoria = document.getElementById("zonaCategoria").value;
  const descripcion = document.getElementById('zonaDescripcion').value;
  const lat = parseFloat(document.getElementById('zonaLat').value);
  const lng = parseFloat(document.getElementById('zonaLng').value);

  if (!lat || !lng) {
    alert("Por favor selecciona una ubicación en el mapa.");
    return;
  }

  const ubicacion = { lat, lng };
  const form = e.target;
  const zonaId = form.getAttribute('data-edit-id');

  try {
    if (zonaId) {
      await updateDoc(doc(db, "zonas", zonaId), { nombre, categoria, descripcion, ubicacion });
      form.removeAttribute('data-edit-id');
    } else {
      await addDoc(collection(db, 'zonas'), {
        nombre,
        categoria,
        descripcion,
        ubicacion,
        createdAt: new Date()
      });
    }

    form.reset();
    marcadorZona = null;
    document.getElementById("zonaUbicacionTexto").textContent = "";
    document.getElementById("zonaCategoria").value = "";
    cerrarZonaModal();
    abrirListaZonasModal();

  } catch (error) {
    console.error('Error al guardar zona:', error);
  }
});


// LISTAR ZONAS
onSnapshot(collection(db, 'zonas'), (snapshot) => {
  const tbody = document.getElementById('zonasList');
  if (!tbody) return;
  tbody.innerHTML = '';
  snapshot.forEach(doc => {
    const data = doc.data();
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${data.nombre}</td>
      <td>${data.categoria}</td>
      <td>${data.descripcion}</td>
      <td>${data.ubicacion ? `${data.ubicacion.lat.toFixed(4)}, ${data.ubicacion.lng.toFixed(4)}` : ''}</td>
      <td>
        <button class="button small" onclick="editarZona('${doc.id}')">✏️</button>
        <button class="button small" onclick="eliminarZona('${doc.id}')">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
});

window.editarZona = async function (id) {
  try {
    const ref = doc(db, "zonas", id);
    const snap = await getDoc(ref);
    const data = snap.data();

    document.getElementById("zonaNombre").value = data.nombre;
    document.getElementById("zonaForm").setAttribute("data-edit-id", id);
    document.getElementById("zonaCategoria").value = data.categoria || '';
    document.getElementById("zonaDescripcion").value = data.descripcion;
    document.getElementById("zonaLat").value = data.ubicacion.lat;
    document.getElementById("zonaLng").value = data.ubicacion.lng;
    document.getElementById("zonaUbicacionTexto").textContent = `Ubicación
  seleccionada: ${data.ubicacion.lat.toFixed(4)}, ${data.ubicacion.lng.toFixed(4)}`;
    cerrarListaZonasModal();
    abrirZonaModal();
    await cargarZonasEnMapa();
  } catch (err) {
    console.error("Error al cargar zona:", err);
  }
};

window.eliminarZona = async function (id) {
  const confirmar = confirm("¿Seguro que quieres eliminar esta zona?");
  if (!confirmar) return;

  try {
    await deleteDoc(doc(db, "zonas", id));
  } catch (err) {
    console.error("Error al eliminar zona:", err);
  }
};
//nota: revisar por que aun no se carga la nueva ubicacion