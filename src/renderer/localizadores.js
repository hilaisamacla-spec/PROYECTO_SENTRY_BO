import { db } from './firebase.js';
import { collection, addDoc, onSnapshot, getDoc, doc, updateDoc, getDocs, query, where  }
  from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Reutiliza la misma función de emergencias
async function getUbicacionGoogle() {
  const apiKey = "AIzaSyA2hnKp0HOefSXQmvvuFaK_Xbpfb_C9pqo"; // usa tu misma clave
  const res = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Error en la API de geolocalización");
  const data = await res.json();
  return { lat: data.location.lat, lng: data.location.lng };
}

// REGISTRAR LOCALIZADOR
document.getElementById('localizadorForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const persona = document.getElementById('localizadorPersona').value;
  const descripcion = document.getElementById('localizadorDescripcion').value;
  const tipo = document.getElementById('localizadorTipo').value;

  const form = e.target;
  const editId = form.getAttribute("data-edit-id");
  let ubicacion = null;
  try {
    ubicacion = await getUbicacionGoogle();
  } catch (error) {
    alert("No se pudo obtener la ubicación desde la API de Google.");
    return;
  }

  try {
    if (editId) {
      const ref = doc(db, 'localizadores', editId);
      await updateDoc(ref, {
        persona_solicitante: persona,
        descripcion,
        tipo_emergencia: tipo,
        ubicacion
      });
      form.removeAttribute("data-edit-id");
    } else {
      await addDoc(collection(db, 'localizadores'), {
        fecha: new Date(),
        persona_solicitante: persona,
        descripcion,
        tipo_emergencia: tipo,
        ubicacion,
        estado: "Activo"
      });
    }

    window.cerrarLocalizadorModal();
    window.abrirListaLocalizadoresModal();
    e.target.reset();
  } catch (error) {
    console.error('Error al guardar localizador:', error);
  }
});
async function cargarLocalizadoresConVehiculos() {
  // Cargar todos los vehículos primero
const sociosSnapshot = await getDocs(query(collection(db, 'users'), where("role", "==", "socio")));
const sociosMap = {};
sociosSnapshot.forEach(doc => {
  const data = doc.data();
  sociosMap[doc.id] = { // Usar UID como clave
    nombre: data.nombre || "SIN NOMBRE",
    placa: data.placa || "SIN PLACA"
  };
});
// LISTAR LOCALIZADORES
onSnapshot(collection(db, 'localizadores'), (snapshot) => {
  const tbody = document.getElementById('localizadoresList');
  if (!tbody) return;
  tbody.innerHTML = '';
  snapshot.forEach(doc => {
    const data = doc.data();

    let patrullaInfo = "SIN ASIGNACIÓN";
    if (data.patrulla_uid && sociosMap[data.patrulla_uid]) {
      const socio = sociosMap[data.patrulla_uid];
      patrullaInfo = `${socio.placa} - ${socio.nombre}`;
    }
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(data.fecha.seconds * 1000).toLocaleString()}</td>
      <td>${data.persona_solicitante}</td>
      <td>${data.tipo_emergencia}</td>
      <td>${data.estado}</td>
      <td>${patrullaInfo}</td>
      <td>${data.descripcion}</td>
      <td>${data.ubicacion ? `${data.ubicacion.lat.toFixed(4)}, ${data.ubicacion.lng.toFixed(4)}` : ''}</td>
      <td>
        <button class="button small" onclick="editarLocalizador('${doc.id}')">✏️</button>
        <button class="button small" onclick="anularLocalizador('${doc.id}')">🗑️</button>
        <button class="button small" onclick="abrirAsignarPatrullaModal('${doc.id}')">🚓</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
});
};
cargarLocalizadoresConVehiculos();

window.anularLocalizador = async function(id) {
  if (!confirm("¿Estás seguro de anular este localizador?")) return;

  try {
    const ref = doc(db, "localizadores", id);
    await updateDoc(ref, {
      estado: "Anulado"
    });
    alert("Localizador anulado correctamente.");
  } catch (error) {
    console.error("Error al anular:", error);
  }
};

window.editarLocalizador = async function(id) {
  try {
    const ref = doc(db, "localizadores", id);
    const snap = await getDoc(ref);
    const data = snap.data();

    // Rellenar el formulario
    document.getElementById("localizadorPersona").value = data.persona_solicitante;
    document.getElementById("localizadorDescripcion").value = data.descripcion;
    document.getElementById("localizadorTipo").value = data.tipo_emergencia;

    // Guardar ID temporalmente
    document.getElementById("localizadorForm").setAttribute("data-edit-id", id);
    console.log("Abriendo modal para editar localizador...");
    cerrarListaLocalizadoresModal();
    abrirLocalizadorModal();
  } catch (err) {
    console.error("Error al cargar localizador:", err);
  }
};

// Abrir y llenar el modal de asignación
window.abrirAsignarPatrullaModal = async function (idLocalizador) {
  document.getElementById("asignarLocalizadorId").value = idLocalizador;

  const select = document.getElementById("selectPatrulla");
  select.innerHTML = "<option value='' disabled selected>Selecciona un móvil</option>";

  try {
    const querySnapshot = await getDocs(
      query(collection(db, "users"), where("role", "==", "socio"))
    );

    querySnapshot.forEach(doc => {
      const data = doc.data();
      const option = document.createElement("option");

      option.value = doc.id; // ✅ UID del socio
      option.setAttribute("data-placa", data.placa || "SIN PLACA");

      option.textContent = `${data.placa || "SIN PLACA"} - ${data.nombre || "SIN NOMBRE"}`;
      select.appendChild(option);
    });

    document.getElementById("asignarPatrullaModal").style.display = "flex";

  } catch (error) {
    console.error("Error al cargar móviles:", error);
    Swal.fire("Error", "No se pudieron cargar los móviles.", "error");
  }
};


document.getElementById("formAsignarPatrulla").addEventListener("submit", async (e) => {
  e.preventDefault();

  const localizadorId = document.getElementById("asignarLocalizadorId").value;
  const select = document.getElementById("selectPatrulla");
  const selectedOption = select.options[select.selectedIndex];

  const socioUid = select.value; // uid
  const socioPlaca = selectedOption.dataset.placa; // placa desde el atributo

  try {
    const ref = doc(db, "localizadores", localizadorId);
    await updateDoc(ref, {
      patrulla_uid: socioUid,
      patrulla_id: socioPlaca // sigue llamándose patrulla_id, es la placa
    });

    cerrarAsignarPatrullaModal();

    console.log('Asignación exitosa', `Asignado: ${socioPlaca}`, 'success');
    cargarLocalizadoresConVehiculos();
  } catch (error) {
    console.error("Error al asignar patrulla:", error);
    Swal.fire("Error", "No se pudo asignar el móvil.", "error");
  }
});
