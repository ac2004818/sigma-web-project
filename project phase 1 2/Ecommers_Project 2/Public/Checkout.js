const urlParams = new URLSearchParams(window.location.search);
    const currentUserdata = urlParams.get('user');
    const currentUser= JSON.parse(decodeURIComponent(currentUserdata)).key;
    const selectedItemdata =urlParams.get('item')
    const selectedItem=JSON.parse(decodeURIComponent(selectedItemdata)).key;
// Function to handle change event on payment method radio buttons
function handlePaymentMethodChange() {
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

    // Check if the selected payment method is Apple Pay or Credit Card
    if (paymentMethod === 'apple-pay' || paymentMethod === 'debit-card') {
        // Display the payment information UI
        document.getElementById('payment-info-container').style.display = 'block';
    } else {
        // Hide the payment information UI if another payment method is selected
        document.getElementById('payment-info-container').style.display = 'none';
    }
}

// Add event listener to payment method radio buttons
const paymentMethodRadios = document.querySelectorAll('input[name="payment-method"]');
paymentMethodRadios.forEach(radio => {
    radio.addEventListener('change', handlePaymentMethodChange);
});

document.getElementById('purchase-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission behavior

    const quantity = parseInt(document.getElementById('quantity').value);
    const shippingAddress = document.getElementById('shipping-address').value;

    // Retrieve selected item data from local storage
    
    
    // Retrieve user data from local storage
 const urlParams = new URLSearchParams(window.location.search);
    const currentUserdata = urlParams.get('user');
    const currentUser= JSON.parse(decodeURIComponent(currentUserdata)).key.key
    const selectedItemdata =urlParams.get('item')
    const selectedItem=JSON.parse(decodeURIComponent(selectedItemdata)).key
    

    
console.log(currentUser)
  //  Check if currentUser is null, redirect to login.html if not logged in
    // if (!currentUser.id) {
    //     window.location.href = 'login.html';
    //     return;
    // }



    // Check if selectedItem is not null and has all necessary properties
    if (selectedItem && selectedItem.price && quantity) {
        // Calculate total cost based on item price and quantity
        const totalPrice = quantity * selectedItem.price;
console.log(totalPrice,currentUser.balance)
        // Check if the user has enough balance
        if (currentUser && currentUser.balance >= totalPrice) {
            // Prepare data for the request
            const data = {
                buyerId: currentUser.id,
                itemId: selectedItem.id,
                quantity: quantity
            };

            // Send POST request to the server
            fetch('http://localhost:3000/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(responseData => {
                if (responseData.message === 'Purchase successful') {
                    // Redirect to home page after successful purchase
                    alert("Purchase successful")
                    window.location.href = `index.html?user=${currentUser}`;
                } else {
                    throw new Error('Purchase failed');
                    alert("Purchase failed")
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
