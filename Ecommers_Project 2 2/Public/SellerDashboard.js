document.addEventListener('DOMContentLoaded', function() {
    // Retrieve sellerId from local storage
    const currentSeller = JSON.parse(localStorage.getItem('current_Seller'));
    const sellerId = currentSeller.id;

    // Fetch items from server
    fetch(`http://localhost:3000/api/items`)
        .then(response => response.json())
        .then(data => {
            // Display items currently selling
            const sellingItemsList = document.getElementById('selling-items');
            const soldItemsList = document.getElementById('sold-items');

            data.forEach(item => {
                const listItem = document.createElement('li');
                listItem.classList.add("nameitem")
                if(item.sellerId==sellerId){
                listItem.textContent = `${item.name} - Price: ${item.price} QR`;

                // Display sale history for all items
                if (item.saleHistory && item.saleHistory.length > 0) {
                    const saleHistoryContainer = document.createElement('div');

                    saleHistoryContainer.classList.add('sale-history-container');

                    const saleHistoryTitle = document.createElement('h4');
                    saleHistoryTitle.textContent = 'Sale History';
                    saleHistoryContainer.appendChild(saleHistoryTitle);

                    const saleHistoryList = document.createElement('ul');
                    saleHistoryList.classList.add('sale-history-list');

                    item.saleHistory.forEach(sale => {
                        const saleListItem = document.createElement('li');
                        saleListItem.classList.add("history_item")
                        saleListItem.textContent = `Buyer: ${sale.buyerUsername}, Selling Price: $${sale.totalPrice}, Quantity: ${sale.quantity}, Date: ${new Date(sale.date).toLocaleString()}`;
                        saleHistoryList.appendChild(saleListItem);
                    });

                    saleHistoryContainer.appendChild(saleHistoryList);
                    listItem.appendChild(saleHistoryContainer);
                }

                if (item.quantity > 0 && item.sellerId == sellerId) {
                    // Item is currently selling
                    sellingItemsList.appendChild(listItem);
                    listItem.addEventListener('click', () => {
                        alert(`Details of ${item.name}: Price: $${item.price}, Quantity: ${item.quantity}`);
                    });
                } else if (item.quantity === 0 && item.sellerId == sellerId) {
                    // Item has been sold
                    soldItemsList.appendChild(listItem);
                }
            }
            });
        })
        .catch(error => console.error('Error fetching items:', error));

    // Handle form submission for uploading new item
    document.getElementById("button-back").addEventListener('click',function(e)
{
    e.preventDefault();
    window.location.href="login.html";
})
    document.getElementById('upload-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const itemName = document.getElementById('item-name').value;
        const itemPrice = document.getElementById('item-price').value;
        const itemQuantity = document.getElementById('item-Quantity').value;
        const itemURL = document.getElementById('item-URL').value;

        // Construct item object
        const newItem = {
            name: itemName,
            price: parseFloat(itemPrice),
            quantity: parseInt(itemQuantity),
            sellerId: sellerId,
            imageUrl:itemURL
        };

        // Send POST request to add new item
        fetch('http://localhost:3000/api/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newItem)
        })
        .then(response => response.json())
        .then(data => {
            // Refresh page to display updated item list
            location.reload();
        })
        .catch(error => console.error('Error uploading item:', error));
    });
});
