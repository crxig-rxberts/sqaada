const request = require('supertest');
const dynamoDb = require('../../../../server/config/db');
const createTestServer = require("../../testServer");
const { v4: uuidv4 } = require('uuid');

describe('Add Item To List', () => {
    const app = createTestServer();
    let testListId;

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
        await dynamoDb.put({
            TableName: 'to-do-table',
            Item: {
                listId: testListId,
                name: 'Test List',
                items: []
            }
        }).promise();
    });

    afterEach(cleanupDatabase);

    it('should add an item to the list', async () => {
        const newItem = {
            name: 'New Task',
            description: 'Task Description',
            status: 'TODO',
            dueDate: '24/07/2025'
        };

        const response = await request(app)
            .post(`/api/to-do-list/${testListId}`)
            .send(newItem);

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('SUCCESS');
        expect(response.body.itemId).toBeDefined();

        // Verify item was added to the list
        const updatedList = await dynamoDb.get({
            TableName: 'to-do-table',
            Key: { listId: testListId }
        }).promise();

        expect(updatedList.Item.items).toHaveLength(1);
        expect(updatedList.Item.items[0].name).toBe(newItem.name);
        expect(updatedList.Item.items[0].description).toBe(newItem.description);
        expect(updatedList.Item.items[0].status).toBe(newItem.status);
        expect(updatedList.Item.items[0].dueDate).toBe(newItem.dueDate);
        expect(updatedList.Item.items[0].itemId).toBeDefined();
        expect(updatedList.Item.items[0].createdDate).toBeDefined();
    });

    it('should return an error when adding an item to a non-existent list', async () => {
        const nonExistentListId = uuidv4();
        const newItem = {
            name: 'New Task',
            description: 'Task Description',
            status: 'TODO',
            dueDate: '24/07/2025'
        };

        const response = await request(app)
            .post(`/api/to-do-list/${nonExistentListId}`)
            .send(newItem);

        expect(response.statusCode).toBe(404);
        expect(response.body.status).toBe('FAIL');
        expect(response.body.errorMessage).toBeDefined();
    });
});
