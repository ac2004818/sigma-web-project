const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
  
    // Read JSON file
    const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    for (const sellerData of data[1]) {
        await prisma.seller.create({
          data: {
            id: sellerData.id,
            username: sellerData.username,
            password: sellerData.password,
            companyName: sellerData.companyName,
            bankAccount: sellerData.bankAccount
          }
        });
      }
    // Populate items
    for (const itemData of data[0]) {
      await prisma.item.create({
        data: {
          id: itemData.id,
          name: itemData.name,
          price: itemData.price,
          quantity: itemData.quantity,
          seller: { connect: { id: itemData.sellerId } },
          imageUrl: itemData.imageUrl,
          description: itemData.description
        }
      });
    }

    // Populate sellers
    

    // Populate buyers
    for (const buyerData of data[2]) {
      await prisma.buyer.create({
        data: {
          id: buyerData.id,
          username: buyerData.username,
          password: buyerData.password,
          firstName: buyerData.firstName,
          lastName: buyerData.lastName,
          address: buyerData.address,
          city: buyerData.city,
          Country: buyerData.Country,
          balance: buyerData.balance
        }
      });
    }

    // Populate transactions
    for (const transactionData of data[3]) {
      await prisma.transaction.create({
        data: {
          id: transactionData.id,
          item: { connect: { id: transactionData.itemId } },
          seller: { connect: { id: transactionData.sellerId } },
          buyer: { connect: { id: transactionData.buyerId } },
          quantity: transactionData.quantity,
          totalPrice: transactionData.totalPrice,
          date: transactionData.date
        }
      });
    }

    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
