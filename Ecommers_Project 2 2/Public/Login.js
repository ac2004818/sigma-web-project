
// Sample login functionality
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send request to server to validate login
    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Invalid username or password');
        }
    })
    .then(data => {
        localStorage.clear();
        if(data.user){
        // Save user data in local storage
        localStorage.setItem('current_user', JSON.stringify(data.user));   
        // Redirect to index.html if login is successful
        window.location.href = 'index.html';
        }
        else{
            localStorage.setItem('current_Seller', JSON.stringify(data.seller));   
        // Redirect to index.html if login is successful
        window.location.href = 'SellerDashboard.html';
        }
    })
    .catch(error => {
        // Handle error, e.g., display error message to the user
        console.error('Login error:', error.message);
    });
});

