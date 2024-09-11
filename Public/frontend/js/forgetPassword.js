document.getElementById('changePasswordForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageElement = document.getElementById('message');

    if (newPassword !== confirmPassword) {
        messageElement.textContent = 'New passwords do not match.';
        return;
    }

    try {
        const response = await fetch('/user/forgetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                
                newPassword,confirmPassword
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);  
            messageElement.textContent = data.message;
            messageElement.style.color = 'green';
            window.location.href = '../html/login.html';
        } else {
            
            messageElement.textContent = `errror: ${response.json().message}`;
        }
    } catch (error) {
        messageElement.textContent = `Error: ${error.message}`;
    }
});
