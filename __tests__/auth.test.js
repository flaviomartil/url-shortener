// __tests__/auth.test.js
const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');

describe('Authentication', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should register a user', async () => {
        const res = await request(app).post('/api/auth/register').send({
            email: 'test@example.com',
            password: 'password123'
        });
        expect(res.statusCode).toEqual(201);
    });

    it('should login a user', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'test@example.com',
            password: 'password123'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});
