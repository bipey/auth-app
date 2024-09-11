
const getInfo = async (e) => {
    e.preventDefault();  // Prevent the default form submission
    
    const formData = new FormData(e.target);  // Create a FormData object
    const data = Object.fromEntries(formData.entries());  // Convert to an object
    
    try {
        const response = await fetch('/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),  // Send the form data as JSON
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.message);  // Alert success message
            // e.target.reset();  // Reset the form after successful submission
            window.location.href = '/html/login.html';
        } else {
            const error = await response.text();
            alert(`Registration failed: ${error}`);  // Alert error message
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
};


// Attach event listener to the form
document.getElementById('registerForm').addEventListener('submit', getInfo);