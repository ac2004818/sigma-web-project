const fs = require('fs');

const usersFilePath = './Data_Provider/user.json';
const itemsFilePath = './Data_Provider/item.json';
const SellersFilePath = './Data_Provider/Seller.json';


const getSellers = () => {
    const usersData = fs.readFileSync(SellersFilePath);
    
    return JSON.parse(usersData);
};
const saveSellers = (Sellers) => {
    fs.writeFileSync(SellersFilePath, JSON.stringify(Sellers, null, 2));
};
const getUsers = () => {
    const usersData = fs.readFileSync(usersFilePath);
    
    return JSON.parse(usersData);
};

const getItems = () => {
    const itemsData = fs.readFileSync(itemsFilePath);
    return JSON.parse(itemsData);
};

const saveUsers = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

const saveItems = (items) => {
    fs.writeFileSync(itemsFilePath, JSON.stringify(items, null, 2));
};

module.exports = {
    getUsers,
    getItems,
    saveUsers,
    saveItems,
    getSellers,
    saveSellers
};
