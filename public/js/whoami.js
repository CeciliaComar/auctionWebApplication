document.getElementById('user-info').addEventListener('click', async () => {
    const token = localStorage.getItem('token'); // Retrieve the JWT token
  
    if (!token) {
      alert('You must be logged in to view user information.');
      return;
    }
  
    try {
      const response = await fetch('/api/whoami', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        const user = data.user;
        document.getElementById('user-info').textContent = `Logged in as: ${user.username} (${user.name} ${user.surname})`;
      } else {
        const error = await response.json();
        alert(`Failed to fetch user information: ${error.message}`);
      }
    } catch (error) {
      console.error('Error fetching user information:', error);
      alert('An error occurred while fetching user information.');
    }
  });
  