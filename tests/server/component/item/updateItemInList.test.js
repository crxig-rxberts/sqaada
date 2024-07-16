const request = require('supertest');
const { DynamoDBDocumentClient, ScanCommand, DeleteCommand, PutCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const dynamoDb = require('../../../../server/config/db');
const createTestServer = require('../../testServer');
const { v4: uuidv4 } = require('uuid');

describe('Update Item In List', () => {
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
          name: 'Test Task',
          itemId: testItemId,
          description: 'Test Description',
          createdDate: '2024-06-27',
          status: 'TODO',
          dueDate: '24/07/2025'
        }]
      }
    }));
  });

  afterEach(cleanupDatabase);

  it('should update an item in the list', async () => {
    const updatedItem = {
      name: 'Updated Task',
      description: 'Updated Description',
      status: 'IN_PROGRESS',
      dueDate: '25/07/2025'
    };

    const response = await request(app)
        .put(`/api/to-do-list/${testListId}/${testItemId}`)
        .send(updatedItem);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('SUCCESS');
    expect(response.body.updatedItem).toBeDefined();
    expect(response.body.updatedItem.name).toBe(updatedItem.name);
    expect(response.body.updatedItem.description).toBe(updatedItem.description);
    expect(response.body.updatedItem.status).toBe(updatedItem.status);
    expect(response.body.updatedItem.dueDate).toBe(updatedItem.dueDate);
    expect(response.body.updatedItem.createdDate).toBe('2024-06-27');

    // Verify item was updated in the database
    const updatedList = await dynamoDb.send(new GetCommand({
      TableName: 'to-do-table',
      Key: { listId: testListId }
    }));

    expect(updatedList.Item.items[0].name).toBe(updatedItem.name);
    expect(updatedList.Item.items[0].description).toBe(updatedItem.description);
    expect(updatedList.Item.items[0].status).toBe(updatedItem.status);
    expect(updatedList.Item.items[0].dueDate).toBe(updatedItem.dueDate);
  });

  it('should return an error when updating a non-existent item', async () => {
    const nonExistentItemId = uuidv4();
    const updatedItem = {
      name: 'Updated Task',
      description: 'Updated Description',
      status: 'IN_PROGRESS',
      dueDate: '25/07/2025'
    };

    const response = await request(app)
        .put(`/api/to-do-list/${testListId}/${nonExistentItemId}`)
        .send(updatedItem);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('FAIL');
    expect(response.body.errorMessage).toBeDefined();
  });

  it('should return an error when updating an item in a non-existent list', async () => {
    const nonExistentListId = uuidv4();
    const updatedItem = {
      name: 'Updated Task',
      description: 'Updated Description',
      status: 'IN_PROGRESS',
      dueDate: '25/07/2025'
    };

    const response = await request(app)
        .put(`/api/to-do-list/${nonExistentListId}/${testItemId}`)
        .send(updatedItem);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('FAIL');
    expect(response.body.errorMessage).toBe('List not found');
  });
});