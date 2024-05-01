
import DataRepository from '../utils/DataRepository';

 const repo = new DataRepository();

export async function GET(request) {
  try {
    
    const year = new Date().getFullYear().toString();
    const getAverageQuantitySoldPerProduct = await repo.getAverageQuantitySoldPerProduct();
   const totalRevenuePerMonth = await repo.getTotalRevenuePerMonth(year);
   const topProductsBySales = await repo.getTopProductsBySales();
    const buyersPerLocation = await repo.getBuyersPerLocation();
   const averagePurchaseAmountPerBuyer = await repo.getAveragePurchaseAmountPerBuyer();
   const totalPurchasesPerSeller = await repo.getTotalPurchasesPerSeller();

   
   return Response.json({
    getAverageQuantitySoldPerProduct,
      totalRevenuePerMonth,
      topProductsBySales,
      buyersPerLocation,
      averagePurchaseAmountPerBuyer,
      totalPurchasesPerSeller,
    });
  } catch (error) {
    Response.statusCode = 500;
    return Response.json({ error: 'Error fetching statistics', message: error.message });
  }
}
