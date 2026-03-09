const request = require('supertest');
const app = require('../../server');
const { pool } = require('../../db');

describe('Health Endpoints Integration Test', () => {
    // Teardown logic to ensure CI doesn't hang
    afterAll(async () => {
        // Close the database connection pool
        if (pool) {
            await pool.end();
        }
    });

    it('GET /health should return status ok', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'ok');
    });

    it('GET /api/health should return status ok', async () => {
        const response = await request(app).get('/api/health');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'ok');
    });
});
