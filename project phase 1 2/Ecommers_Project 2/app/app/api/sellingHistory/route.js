import DataRepository from '../utils/DataRepository';

const repo = new DataRepository();
export async function POST(request) {
    const { sellerid } = await request.json(); // Extract sellerId from request body
    try {
      const History = await repo.getSellerHistory(sellerid);
      
        Response.statusCode= 200
        return Response.json(History)
      
    } catch (error) {
     
        Response.statusCode=500;
        return  Response.json({ error: 'Error fetching history transactions' });
      
    }
  }
  