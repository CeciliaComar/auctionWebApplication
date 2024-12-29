document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id'); // Get the user ID from the URL
  
    if (!userId) {
      alert('No user ID provided.');
      return;
    }
  
    try {
      // Fetch user details from the backend
      const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: 'GET',
      });
  
      if (!response.ok) {
        const error = await response.json();
        alert(`Failed to fetch user details: ${error.message}`);
        return;
      }
  
      const data = await response.json();
      const user = data.user;
  
      // Populate the page with the user details
      document.getElementById('user-username').textContent = user.username;
      document.getElementById('user-name').textContent = user.name;
      document.getElementById('user-surname').textContent = user.surname;
      document.getElementById('user-createdAt').textContent = new Date(user.createdAt).toLocaleString();
    } catch (error) {
      console.error('Error fetching user details:', error);
      alert('An error occurred while fetching user details.');
    }
  });
  