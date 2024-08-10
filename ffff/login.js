import { loginUser, getUserData, sendPasswordResetEmail } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const createAccountBtn = document.getElementById('create-account-btn');
  const forgotPasswordBtn = document.getElementById('forgot-password-btn');
  const loginError = document.getElementById('login-error');

  if (!loginForm || !loginError) {
    console.error('No se pudieron encontrar los elementos del formulario o el mensaje de error.');
    return;
  }

  const encodedPages = {
    admin: 'YWRtaW4uaHRtbA==', // Base64 para 'admin.html'
    jurado: 'anVyYWRvLmh0bWw=', // Base64 para 'jurado.html'
    dashboard: 'ZGFzaGJvYXJkLmh0bWw=', // Base64 para 'dashboard.html'
    studentInfo: 'c3R1ZGVudC1pbmZvLmh0bWw=' // Base64 para 'student-info.html'
  };

  function redirectToPage(encodedURL) {
    const url = atob(encodedURL);
    window.location.href = url;
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    try {
      const userCredential = await loginUser(email, password);
      const user = userCredential.user;
      const userDataDoc = await getUserData(user.uid);

      if (!userDataDoc.exists()) {
        throw new Error('Datos del usuario no encontrados');
      }

      const userData = userDataDoc.data();
      const role = userData.role;
      const hasCompletedProfile = userData.fullName && userData.age && userData.major && userData.semester && userData.phone && userData.gender;

      if (role === 'administrador') {
        redirectToPage(encodedPages.admin);
      } else if (role === 'jurado') {
        redirectToPage(encodedPages.jurado);
      } else if (role === 'estudiante') {
        if (hasCompletedProfile) {
          redirectToPage(encodedPages.dashboard);
        } else {
          redirectToPage(encodedPages.studentInfo);
        }
      } else {
        throw new Error('Rol desconocido');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      loginError.textContent = 'Error al iniciar sesión. Verifica tus credenciales y vuelve a intentarlo.';
      loginError.style.display = 'block';
    }
  });

  createAccountBtn.addEventListener('click', () => {
    window.location.href = 'register.html';
  });

  forgotPasswordBtn.addEventListener('click', () => {
    const email = prompt('Por favor ingresa tu correo electrónico:');
    if (email) {
      sendPasswordResetEmail(email)
        .then(() => {
          alert('Se ha enviado un correo electrónico para restablecer tu contraseña.');
        })
        .catch((error) => {
          console.error('Error al enviar el correo de restablecimiento:', error);
          alert('Error al enviar el correo de restablecimiento. Por favor intenta de nuevo.');
        });
    }
  });
});
