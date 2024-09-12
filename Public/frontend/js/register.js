const getInfo = async (e) => {
    e.preventDefault();  // Prevent the default form submission

    // Clear previous error messages
    clearErrors();

    const formData = new FormData(e.target);  // Create a FormData object
    const data = Object.fromEntries(formData.entries());  // Convert to an object

    // Client-side validation before sending data to the backend
    const validationErrors = validateForm(data);
    if (validationErrors.length > 0) {
        displayErrors(validationErrors);
        return;  // Stop execution if there are validation errors
    }

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
            // Optionally reset the form after successful submission
            // e.target.reset();  
            window.location.href = 'login.html';  // Redirect to login page
        } else {
            const error = await response.json();
            alert(`Registration failed: ${error.message}`);  // Alert error message
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
};

// Validate form data (client-side)
const validateForm = (data) => {
    const errors = [];
    const { fullName, email, userName, password, confirmPassword } = data;

    if (!fullName.trim()) {
        errors.push({ field: 'fullName', message: 'Name is required' });
    }
    if (!email.trim() || !isValidEmail(email)) {
        errors.push({ field: 'email', message: 'Valid email is required' });
    }
    if (!userName.trim()) {
        errors.push({ field: 'userName', message: 'Username is required' });
    }
    if (password.length < 6) {
        errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
    }
    if (password !== confirmPassword) {
        errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
    }

    return errors;
};

// Simple email validation function
const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

// Display errors on the form
const displayErrors = (errors) => {
    errors.forEach(error => {
        const errorElement = document.getElementById(`${error.field}Error`);
        if (errorElement) {
            errorElement.textContent = error.message;
        }
    });
};

// Clear all error messages
const clearErrors = () => {
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(element => {
        element.textContent = '';
    });
};

// Attach event listener to the form
document.getElementById('registerForm').addEventListener('submit', getInfo);
