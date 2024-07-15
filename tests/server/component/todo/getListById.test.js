const request = require('supertest');
const dynamoDb = require('../../../../server/config/db');
const createTestServer = require('../../testServer');
const { v4: uuidv4 } = require('uuid');

describe('Get List By ID', () => {
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

  it('should retrieve a specific list by ID', async () => {
    const testListId = uuidv4();
    await dynamoDb.put({
      TableName: 'to-do-table',
      Item: {
        listId: testListId,
        name: 'Test Retrieval List',
        items: []
      }
    }).promise();

    const response = await request(app).get(`/api/to-do-list/${testListId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('SUCCESS');
    expect(response.body.list.listId).toBe(testListId);
    expect(response.body.list.name).toBe('Test Retrieval List');
  });

  it('should return a 404 for non-existent list ID', async () => {
    const nonExistentId = uuidv4();
    const response = await request(app).get(`/api/to-do-list/${nonExistentId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('FAIL');
    expect(response.body.errorMessage).toBe('List not found');
  });
});
