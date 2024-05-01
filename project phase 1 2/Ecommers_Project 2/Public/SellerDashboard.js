document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentUserdata = urlParams.get('seller');
    const currentSeller= JSON.parse(decodeURIComponent(currentUserdata)).key
    console.log(currentSeller)
    let sellerId = currentSeller.id;

    // Fetch items from server
    fetch('http://localhost:3000/api/selleritemsbyid', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: sellerId }) // Replace 'your_seller_id_here' with the actual seller ID
})
        .then(response => response.json())
        .then(data => {
            // Display items currently selling
            const sellingItemsList = document.getElementById('selling-items');
            const soldItemsList = document.getElementById('sold-items');

            data.forEach(item => {
                const listItem = document.createElement('li');
                listItem.classList.add("nameitem")
                listItem.textContent = `${item.name} - Price: ${item.price} QR`;

        fetch(`http://localhost:3000/api/sellingHistory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: sellerId })
        })
        .then(response => response.json())
        .then(transactions => {
            transactions = transactions.filter(transaction=>transaction.itemId==item.id)
            console.log(transactions)
                // Display sale history for all items
                if (transactions && transactions.length > 0) {
                    console.log("hello")
                    const saleHistoryContainer = document.createElement('div');

                    saleHistoryContainer.classList.add('sale-history-container');

                    const saleHistoryTitle = document.createElement('h4');
                    saleHistoryTitle.textContent = 'Sale History';
                    saleHistoryContainer.appendChild(saleHistoryTitle);

                    const saleHistoryList = document.createElement('ul');
                    saleHistoryList.classList.add('sale-history-list');

                    transactions.forEach(sale => {
                        const saleListItem = document.createElement('li');
                        saleListItem.classList.add("history_item")
                        saleListItem.textContent = `Buyer: ${sale.buyerId}, Selling Price: $${sale.totalPrice}, Quantity: ${sale.quantity}, Date: ${new Date(sale.date).toLocaleString()}`;
                        saleHistoryList.appendChild(saleListItem);
                    });

                    saleHistoryContainer.appendChild(saleHistoryList);
                    listItem.appendChild(saleHistoryContainer);
                }
            })

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
        const itemdescription = document.getElementById('item-description').value;
            sellerId=sellerId.toString();
        // Construct item object
        const newItem = {
            name: itemName,
            price: parseFloat(itemPrice),
            quantity: parseInt(itemQuantity),
            sellerId: sellerId,
            imageUrl:itemURL,
            description:itemdescription
        };

        // Send POST request to add new item
        fetch('http://localhost:3000/api/additem', {
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
