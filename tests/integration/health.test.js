const request = require('supertest');
const app = require('../../server/app');
const { pool } = require('../../server/config/db');

describe('Health Endpoints Integration Test', () => {
    afterAll(async () => {
        if (pool) {
            await pool.end();
        }
    });

    it('GET /health should return health payload', async () => {
        const response = await request(app).get('/health');
        expect([200, 503]).toContain(response.status);
        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('checks.database');
    });

    it('GET /api/health should return status ok', async () => {
        const response = await request(app).get('/api/health');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'ok');
    });

    it('GET /api/ready should return readiness status', async () => {
        const response = await request(app).get('/api/ready');
        expect([200, 503]).toContain(response.status);
        expect(response.body).toHaveProperty('success');
    });
});
