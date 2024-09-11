const userElement = document.querySelector(".user");

// Function to get user profile
const getUserProfile = async () => {
    try {
        // Fetch the user profile data from the server
        const response = await fetch('/user/getProfile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Add authentication token if needed
                // 'Authorization': 'Bearer your-token-here'
            }
        });

        // If the response is OK, parse the JSON data
        if (response.ok) {
            const uname = await response.json();
            userElement.textContent = uname.data.fullName;
        } else {
            // Handle when the user is not authenticated or any error occurs
            userElement.textContent = 'Guest';
            console.error('Failed to fetch user profile:', response.statusText);
        }
    } catch (error) {
        // Catch and display errors that occur during fetch
        console.error('Error fetching user profile:', error);
        userElement.textContent = 'Guest';
    }
}

// Function to logout the user
const logoutUser = async () => {
    try {
        const response = await fetch('/user/logout', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const result = await response.json();
            window.location.href = 'login.html';  // Redirect to login page
            alert(result.message);  // Show the logout message before redirect
            
        } else {
            alert('Failed to logout.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }   
}


// Attach the event listener for the logout button
document.getElementById('logout').addEventListener('click', (e) => {
    e.preventDefault();  // Prevent default link action
    logoutUser();
});
document.getElementById('resetPassword').addEventListener('click', (e)=>{
    window.location.href='resetPw.html';
});

// Call the function to get the profile on page load
getUserProfile();