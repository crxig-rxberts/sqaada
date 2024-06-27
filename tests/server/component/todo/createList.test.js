const request = require('supertest');
const dynamoDb = require('../../../../server/config/db');
const createTestServer = require("../../testServer");

describe('Create List', () => {
    const app = createTestServer();

    const cleanupDatabase = async () => {
        const params = {
            TableName: 'to-do-table',
        };
        const result = await dynamoDb.scan(params).promise();
        const deletePromises = result.Items.map(item =>
            dynamoDb.delete({ TableName: 'to-do-table', Key: { listId: item.listId } }).promise()
        );
        await Promise.all(deletePromises);
    };

    beforeEach(cleanupDatabase);
    afterEach(cleanupDatabase);

    it('should create a new list', async () => {
        const response = await request(app)
            .post('/api/to-do-list/')
            .send({ name: 'Test List' });

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('SUCCESS');
        expect(response.body.listId).toBeDefined();

        // Verify the list was actually created in the database
        const result = await dynamoDb.get({
            TableName: 'to-do-table',
            Key: { listId: response.body.listId }
        }).promise();

        expect(result.Item).toBeDefined();
        expect(result.Item.name).toBe('Test List');
        expect(result.Item.items).toEqual([]);
    });

    it('should return an error for invalid input', async () => {
        const response = await request(app)
            .post('/api/to-do-list/')
            .send({});

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe('FAIL');
        expect(response.body.errorMessage).toBe('List name cannot be empty');
    });
});