const signupForm = document.getElementById('signup-form');

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = {
    username: e.target.username.value,
    password: e.target.password.value,
    name: e.target.name.value,
    surname: e.target.surname.value,
  };

  try {
    const response = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = await response.json();
      alert(`Signup failed: ${error.message}`);
    } else {
      const data = await response.json();
      alert('Signup successful! You can now proceed with the login!');
      window.location.href = 'signin.html';
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while signing up.');
  }
});
