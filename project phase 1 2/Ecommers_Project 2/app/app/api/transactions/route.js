// pages/api/transactions/route.js

 import DataRepository from '../utils/DataRepository';

const repo = new DataRepository();

export async function POST(request) {
    const { itemId, buyerId, quantity } = await request.json();
    console.log(itemId, buyerId, quantity)
    try {
        const transaction = await repo.purchase(itemId, buyerId, quantity);
        Response.statusCode=201;
        
        return Response.json({message : 'Purchase successful'});
    } catch (error) {
        Response.statusCode=500;
        return  Response.json({ error: 'Error processing transaction' });
    }
}
export async function GET(request) {
  
    try {
        const transactions = await repo.gettransactions();
        Response.statusCode=201;
        
        return Response.json(transactions);
    } catch (error) {
        Response.statusCode=500;
        return  Response.json({ error: 'Error getting transactions' });
    }
}
