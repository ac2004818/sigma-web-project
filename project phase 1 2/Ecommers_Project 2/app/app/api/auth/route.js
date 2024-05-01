// pages/api/auth/login.js

import DataRepository from '../utils/DataRepository';


const repo = new DataRepository();

export async function POST(request) {
   
  
    const { username, password } = await request.json() ;
    try {
        const user = await repo.login(username, password);
        Response.statusCode = 200;
        return Response.json(user);
    } catch (error) {
        Response.statusCode = 401;
        return Response.json({ error: 'Invalid username or password' });
    }
}
