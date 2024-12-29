/*document.getElementById('view-auctions').addEventListener('click', () => {
    window.location.href = 'auctions.html'; // Redirect to the auctions page
  });
  
  document.getElementById('create-auction').addEventListener('click', () => {
    const token = localStorage.getItem('token'); // Check if the user is logged in
    if (!token) {
      alert('You must log in to create an auction.');
      window.location.href = 'signin.html';
    } else {
      window.location.href = 'create-auction.html';
    }
  });*/



/*// Event listener for the logout button
document.getElementById('logout-button').addEventListener('click', function() {
   // Log out the user:
   // Remove the token from localStorage
   localStorage.removeItem('token');
  
   // Redirect the user to the login page (or homepage)
   window.location.href = '/signin.html';  // You can change this to redirect to another page
});*/

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');  // Check for the token in localStorage
  const loginButton = document.getElementById('login-btn');
  const logoutButton = document.getElementById('logout-btn');
  const signupButton = document.getElementById('signup-btn');

  if (token) {
      // If the user is authenticated (token exists), show the logout button and hide the login button and the signup button
      loginButton.style.display = 'none';     // Hide the login button
      logoutButton.style.display = 'inline';  // Show the logout button
      signupButton.style.display = 'none';   // Hide the signup button
  } else {
      // If the user is not authenticated, show the login button and the signup button and hide the logout button
      loginButton.style.display = 'inline';  // Show the login button
      logoutButton.style.display = 'none';   // Hide the logout button
      signupButton.style.display = 'inline'; //show the signup button
  }

  // Add an event listener to the logout button
  logoutButton.addEventListener('click', () => {
      localStorage.removeItem('token');  // Remove the token from localStorage
      window.location.href = 'index.html';  // Optionally redirect to the homepage
  });
});


  