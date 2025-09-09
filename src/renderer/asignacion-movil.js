import { db } from "./firebase.js";
import { collection, doc, updateDoc, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

document.getElementById('formAsignarMovilPorEmail').addEventListener('submit', async (e) => {
  e.preventDefault();

  const emergenciaId = document.getElementById('emergenciaIdParaAsignar').value;
  const movilEmail = document.getElementById('selectMovilEmail').value;

  try {
    // Obtener la placa del usuario seleccionado
    const sociosQuery = query(collection(db, "users"), where("email", "==", movilEmail));
    const sociosSnap = await getDocs(sociosQuery);

    if (sociosSnap.empty) {
      Swal.fire('Error', 'No se encontró el móvil seleccionado.', 'error');
      return;
    }

    const movilData = sociosSnap.docs[0].data();
    const placa = movilData.placa || 'Sin placa';

    // 1. Registrar la asignación en colección "asignacion"
    await addDoc(collection(db, "asignacion"), {
      emergencia_id: emergenciaId,
      movil_email: movilEmail,
      movil_placa: placa,
      fecha: new Date()
    });

    // 2. (Opcional) actualizar documento emergencia con estado
    const emergenciaRef = doc(db, 'emergencias', emergenciaId);
    await updateDoc(emergenciaRef, {
      estado: 'Asignado'
    });

    Swal.fire('✅ Asignado', 'Móvil asignado correctamente a la emergencia.', 'success');
    cerrarAsignarMovilPorEmailModal();

  } catch (error) {
    console.error("❌ Error en la asignación:", error);
    Swal.fire("Error", "No se pudo asignar el móvil.", "error");
  }
});
