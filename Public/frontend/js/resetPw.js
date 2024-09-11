document.getElementById('changePasswordForm').addEventListener('submit', async function (event) {
    try {
        const formObject = new FormData(event.target);
        const data = Object.fromEntries(formObject.entries());
        event.preventDefault();
        const response = await fetch('/user/changePassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });
    
        if (response.ok) {
            const result = await response.json();
            alert(result.message);
            window.location.href = '../html/login.html';
        }
        else {
            const error = await response.text();
            alert(`Error: ${error}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }

})