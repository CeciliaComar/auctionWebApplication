document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('search-auction-form');
    const updateForm = document.getElementById('update-auction-form');
    const auctionDetailsDiv = document.getElementById('auction-details');
    let auctionId = null;
  
    // Handle search for auction by title
    searchForm.addEventListener('submit', async function (e) {
      e.preventDefault();
  
      const auctionTitle = document.getElementById('auctionTitle').value;
  
      // Fetch auction by title
      const response = await fetch(`/api/auctions/search?title=${auctionTitle}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          //'Authorization': `Bearer ${localStorage.getItem('token')}`, // Ensure the user is authenticated
        },
      });
  
      if (response.ok) {
        const auction = await response.json();
  
        if (auction) {
          // Auction found, show the details for editing
          auctionId = auction._id;
          document.getElementById('title').value = auction.title;
          document.getElementById('description').value = auction.description;
          //document.getElementById('startingPrice').value = auction.startingPrice;
          //document.getElementById('expirationDate').value = new Date(auction.expirationDate).toISOString().slice(0, 16); // Convert to datetime-local format
          auctionDetailsDiv.style.display = 'block';
        } else {
          alert('Auction not found');
        }
      } else {
        alert('Failed to fetch auction');
      }
    });
  
    // Handle auction update form submission
    updateForm.addEventListener('submit', async function (e) {
      e.preventDefault();
  
      const updatedAuction = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        //startingPrice: parseFloat(document.getElementById('startingPrice').value),
        //expirationDate: document.getElementById('expirationDate').value,
      };
  
      const response = await fetch(`/api/auctions/${auctionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add token to the header
        },
        body: JSON.stringify(updatedAuction),
      });
  
      if (response.ok) {
        const result = await response.json();
        alert('Auction updated successfully!');
        window.location.href = `/auctions.html`; // Redirect to auctions page
      } else {
        const error = await response.json();
        alert(`Failed to update auction: ${error.message}`);
      }
    });
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