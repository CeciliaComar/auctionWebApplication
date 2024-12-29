document.getElementById('create-auction-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission
  
    // Collect form data
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const startingPrice = parseFloat(document.getElementById('startingPrice').value);
    const expirationDate = document.getElementById('expirationDate').value;
  
    // Prepare auction data
    const auctionData = { title, description, startingPrice, expirationDate };
  
    try {
      // Get the JWT token from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to create an auction.');
        window.location.href = 'signin.html';
        return;
      }
  
      // Send POST request to the backend
      const response = await fetch('/api/auctions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Add the JWT token to the Authorization header
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(auctionData)
      });
  
      if (response.ok) {
        const result = await response.json();
        alert('Auction created successfully!');
        window.location.href = 'auctions.html'; // Redirect to the auctions page
      } else {
        const error = await response.json();
        alert(`Failed to create auction: ${error.message}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred while creating the auction.');
    }
  });

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
  