document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const auctionId = urlParams.get('id');  // Assuming the URL looks like /auction-details.html?id=12345

  if (!auctionId) {
    alert('No auction ID provided.');
    return;
  }   // const token = localStorage.getItem('token'); // Get the JWT token from localStorage

  /*if (!token) {
    alert('You must be logged in to view auction details.');
    window.location.href = 'signin.html'; // Redirect to login if not logged in
    return;
  }*/

  try {
    // Fetch auction details
    const response = await fetch(`http://localhost:3000/api/auctions/${auctionId}`, {
      method: 'GET'/*,
     headers: {
          'Authorization': `Bearer ${token}`, // Add token to the Authorization header
        },*/
    });

    if (!response.ok) {
      const error = await response.json();
      alert(`Failed to fetch auction details: ${error.message}`);
      return;
    }

    const data = await response.json();
    const auction = data.auction;

    // Display auction details
    document.getElementById('auction-title').textContent = auction.title;
    document.getElementById('auction-description').textContent = auction.description;
    document.getElementById('auction-starting-price').textContent = auction.startingPrice;
    document.getElementById('auction-current-price').textContent = auction.currentPrice || 'No bids yet';
    document.getElementById('auction-expiration-date').textContent = new Date(auction.expirationDate).toLocaleString();
    document.getElementById('auction-creator').textContent = auction.createdBy.username;

    if (auction.winningUser) {
      document.getElementById('auction-winner').textContent = ` ${auction.winningUser.name} ${auction.winningUser.surname}`;
    } else {
      document.getElementById('auction-winner').textContent = 'No winner yet';
    }
  } catch (error) {
    console.error('Error fetching auction details:', error);
    alert('An error occurred while fetching auction details.');
  }
});

document.getElementById('delete-auction').addEventListener('click', async () => {
  const auctionId = new URLSearchParams(window.location.search).get('id'); // Get the auction ID from the URL
  const token = localStorage.getItem('token'); // Get the JWT token from localStorage

  if (!token) {
    alert('You must be logged in to delete an auction.');
    return;
  }

  try {
    const response = await fetch(`/api/auctions/${auctionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`, // Add the JWT token in the header
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const result = await response.json();
      alert(result.message); // Show success message
      window.location.href = '/auctions.html'; // Redirect to the auctions list page
    } else {
      const error = await response.json();
      alert(`Failed to delete auction: ${error.message}`); // Show error message
    }
  } catch (err) {
    console.error('Error:', err);
    alert('An error occurred while deleting the auction.');
  }
});

document.getElementById('place-bid').addEventListener('click', async () => {
  const auctionId = new URLSearchParams(window.location.search).get('id');
  const bidAmount = document.getElementById('bid-amount').value;
  const token = localStorage.getItem('token'); // Retrieve the JWT token

  if (!token) {
    alert('You must be logged in to place a bid.');
    return;
  }

  try {
    const response = await fetch(`/api/auctions/${auctionId}/bids`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: bidAmount }), // Send the bid amount in the request body
    });

    if (response.ok) {
      const data = await response.json();
      alert('Bid placed successfully!');
      window.location.reload(); // Reload the page to update the bid list
    } else {
      const error = await response.json();
      alert(`Failed to place bid: ${error.message}`);
    }
  } catch (error) {
    console.error('Error placing bid:', error);
    alert('An error occurred while placing the bid.');
  }
});


document.getElementById('bids-list').addEventListener('click', async () => {
  const auctionId = new URLSearchParams(window.location.search).get('id');

  try {
    const response = await fetch(`/api/auctions/${auctionId}/bids`);

    if (response.ok) {
      const data = await response.json();
      const bids = data.bids;

      // Clear previous bids
      const bidsList = document.getElementById('bids-list');
      bidsList.innerHTML = '';

      // Display each bid
      bids.forEach((bid) => {
        const bidItem = document.createElement('li');
        bidItem.innerHTML = `
          Bid Amount: $${bid.amount} by ${bid.user.name}
          <button class="view-details-button" data-bid-id="${bid._id}">View Details</button>
        `;
        bidsList.appendChild(bidItem);
      });

      // Add click event listeners for "View Details" buttons
      document.querySelectorAll('.view-details-button').forEach(button => {
        button.addEventListener('click', (event) => {
          const bidId = event.target.dataset.bidId; // Get the bid ID from the button
          window.location.href = `bid-details.html?id=${bidId}`; // Redirect to the bid details page
        });});
      } else {
        const error = await response.json();
        alert(`Failed to fetch bids: ${error.message
      }`);
    }
  } catch (error) {
    console.error('Error fetching bids:', error);
    alert('An error occurred while fetching bids.');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');  // Check for the token in localStorage
  const loginButton = document.getElementById('login-btn');
  const logoutButton = document.getElementById('logout-btn');
  const signupButton = document.getElementById('signup-btn');

  if (token) {
      // If the user is authenticated (token exists), show the logout button and hide the login button
      loginButton.style.display = 'none';
      logoutButton.style.display = 'inline';  // Show the logout button
      signupButton.style.display = 'none'; //hide the signup button
  } else {
      // If the user is not authenticated, show the login button and hide the logout button
      loginButton.style.display = 'inline';  // Show the login button
      logoutButton.style.display = 'none';   // Hide the logout button
      signupButton.style.display = 'inline'; //show the signup button
  }

  // Add an event listener to the logout button
  logoutButton.addEventListener('click', () => {
      localStorage.removeItem('token');  // Remove the token from localStorage
      window.location.href = 'index.html';  // Optionally redirect to the homepage or login page
  });
});

