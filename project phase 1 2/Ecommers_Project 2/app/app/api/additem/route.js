import DataRepository from '../utils/DataRepository';

const repo = new DataRepository();

export async function POST(request) {
        try {
            
            const { name, price, quantity, sellerId, imageUrl, description } = await request.json();
            console.log(sellerId)
            const newItem = await repo.addItem(name, price, quantity, sellerId, imageUrl, description);
            Response.statusCode=201
           return response.json(newItem);
        } catch (error) {
            Response.statusCode=500;
            return Response.json({ error: 'Error adding item' });
        }
   
}
