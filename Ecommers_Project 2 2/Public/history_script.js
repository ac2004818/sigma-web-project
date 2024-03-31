document.addEventListener('DOMContentLoaded', function() {
    // Retrieve current user data from local storage
    const currentUser = JSON.parse(localStorage.getItem('current_user'));

    // Get the purchase history container
    const historyContainer = document.getElementById('purchase-history');

    // Check if there is current user data and if it contains purchase history
    if (currentUser && currentUser.purchaseHistory && currentUser.purchaseHistory.length > 0) {
        // Loop through each purchase in the purchase history and create HTML elements to display them
        currentUser.purchaseHistory.forEach(purchase => {
            const purchaseItem = document.createElement('li');
            purchaseItem.classList.add('container');

            const cardSection = document.createElement('section');
            cardSection.classList.add('card');

            const productImage = document.createElement('div');
            productImage.classList.add('product-image');
            productImage.style.backgroundImage = `url('${purchase.itemURL}')`;
            cardSection.appendChild(productImage);

            const productInfo = document.createElement('div');
            productInfo.classList.add('product-info');
            
            const title = document.createElement('h2');
            title.textContent = purchase.itemName;
            productInfo.appendChild(title);
            
            const details = document.createElement('p');
            details.textContent = `Purchase Date: ${new Date(purchase.date).toLocaleString()}, Quantity: ${purchase.quantity}`;
            productInfo.appendChild(details);

            const price = document.createElement('div');
            price.classList.add('price');
            price.textContent = ` Total Purchase : ${purchase.totalPrice} QR`;
            productInfo.appendChild(price);

            cardSection.appendChild(productInfo);

            const buttonsDiv = document.createElement('div');
            buttonsDiv.classList.add('btn');
            cardSection.appendChild(buttonsDiv);

            purchaseItem.appendChild(cardSection);

            historyContainer.appendChild(purchaseItem);
        });
    } else {
        // If no purchase history found, display a message
        historyContainer.textContent = 'No purchase history available.';
    }
});
