import DataRepository from '../utils/DataRepository';

const repo = new DataRepository();
export async function POST(request) {
    const { id } = await request.json(); // Extract sellerId from request body
    try {
       
        const items = await repo.getselleritems(id.toString());
     
        Response.statusCode= 200
        
        return Response.json(items)
      
    } catch (error) {
     
        Response.statusCode=500;
        return  Response.json({ error: 'Error fetching items' });
      
    }
  }
  