// jurado-form.js
import { observeAuthState, logoutUser, updateAnteproyecto } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('anteproyecto-form');
  const anteproyectoIdInput = document.getElementById('anteproyecto-id');
  const statusSelect = document.getElementById('status');
  const commentsTextArea = document.getElementById('comments');
  const logoutButton = document.getElementById('logout-button');

  observeAuthState(user => {
    if (!user) {
      window.location.href = 'login.html';
    }
  });

  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      try {
        await logoutUser();
        window.location.href = 'login.html';
      } catch (error) {
        console.error('Error cerrando sesión:', error);
        alert('Error al cerrar sesión. Por favor, inténtalo de nuevo.');
      }
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const anteproyectoId = anteproyectoIdInput.value;
      const status = statusSelect.value;
      const comments = commentsTextArea.value;

      try {
        await updateAnteproyecto(anteproyectoId, { status, comments });
        alert('Anteproyecto actualizado exitosamente.');
        window.location.href = 'jurado.html'; 
      } catch (error) {
        console.error('Error al actualizar anteproyecto:', error);
        alert('Error al actualizar anteproyecto. Por favor, inténtalo de nuevo.');
      }
    });
  }
});
