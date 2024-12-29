document.getElementById('filterBtn').addEventListener('click', async () => {
    const search = document.getElementById('search').value;
    const status = document.getElementById('status').value;

    // Build query parameters
    let query = '/api/auctions?';
    if (search) query += `search=${encodeURIComponent(search)}&`;
    if (status !== 'all') query += `status=${encodeURIComponent(status)}`;

    try {
        console.log('this is the query:', query);
        console.log('Are you authenticated?', checkIfAuthenticated());
        // Fetch data from the API
        const response = await fetch(query);
        if (!response.ok) throw new Error('Failed to fetch auctions');

        const auctions = await response.json();

        // Render auctions
        renderAuctions(auctions);
    } catch (error) {
        console.error('Error fetching auctions:', error);
        document.getElementById('auctionList').innerHTML = '<p>Error loading auctions.</p>';
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
        signupButton.style.display = 'none';   // Hide the signup button
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
  

function renderAuctions(auctions) {
    const auctionList = document.getElementById('auctionList');
    auctionList.innerHTML = ''; // Clear previous content

    if (auctions.length === 0) {
        auctionList.innerHTML = '<p>No auctions found.</p>';
        return;
    }

    auctions.forEach((auction) => {
        const auctionDiv = document.createElement('div');
        auctionDiv.className = 'auction';
        auctionDiv.innerHTML = `
            <h2>${auction.title}</h2>
            <p>${auction.description}</p>
            <p>Expires: ${new Date(auction.expirationDate).toLocaleString()}</p>
            <p>Starting Bid: $${auction.startingPrice}</p>
            <p>Current Bid: $${auction.currentPrice || 'No bids yet'}</p>
        `;
        auctionDiv.classList.add('auction-item');
        // Create a link to auction details page with the auction ID
        console.log(auction);  // Log each auction to verify if both are present
        const auctionLink = document.createElement('a');
        auctionLink.href = `/auction-details.html?id=${auction._id}`; // Link to auction details page with the ID in the query string
        auctionLink.textContent = `Click here to see more details about this auction: ${auction.title}`;
//Link to Auction Details: Each auction title is wrapped in an anchor (<a>) tag that links to auction-details.html?id=<auctionId>. The auction ID is inserted dynamically, ensuring that each auction's details page is linked with the correct ID.
        auctionDiv.appendChild(auctionLink);
        auctionList.appendChild(auctionDiv);
        console.log(auctionLink);
    });
}

// Function to check if the user is authenticated
function checkIfAuthenticated() {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage

    if (!token) {
        return false; // If there is no token, the user is not authenticated
    }

    // Optionally, you can check if the token is expired by decoding it (if necessary)
    // You can use a library like `jwt-decode` to decode the token and check its expiration

    return true; // If a token is found, consider the user authenticated
}

// Initial fetch of all auctions
document.getElementById('filterBtn').click();


  