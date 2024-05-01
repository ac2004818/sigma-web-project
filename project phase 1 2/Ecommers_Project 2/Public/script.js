// Define variables to hold user and selected item data
let current_user = null;
let selectedItem = null;

document.addEventListener('DOMContentLoaded', function() {
    // Fetch items data from the server
    fetch('http://localhost:3000/api/items')
    .then(response => response.json())
    .then(items => {
        const itemsList = document.getElementById('items-list');
        if (itemsList) { // Check if itemsList exists
            itemsList.innerHTML = '';
            items.forEach(item => {
                const li = document.createElement('li');
            //     li.innerHTML = `<div class="container">
            //     <div class="wrapper">
            //         <div class="banner-image" style="background-image: url('${item.imageUrl}');"></div>
            //         <h1>${item.name}</h1>
            //         <button class="btn outline">${item.price} QAR</button>
            //     </div>
            //     <div class="button-wrapper"> 
            //         <button class="btn fill">BUY NOW</button>
            //     </div>
            // </div>`;
            li.innerHTML = `
            <div class="container">
                <section class="card">
                    <div class="product-image" style="background-image: url('${item.imageUrl}');"></div>
                    <div class="product-info">
                        <h2>${item.name}</h2>
                        <p>${item.description}</p>
                        <div >Stock:${item.quantity}</div>   
                        <div class="price">${item.price} QR</div>
                       
                    </div>
                    <div class="btn">
                        <button class="buy-btn">Buy Now</button>
                        <button class="fav">
                            <svg class="svg" id="i-star" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                                <path d="M16 2 L20 12 30 12 22 19 25 30 16 23 7 30 10 19 2 12 12 12 Z" />
                            </svg>
                        </button>
                    </div>
                </section>
            </div>
        `;
        
                // Add event listener to the "BUY NOW" button
                const buyButton = li.querySelector('.buy-btn');
                if (buyButton) { // Check if buyButton exists
                    buyButton.addEventListener('click', () => redirectToCheckout(item));
                }
                itemsList.appendChild(li);
            });
        } else {
            console.error('Error: items-list element not found.');
        }
    })
    .catch(error => console.error('Error fetching items:', error));


    // Function to redirect to checkout page and save selected item in local storage
    function redirectToCheckout(item) {
        // Store the selected item in local storage
        const urlParams = new URLSearchParams(window.location.search);
        const userdata = urlParams.get('user');
        const user=JSON.parse(decodeURIComponent(userdata))
        
        
        // Redirect to checkout page
        window.location.href = `checkout.html?user=${encodeURIComponent(JSON.stringify({ key: user }))}&item=${encodeURIComponent(JSON.stringify({ key: item }))}`;
    
    }
document.getElementById('history-button').addEventListener('click',function(e){
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const userdata = urlParams.get('user');
    const user=JSON.parse(decodeURIComponent(userdata)).key
    window.location.href=`History.html?id=${user.id}`;
})
document.getElementById('Sign-in').addEventListener('click',function(e){
    e.preventDefault();

    window.location.href=`login.html`;
})

    // Search functionality
    document.getElementById('search-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const searchInput = document.getElementById('search-input').value.toLowerCase(); // Get the search query and convert to lowercase for case-insensitive matching
        const items = document.querySelectorAll('.container h2'); // Select all item names
        items.forEach(item => {
            const itemName = item.textContent.toLowerCase(); // Get the item name and convert to lowercase
            if (itemName.includes(searchInput)) {
                item.parentElement.parentElement.style.display = 'block'; // Show the item if it matches the search query
            } else {
                item.parentElement.parentElement.style.display = 'none'; // Hide the item if it doesn't match the search query
            }
        });
    });
});
