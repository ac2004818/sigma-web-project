// pages/index.js
"use client"
import "./components/Statistics.css"
import { useState, useEffect } from 'react';
import axios from 'axios';
import Linechart from './components/linechart';
import BarChart from './components/Barchart';
import Piechart from './components/PieChart';

export default function Home() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/getStatistics');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStats();
  }, []);


// Extracting data for Line Chart
// console.log(stats)
const BarChartData_getAverageQuantitySoldPerProduct = stats && stats.getAverageQuantitySoldPerProduct.map(item => ({
  name: `Product ID ${item.itemId}`,
  Avg_quantity: item._avg.quantity
 
}));
const PieChartData_getAverageQuantitySoldPerProduct = stats && stats.totalPurchasesPerSeller.map(item => ({
  name: ` Id:${item.sellerId}`,
  count: item._count
}));

const topProductsBySalesData = stats && stats.topProductsBySales.map(item => ({
  name: ` ${item.itemId}`,
  quantity: item._sum.quantity
}));

const BarChartData_totalRevenuePerMonth = stats && stats.totalRevenuePerMonth.map(item => ({
  name: new Date(item.date).toLocaleDateString(), // Format date as needed
  totalPrice: item._sum.totalPrice,
 
}));
const averagePurchaseAmountPerBuyerData = stats && stats.averagePurchaseAmountPerBuyer.map(item => ({
  name: `Buyer ${item.buyerId}`,
  averagePurchaseAmount: item._avg.totalPrice
}));

  // Extracting data for Pie Chart
 
  const buyersPerLocationData = stats && stats.buyersPerLocation.map(item => ({
    name: `${item.city}, ${item.Country}`,
    count: item._count
}));

    return (
      <div className="app">
        <h1>Admin Dashboard</h1>
        {stats && (
          <div className="dashboard">
            <div className="chart-container">
              <h2>Total Revenue Per Month</h2>
              <BarChart data={BarChartData_totalRevenuePerMonth} datakey="totalPrice" nameSize={5} />
            </div>
            <div className="chart-container">
              <h2>Top Products by Sales</h2>
              <BarChart data={topProductsBySalesData} datakey="quantity" nameSize={30} />
            </div>
            <div className="chart-container">
              <h2>Total Average Quantity Sold Per Product</h2>
              <BarChart data={BarChartData_getAverageQuantitySoldPerProduct} datakey="Avg_quantity" nameSize={30} />
            </div>
            <div className="chart-container">
              <h2>Total Purchases Percentage Per Seller</h2>
              <Piechart data={PieChartData_getAverageQuantitySoldPerProduct} datakey="count" />
            </div>
            <div className="chart-container">
              <h2>Average Purchase Amount Per Buyer</h2>
              <BarChart data={averagePurchaseAmountPerBuyerData} datakey="averagePurchaseAmount" nameSize={30} />
            </div>
            <div className="chart-container">
              <h2>Buyers Per Location</h2>
              <Piechart data={buyersPerLocationData} datakey="count" />
            </div>
          </div>
        )}
        {!stats && <p>Loading...</p>}
      </div>
    );
  }

