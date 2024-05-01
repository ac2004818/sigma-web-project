// pages/api/items/route.js

import DataRepository from '../utils/DataRepository';

const repo = new DataRepository();

export async function GET(request) {
    try {
        const items = await repo.getItems();
        Response.statusCode = 200;
        return Response.json(items);
    } catch (error) {
        Response.statusCode = 500;
        return Response.json({ error: 'Error fetching items' });
    }
}
