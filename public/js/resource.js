const getResourceButton = document.getElementById('get-resource');
const output = document.getElementById('output');

getResourceButton.addEventListener('click', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('You must log in first.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/protected/resource', {
      headers: {
        'Authorization': `Bearer ${token}`, // Include JWT in headers
      },
    });

    if (!response.ok) {
      const error = await response.json();
      alert(`Error fetching resource: ${error.message}`);
    } else {
      const data = await response.json();
      output.textContent = JSON.stringify(data, null, 2);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while fetching the resource.');
  }
});
