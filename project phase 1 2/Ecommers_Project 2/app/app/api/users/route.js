// pages/api/users/route.js

import DataRepository from '../utils/DataRepository';

const repo = new DataRepository();

export async function GET(request) {
    const { id } = await request.json();
    try {
        const userData = await repo.getUserData(id);
        Response.statusCode=200;
       return response.json(userData);
    } catch (error) {
        Response.statusCode=404;
        return response.json({ error: 'User not found' });
    }
}
