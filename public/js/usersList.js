document.getElementById('search-users').addEventListener('input', async (e) => {
    const query = e.target.value;  // Get the search query from the input field

    try {
        const response = await fetch(`/api/users?q=${query}`, {
            method: 'GET',
        });

        if (response.ok) {
            const data = await response.json();
            const users = data.users;
            const usersList = document.getElementById('users-list');
            usersList.innerHTML = ''; // Clear the existing list

            users.forEach(user => {
                const userItem = document.createElement('li');
                userItem.innerHTML = `
          ${user.username} (${user.name} ${user.surname})
          <button class="view-details" data-id="${user._id}">View Details</button>
        `;
                document.getElementById('users-list').appendChild(userItem);
            });

            // Add event listener for "View Details" button
            document.querySelectorAll('.view-details').forEach(button => {
                button.addEventListener('click', (event) => {
                    const userId = event.target.getAttribute('data-id');
                    window.location.href = `user-details.html?id=${userId}`;
                });
            });
        } else {
            alert('Failed to fetch users.');
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        alert('An error occurred while fetching users.');
    }
});
