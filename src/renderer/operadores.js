import { db } from './firebase.js';
import { collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc, getDoc } 
  from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const auth = getAuth();

let modoEdicion = false;
let operadorId = null;

// Manejo de formulario para crear operador
document.getElementById('operadorForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('opNombre').value;
  const correo = document.getElementById('opCorreo').value;
  const password = document.getElementById('opPassword').value;
  const rol = document.getElementById('opRol').value;

  try {

    if (modoEdicion && operadorId) {
      // MODO EDICIÓN
      await updateDoc(doc(db, 'operadores', operadorId), {
        nombre,
        correo,
        rol
      });
    } else {
      // NUEVO REGISTRO
      // 1. Crear cuenta en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, correo, password);
      const uid = userCredential.user.uid;

      await addDoc(collection(db, 'operadores'), {
        uid,
        nombre,
        correo,
        rol,
        estado: 'Activo',
        createdAt: new Date()
      });
    }

    window.cerrarOperadorModal();
    window.abrirListaOperadoresModal();
    e.target.reset();
    modoEdicion = false;
    operadorId = null;
  } catch (error) {
    console.error('Error al guardar operador:', error);
    alert("Error: " + error.message);
  }
});

// Listar
onSnapshot(collection(db, 'operadores'), (snapshot) => {
  const tbody = document.getElementById('operadoresList');
  if (!tbody) return; // Si el modal no está cargado aún
  tbody.innerHTML = '';
  snapshot.forEach(doc => {
    const data = doc.data();
    const docId = doc.id;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${data.nombre}</td>
      <td>${data.correo}</td>
      <td>${data.rol}</td>
      <td>${data.estado}</td>
      <td>
        <button class="button small editar-op" data-id="${docId}">✏️</button>
        <button class="button small eliminar-op" data-id="${docId}">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
});

document.getElementById('operadoresList').addEventListener('click', async (e) => {
  const id = e.target.dataset.id;

  if (e.target.classList.contains('eliminar-op')) {
    if (confirm('¿Eliminar este operador?')) {
      await deleteDoc(doc(db, 'operadores', id));
    }
  }

  if (e.target.classList.contains('editar-op')) {
    const operadorDoc = await getDoc(doc(db, 'operadores', id));
    const data = operadorDoc.data();

    // Rellenar el formulario
    document.getElementById('opNombre').value = data.nombre;
    document.getElementById('opCorreo').value = data.correo;
    document.getElementById('opPassword').value = ''; // No editar
    if (document.getElementById('opRol')) {
      document.getElementById('opRol').value = data.rol || 'Operador';
    }

    // Establecer modo edición
    operadorId = id;
    modoEdicion = true;
    cerrarListaOperadoresModal();
    abrirOperadorModal();
  }
});
