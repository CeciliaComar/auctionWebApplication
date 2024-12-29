// public/js/auth.js

// Function to log the user out
/*export function logout() {
    // Remove the token from localStorage
    localStorage.removeItem('token');
  
    // Redirect the user to the login page (or homepage)
    window.location.href = '/signin.html';  // You can change this to redirect to another page
  }*/

  const logoutButton = document.getElementById('logout-btn');

  logoutButton.addEventListener('click', async (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    alert('Logout successful!');
    // Redirect the user to the login page (or homepage)
    window.location.href = '/index.html';  
  });
  