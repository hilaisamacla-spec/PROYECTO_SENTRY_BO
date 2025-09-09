// src/renderer/vehiculos.js
import { db } from './firebase.js';
import { collection, onSnapshot, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } 
  from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Guardar vehículo
document.getElementById('vehicleForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('vehicleId').value;
  const model = document.getElementById('vehicleModel').value;
  const type = document.getElementById('vehicleType').value;
  const plate = document.getElementById('vehiclePlate').value;
  const description = document.getElementById('vehicleDesc').value;

  try {
    if (documentoEnEdicion) {
      // Editar existente
      const ref = doc(db, 'vehiculos', documentoEnEdicion);
      await updateDoc(ref, {
        model,
        type,
        plate,
        description
      });
    } else {
      // Crear nuevo
      await addDoc(collection(db, 'vehiculos'), {
        id,
        model,
        type,
        plate,
        description,
        createdAt: new Date()
      });
    }
    window.cerrarVehiculoModal();
    window.abrirListaVehiculos();
    e.target.reset();
    document.getElementById('vehicleId').readOnly = false;
    documentoEnEdicion = null;
  } catch (error) {
    console.error("Error al guardar:", error);
  }
});

// Listar vehículos
onSnapshot(collection(db, 'vehiculos'), (snapshot) => {
  const tbody = document.getElementById('vehicleList');
  tbody.innerHTML = '';
  snapshot.forEach(doc => {
    const data = doc.data();
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${data.id}</td>
      <td>${data.model}</td>
      <td>${data.type}</td>
      <td>${data.plate || ''}</td>
      <td>${data.description || ''}</td>
      <td>
        <button class="button small editar" data-id="${data.id}">✏️</button>
        <button class="button small eliminar" data-id="${data.id}">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
});

// Detectar clics en botones de editar y eliminar
document.getElementById('vehicleList').addEventListener('click', (e) => {
  const id = e.target.dataset.id;
  if (e.target.classList.contains('editar')) {
    editarVehiculo(id);
  }
  if (e.target.classList.contains('eliminar')) {
    eliminarVehiculo(id);
  }
});

let documentoEnEdicion = null;
async function editarVehiculo(id) {
  const q = query(collection(db, 'vehiculos'), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data();

    // Guardamos el ID del documento para editarlo luego
    documentoEnEdicion = docSnap.id;

    // Llenar formulario
    document.getElementById('vehicleId').value = data.id;
    document.getElementById('vehicleModel').value = data.model;
    document.getElementById('vehicleType').value = data.type;
    document.getElementById('vehiclePlate').value = data.plate;
    document.getElementById('vehicleDesc').value = data.description || '';

    document.getElementById('vehicleId').readOnly = true;
    window.abrirModal();
    window.cerrarListaVehiculos();
  }
}

async function eliminarVehiculo(id) {
  if (!confirm('¿Deseas eliminar este vehículo?')) return;

  const q = query(collection(db, 'vehiculos'), where('id', '==', id));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];
    await deleteDoc(doc(db, 'vehiculos', docSnap.id));
  }
}
