const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const credentials = {
    username: e.target.username.value,
    password: e.target.password.value,
  };

  try {
    const response = await fetch('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      alert(`Login failed: ${error.message}`);
    } else {
      const data = await response.json();
      console.log(data);
      // After a successful login
      const { token } = data;  // Token received from the server, extracted from data
      localStorage.setItem('token', token);  // Store the new token in localStorage

      //localStorage.setItem('token', data.token); // Store JWT
      alert('Login successful!');
      console.log('here is the token stored:', localStorage.getItem('token'));
      window.location.href = 'index.html';
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while logging in.');
  }
});
