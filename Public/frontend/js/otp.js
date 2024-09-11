// Select the form element and the submit button
const otpForm = document.querySelector("form[name='otpForm']");
const submitButton = otpForm.querySelector("button[type='submit']");

// Function to handle OTP submission
const submitOTP = async (e) => {
    e.preventDefault();  // Prevent the default form submission
    
    try {
        // Disable the submit button to prevent multiple clicks
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";  // Optionally change button text
        
        // Get the OTP value entered by the user
        const otpInput = document.querySelector("input[name='otp']").value;

        // Send OTP to backend for verification
        const response = await fetch('/user/verifyOTP', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ otp: otpInput }),  // Send OTP as JSON
        });

        // Handle the response from the server
        if (response.ok) {
            const result = await response.json();
            alert(result.message);  // Show success message
            window.location.href = 'forgetPassword.html';  // Redirect to welcome page
        } else {
            const error = await response.text();
            alert(`OTP verification failed: ${error}`);  // Show error message
        }
    } catch (error) {
        console.error('Error:', error);  // Log any error that occurs during fetch
        alert('An error occurred. Please try again later.');
    } finally {
        // Re-enable the submit button in case of error
        submitButton.disabled = false;
        submitButton.textContent = "Submit";  // Reset button text
    }
};

// Attach event listener to the form to handle submission
otpForm.addEventListener('submit', submitOTP);
