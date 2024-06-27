const request = require('supertest');
const dynamoDb = require('../../../../server/config/db');
const createTestServer = require("../../testServer");
const { v4: uuidv4 } = require('uuid');

describe('Get Item From List', () => {
    const app = createTestServer();
    let testListId, testItemId;

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

    beforeEach(async () => {
        await cleanupDatabase();
        testListId = uuidv4();
        testItemId = uuidv4();
        await dynamoDb.put({
            TableName: 'to-do-table',
            Item: {
                listId: testListId,
                name: 'Test List',
                items: [{
                    name: 'Test Task',
                    itemId: testItemId,
                    description: 'Test Description',
                    createdDate: '2024-06-27',
                    status: 'TODO',
                    dueDate: '24/07/2025'
                }]
            }
        }).promise();
    });

    afterEach(cleanupDatabase);

    it('should get an item from the list', async () => {
        const response = await request(app).get(`/api/to-do-list/${testListId}/${testItemId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('SUCCESS');
        expect(response.body.item).toBeDefined();
        expect(response.body.item.itemId).toBe(testItemId);
        expect(response.body.item.name).toBe('Test Task');
        expect(response.body.item.description).toBe('Test Description');
        expect(response.body.item.status).toBe('TODO');
        expect(response.body.item.dueDate).toBe('24/07/2025');
        expect(response.body.item.createdDate).toBe('2024-06-27');
    });

    it('should return a 404 error when getting a non-existent item', async () => {
        const nonExistentItemId = uuidv4();
        const response = await request(app).get(`/api/to-do-list/${testListId}/${nonExistentItemId}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.status).toBe('FAIL');
        expect(response.body.errorMessage).toBe('Item not found in the list');
    });

    it('should return a 404 error when getting an item from a non-existent list', async () => {
        const nonExistentListId = uuidv4();
        const response = await request(app).get(`/api/to-do-list/${nonExistentListId}/${testItemId}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.status).toBe('FAIL');
        expect(response.body.errorMessage).toBe('List not found');
    });
});
