const loginUser=async (e)=>{
    e.preventDefault();
    
    const formData=new FormData(e.target);
    const data=Object.fromEntries(formData.entries());
    try{
        const response=await fetch('/user/login',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(data),
        });
        if(response.ok){
            const result=await response.json();
            alert(result.message);
            window.location.href='Welcome.html';
        }else{
            const error=await response.text();
            alert(`Login failed: ${error}`);
        }
    }catch(error){
        console.error('Error:',error);
        alert('An error occurred. Please try again later.');
    }
    e.target.reset();
}
document.getElementById('loginForm').addEventListener('submit', loginUser);