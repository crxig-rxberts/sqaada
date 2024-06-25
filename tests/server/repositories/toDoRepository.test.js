const { v4: uuidv4 } = require('uuid');
const path = require('path');
const dbPath = path.resolve(__dirname, '../../../server/config/db');
jest.mock(dbPath);
const dynamoDb = require(dbPath);

const toDoRepository = require('../../../server/repositories/toDoRepository');

jest.mock('../../../server/config/db');

describe('toDoRepository', () => {
    beforeEach(() => {
        jest.resetAllMocks();

        // Mocking DynamoDB methods with .promise()
        dynamoDb.scan.mockReturnValue({
            promise: jest.fn().mockResolvedValue({ Items: [{ id: '1', name: 'Test Item' }] })
        });
        dynamoDb.get.mockReturnValue({
            promise: jest.fn().mockResolvedValue({ Item: { id: '1', name: 'Test Item' } })
        });
        dynamoDb.update.mockReturnValue({
            promise: jest.fn().mockResolvedValue({ Attributes: { itemId: '123' } })
        });
        dynamoDb.delete.mockReturnValue({
            promise: jest.fn().mockResolvedValue({})
        });
    });

    test('getAllLists calls dynamoDb.scan', async () => {
        await toDoRepository.getAllLists();
        expect(dynamoDb.scan).toHaveBeenCalled();
    });

    test('getListById calls dynamoDb.get', async () => {
        const listId = '123';
        await toDoRepository.getListById(listId);
        expect(dynamoDb.get).toHaveBeenCalledWith({
            TableName: 'to-do-table',
            Key: { listId }
        });
    });

    test('addItemToList calls dynamoDb.update', async () => {
        const listId = '1';
        const item = { id: '123', name: 'New Item' };
        await toDoRepository.addItemToList(listId, item);
        expect(dynamoDb.update).toHaveBeenCalledWith({
            TableName: 'to-do-table',
            Key: { listId },
            UpdateExpression: 'SET #items = list_append(if_not_exists(#items, :empty_list), :item)',
            ExpressionAttributeNames: {
                '#items': 'items'
            },
            ExpressionAttributeValues: {
                ':item': [item],
                ':empty_list': []
            },
            ReturnValues: 'ALL_NEW'
        });
    });

    test('updateItemInList calls dynamoDb.update', async () => {
        const listId = '1';
        const itemId = '123';
        const updateExpression = 'SET #name = :name';
        const expressionAttributeValues = { ':name': 'Updated Item' };

        await toDoRepository.updateItemInList(listId, itemId, updateExpression, expressionAttributeValues);

        expect(dynamoDb.update).toHaveBeenCalledWith({
            TableName: 'to-do-table',
            Key: { listId },
            UpdateExpression: `SET items[${itemId}] = ${updateExpression}`,
            ExpressionAttributeValues: expressionAttributeValues
        });
    });

    test('deleteItemFromList calls dynamoDb.update', async () => {
        const listId = '1';
        const itemId = '123';
        await toDoRepository.deleteItemFromList(listId, itemId);
        expect(dynamoDb.update).toHaveBeenCalledWith({
            TableName: 'to-do-table',
            Key: { listId },
            UpdateExpression: 'REMOVE items[123]',
        });
    });
});
