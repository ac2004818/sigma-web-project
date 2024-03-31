const express = require('express');
const router = express.Router();
const { getUsers, getItems, saveUsers, saveItems, getSellers } = require('../dataHandler');

const findUserByUsernameAndPassword = (username, password) => {
    const users = getUsers();
    return users.find(user => user.username === username && user.password === password);
};

const findSellerByUsernameAndPassword = (username, password) => {
    const sellers = getSellers();
    return sellers.find(seller => seller.username === username && seller.password === password);
};

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    let user = findUserByUsernameAndPassword(username, password);
    if (user) {
        res.status(200).json({ message: 'Login successful', user });
        return;
    }
    let seller = findSellerByUsernameAndPassword(username, password);
    if (seller) {
        res.status(200).json({ message: 'Login successful', seller });
        return;
    }
    res.status(401).json({ message: 'Invalid username or password' });
});

router.get('/items', async (req, res) => {
    const items = getItems();
    res.json(items);
});

router.post('/items', async (req, res) => {
    const newItem = req.body;
    const items = getItems();
    newItem.id = (items.length + 1).toString(); // Assign a new unique ID
    items.push(newItem);
    saveItems(items);
    res.status(201).json(newItem);
});

router.get('/users', async (req, res) => {
    const users = getUsers();
    res.json(users);
});

router.post('/users', async (req, res) => {
    const newUser = req.body;
    const users = getUsers();
    newUser.id = (users.length + 1).toString(); // Assign a new unique ID
    users.push(newUser);
    saveUsers(users);
    res.status(201).json(newUser);
});
// Purchase Endpoint
router.post('/purchase', (req, res) => {
    const { username, itemId, quantity } = req.body;
console.log(username,itemId)
    // Retrieve user data from the database
    const users = getUsers();
    const sellers = getSellers()
    
    const userIndex = users.findIndex(user => user.username == username);
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }
    const user = users[userIndex];

    // Retrieve item data from the database
    const items = getItems();
    const itemIndex = items.findIndex(item => item.id == itemId);
    if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found' });
    }
    const item = items[itemIndex];
    console.log(user)
    console.log(item)

    // Check if requested quantity is available
    if (item.quantity < quantity) {
        return res.status(400).json({ message: 'Insufficient quantity available' });
    }

    // Calculate total cost
    const totalPrice = quantity * item.price;

    // Check if user has enough balance
    if (user.balance < totalPrice) {
        return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Decrease item quantity
    item.quantity -= quantity;

    // Add sale to item's sale history
    if (!item.saleHistory) {
        item.saleHistory = [];
    }
    
    // Retrieve seller username from sellerId
    const seller = sellers.find(u => u.id == item.sellerId);
    

    const sale = {
        buyerUsername: user.username,
        sellerUsername: seller.username,
        quantity,
        totalPrice,
        date: new Date().toISOString()
    };
    item.saleHistory.push(sale);

    // Update user balance
    user.balance -= totalPrice;

    // Add purchase to user's purchase history
    const purchase = {
        itemId: item.id,
        itemName: item.name,
        itemURL:item.imageUrl,
        quantity,
        totalPrice,
        date: new Date().toISOString()
    };
    if (!user.purchaseHistory) {
        user.purchaseHistory = [];
    }
    user.purchaseHistory.push(purchase);

    // Save changes to database
    saveItems(items);
    saveUsers(users);

    res.status(200).json({ message: 'Purchase successful', user });
});


module.exports = router;