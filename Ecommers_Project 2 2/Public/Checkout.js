document.getElementById('purchase-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission behavior

    const quantity = parseInt(document.getElementById('quantity').value);
    const shippingAddress = document.getElementById('shipping-address').value;

    // Retrieve selected item data from local storage
    const selectedItem = JSON.parse(localStorage.getItem('selectedItem'));
    
    // Retrieve user data from local storage
    let currentUser = JSON.parse(localStorage.getItem('current_user'));

    // Check if currentUser is null, redirect to login.html if not logged in
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Check if selectedItem is not null and has all necessary properties
    if (selectedItem && selectedItem.price && quantity) {
        // Calculate total cost based on item price and quantity
        const totalPrice = quantity * selectedItem.price;

        // Check if the user has enough balance
        if (currentUser && currentUser.balance >= totalPrice) {
            // Prepare data for the request
            const data = {
                username: currentUser.username,
                itemId: selectedItem.id,
                quantity: quantity
            };

            // Send POST request to the server
            fetch('http://localhost:3000/api/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(responseData => {
                if (responseData.message === 'Purchase successful' && responseData.user) {
                    // Update the user data in local storage
                    currentUser = responseData.user;
                    localStorage.setItem('current_user', JSON.stringify(currentUser));

                    // Redirect to home page after successful purchase
                    window.location.href = 'index.html';
                } else {
                    throw new Error('Purchase failed');
                }
            })
            .catch(error => {
                // Display error message to the user
                console.error('Purchase error:', error.message);
                alert('Purchase failed. Please try again later.');
            });
        } else {
            // Display an error message to the user
            alert('Insufficient balance. Please add funds to your account.');
        }
    
    } else {
        // Handle case where selectedItem or its properties are missing
        alert('Please select an item and enter quantity.');
    }
});
