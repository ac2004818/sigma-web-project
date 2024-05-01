const { PrismaClient } = require('@prisma/client');
class DataRepository {
    constructor() {
      this.prisma = new PrismaClient();
    }
    async getSellerHistory(sellerId) {
      try {
        const transactions = await this.prisma.transaction.findMany({
          where: {
            sellerId: sellerId,
          },
          include: {
            item: true, // Include associated item details
          },
        });
        return transactions;
      } catch (error) {
        throw new Error('Error fetching seller transactions: ' + error.message);
      }
    }
    async getselleritems(sellerId) {
      try {
        const items = await this.prisma.item.findMany({
          where: {
            sellerId: sellerId,
          }
        });
       
        return items;
      } catch (error) {
        throw new Error('Error fetching seller transactions: ' + error.message);
      }
    }
    
    async getHistory(buyerId) {
      try {
        const transactions = await this.prisma.transaction.findMany({
          where: {
            buyerId: buyerId,
          },
          include: {
            item: true, // Include associated item details
          },
        });
        return transactions;
      } catch (error) {
        throw new Error('Error fetching transactions: ' + error.message);
      }
    }
    
    // DataRepository.js
async getTopProductsBySales() { //--
  const result = await this.prisma.transaction.groupBy({
      by: ['itemId'],
      orderBy: {
          _sum: {
              quantity: 'desc'
          }
      },
      _sum: {
          quantity: true
      },
      take: 5
  });
  return result;
}
// DataRepository.js
// DataRepository.js
// DataRepository.js
async getAverageQuantitySoldPerProduct() {
  const result = await this.prisma.transaction.groupBy({
      by: ['itemId'],
      _avg: {
          quantity: true
      }
  });
  return result;
}



// DataRepository.js
async getBuyersPerLocation() { //--
  try {
    const result = await this.prisma.buyer.groupBy({
      by: ["city", "Country"],
      _count: true,
    });
    return result;
  } catch (error) {
    throw new Error('Error fetching buyers per location: ' + error.message);
  }
}

// DataRepository.js
async getAveragePurchaseAmountPerBuyer() {
  const result = await this.prisma.transaction.groupBy({
      by: ['buyerId'],
      _avg: {
          totalPrice: true
      }
  });
  return result;
}
// DataRepository.js
async getTotalPurchasesPerSeller() {  //--
  const result = await this.prisma.transaction.groupBy({
      by: ['sellerId'],
      _count: true
  });
  return result;
}

  
    // DataRepository.js
    async getTotalRevenuePerMonth(year) {
      try {
        const result = await this.prisma.transaction.groupBy({
          select: {
            _sum: {
              select: {
                totalPrice: true,
              },
            },
            date: true,
          },
          by: ["date"],
          where: {
            AND: [
              {
                date: {
                  gte: new Date(year, 0, 1), // Start of the year
                },
              },
              {
                date: {
                  lt: new Date(year, 12, 1), // Start of the next year
                },
              },
            ],
          },
        });
        return result;
      } catch (error) {
        throw new Error('Error fetching total revenue per month: ' + error.message);
      }
    }
    

    async login(username, password) {
      try {
          // Check if the user is a buyer
          let user = await this.prisma.buyer.findUnique({
              where: {
                  username,
              },
          });
          
          // If user is not found or password is incorrect, check if the user is a seller
          if (!user || user.password !== password) {
              user = await this.prisma.seller.findUnique({
                  where: {
                      username,
                  },
              });
              
              // If user is not found or password is incorrect for seller as well, throw an error
              if (!user || user.password !== password) {
                  throw new Error('Invalid username or password');
              }
          }
          
          return user;
      } catch (error) {
          throw new Error('Error during login: ' + error.message);
      }
  }
  async addItem(name, price, quantity, sellerId, imageUrl, description) {
    try {
      const newItem = await this.prisma.item.create({
        data: {
          name,
          price,
          quantity,
          sellerId,
          imageUrl,
          description
        }
      });
      console.log("done");
      return newItem;
    } catch (error) {
      throw new Error('Error adding item: ' + error.message);
    }
  }
  
  
  
    async getItems() {
      try {
        const items = await this.prisma.item.findMany();
        return items;
      } catch (error) {
        throw new Error('Error fetching items: ' + error.message);
      }
    }
    async gettransactions() {
      try {
        const Transaction = await this.prisma.Transaction.findMany();
        return Transaction;
      } catch (error) {
        throw new Error('Error fetching items: ' + error.message);
      }
    }
  
    async purchase(itemId, buyerId, quantity) {
      try {
        // Get item details
        const item = await this.prisma.item.findUnique({
          where: {
            id: itemId,
          },
        });
        if (!item) {
          throw new Error('Item not found');
        }
       
        // Calculate total price
        const totalPrice = item.price * quantity;
  
        // Check buyer's balance
        const buyer = await this.prisma.buyer.findUnique({
          where: {
            id: buyerId,
          },
        });
        if (!buyer || buyer.balance < totalPrice) {
          throw new Error('Insufficient balance');
        }
        console.log("Not error 43")
        // Create transaction
        const transaction = await this.prisma.transaction.create({
          data: {
            itemId,
            sellerId: item.sellerId,
            buyerId,
            quantity,
            totalPrice,
           
          },
        });
  
        // Update buyer's balance
        await this.prisma.buyer.update({
          where: {
            id: buyerId,
          },
          data: {
            balance: {
              decrement: totalPrice,
            },
          },
        });
  
        return transaction;
      } catch (error) {
        throw new Error('Error during purchase: ' + error.message);
      }
    }
  
    async getSellerData(id) {
      try {
        const seller = await this.prisma.seller.findUnique({
          where: {
            id,
          },
        });
        if (!seller) {
          throw new Error('Seller not found');
        }
        return seller;
      } catch (error) {
        throw new Error('Error fetching seller data: ' + error.message);
      }
    }
  
    async getUserData(id) {
      try {
        const user = await this.prisma.buyer.findUnique({
          where: {
            id,
          },
        });
        if (!user) {
          throw new Error('User not found');
        }
        return user;
      } catch (error) {
        throw new Error('Error fetching user data: ' + error.message);
      }
    }
  
    async disconnect() {
      await this.prisma.$disconnect();
    }
  }
  const obj = new DataRepository();
  // obj.login('janetbuyer', 'janet456')
  //     .then(user => console.log(user))
  //     .catch(error => console.error(error));
  module.exports = DataRepository;