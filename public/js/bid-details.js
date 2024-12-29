document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const bidId = urlParams.get('id'); // Assuming the URL is /bid-details.html?id=12345
  
    if (!bidId) {
      alert('No bid ID provided.');
      return;
    }
  
    try {
      // Fetch bid details
      const response = await fetch(`http://localhost:3000/api/bids/${bidId}`);
      if (!response.ok) {
        const error = await response.json();
        alert(`Failed to fetch bid details: ${error.message}`);
        return;
      }
  
      const data = await response.json();
      const bid = data.bid;
  
      // Display bid details
      document.getElementById('bid-amount').textContent = `$${bid.amount}`;
      document.getElementById('bid-user').textContent = `${bid.user.name} (${bid.user.username})`;
      document.getElementById('bid-auction').textContent = bid.auction.title;
      document.getElementById('bid-created-at').textContent = new Date(bid.createdAt).toLocaleString();
    } catch (error) {
      console.error('Error fetching bid details:', error);
      alert('An error occurred while fetching bid details.');
    }
  });
  