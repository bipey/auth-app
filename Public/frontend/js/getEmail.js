// Select the form element
const emailForm = document.querySelector("form[name='emailForm']");
const submitButton = document.querySelector("button[name='getEmail']");  // Select the Submit button

// Function to handle email submission and OTP request
const getEmail = async (e) => {
    e.preventDefault();  // Prevent default form submission
    
    try {
        // Disable the submit button to prevent multiple clicks
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";  // Optionally change button text

        // Get the email input value
        const emailInput = document.querySelector("input[name='email']").value;

        // Send email to backend for OTP generation
        const response = await fetch('/user/sendOTP', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: emailInput }),  // Send the email in JSON format
        });

        // Handle the response from the server
        if (response.ok) {
            const result = await response.json();
            alert(result.message);  // Show success message
            window.location.href = 'otp.html';  // Redirect to OTP entry page
        } else {
            const error = await response.text();
            alert(`Failed to send OTP: ${error}`);  // Show error message
        }
    } catch (error) {
        console.error('Error:', error);  // Log any error that occurs during fetch
        alert('An error occurred. Please try again later.');
    } finally {
        // Re-enable the submit button in case of an error
        submitButton.disabled = false;
        submitButton.textContent = "Submit";  // Reset button text
    }
};

// Attach event listener to the form to handle submission
emailForm.addEventListener('submit', getEmail);
