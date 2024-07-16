const request = require('supertest');
const { DynamoDBDocumentClient, ScanCommand, DeleteCommand, PutCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const dynamoDb = require('../../../../server/config/db');
const createTestServer = require('../../testServer');
const { v4: uuidv4 } = require('uuid');

describe('Delete Item From List', () => {
  const app = createTestServer();
  let testListId, testItemId;

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

  beforeEach(async () => {
    await cleanupDatabase();
    testListId = uuidv4();
    testItemId = uuidv4();
    await dynamoDb.send(new PutCommand({
      TableName: 'to-do-table',
      Item: {
        listId: testListId,
        name: 'Test List',
        items: [{
          itemId: testItemId,
          title: 'Test Item',
          description: 'Test Description',
          createdDate: new Date().toISOString().split('T')[0]
        }]
      }
    }));
  });

  afterEach(cleanupDatabase);

  it('should delete an item from the list', async () => {
    const response = await request(app).delete(`/api/to-do-list/${testListId}/${testItemId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('SUCCESS');

    // Verify item was deleted from the database
    const updatedList = await dynamoDb.send(new GetCommand({
      TableName: 'to-do-table',
      Key: { listId: testListId }
    }));

    expect(updatedList.Item.items).toHaveLength(0);
  });

  it('should return an error when deleting a non-existent item', async () => {
    const nonExistentItemId = uuidv4();
    const response = await request(app).delete(`/api/to-do-list/${testListId}/${nonExistentItemId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('FAIL');
    expect(response.body.errorMessage).toBeDefined();
  });

  it('should return an error when deleting an item from a non-existent list', async () => {
    const nonExistentListId = uuidv4();
    const response = await request(app).delete(`/api/to-do-list/${nonExistentListId}/${testItemId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('FAIL');
    expect(response.body.errorMessage).toBeDefined();
  });
});