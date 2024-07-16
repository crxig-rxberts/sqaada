const request = require('supertest');
const { DynamoDBDocumentClient, ScanCommand, DeleteCommand, GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const dynamoDb = require('../../../../server/config/db');
const createTestServer = require('../../testServer');
const { v4: uuidv4 } = require('uuid');

describe('List Deletion', () => {
  const app = createTestServer();

  const cleanupDatabase = async () => {
    const params = {
      TableName: 'to-do-table',
    };
    const result = await dynamoDb.send(new ScanCommand(params));
    const deletePromises = result.Items.map(item =>
        dynamoDb.send(new DeleteCommand({ TableName: 'to-do-table', Key: { listId: item.listId } }))
    );
    await Promise.all(deletePromises);
  };

  beforeEach(cleanupDatabase);
  afterEach(cleanupDatabase);

  it('should delete a list', async () => {
    const testListId = uuidv4();
    await dynamoDb.send(new PutCommand({
      TableName: 'to-do-table',
      Item: {
        listId: testListId,
        name: 'Test Deletion List',
        items: []
      }
    }));

    const response = await request(app).delete(`/api/to-do-list/${testListId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('SUCCESS');
    expect(response.body.message).toBe('List deleted successfully');

    // Verify the list was actually deleted from the database
    const result = await dynamoDb.send(new GetCommand({
      TableName: 'to-do-table',
      Key: { listId: testListId }
    }));

    expect(result.Item).toBeUndefined();
  });

  it('should return an error for non-existent list ID', async () => {
    const nonExistentId = uuidv4();
    const response = await request(app).delete(`/api/to-do-list/${nonExistentId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('FAIL');
    expect(response.body.message).toBe('List not found');
  });
});