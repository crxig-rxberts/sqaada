const request = require('supertest');
const dynamoDb = require('../../../../server/config/db');
const createTestServer = require('../../testServer');
const { v4: uuidv4 } = require('uuid');

describe('Get All Lists', () => {
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

  it('should retrieve all lists', async () => {
    const testListId = uuidv4();
    await dynamoDb.put({
      TableName: 'to-do-table',
      Item: {
        listId: testListId,
        name: 'Test Retrieval List',
        items: []
      }
    }).promise();

    const response = await request(app).get('/api/to-do-list/');

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('SUCCESS');
    expect(Array.isArray(response.body.lists)).toBe(true);
    expect(response.body.lists.length).toBe(1);
    expect(response.body.lists[0].listId).toBe(testListId);
  });

  it('should retrieve an empty array when no lists exist', async () => {
    const response = await request(app).get('/api/to-do-list/');

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('SUCCESS');
    expect(Array.isArray(response.body.lists)).toBe(true);
    expect(response.body.lists).toEqual([]);
  });
});
