const { v4: uuidv4 } = require('uuid');
const path = require('path');
const dbPath = path.resolve(__dirname, '../../../server/config/db');
jest.mock(dbPath);
const dynamoDb = require(dbPath);

const toDoRepository = require('../../../server/repositories/toDoRepository');

jest.mock('uuid');

describe('toDoRepository', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    dynamoDb.send.mockImplementation((command) => {
      if (command.constructor.name === 'PutCommand') {
        return Promise.resolve({});
      } else if (command.constructor.name === 'ScanCommand') {
        return Promise.resolve({ Items: [{ listId: '1', name: 'Test List', items: [] }] });
      } else if (command.constructor.name === 'GetCommand') {
        return Promise.resolve({ Item: { listId: '1', name: 'Test List', items: [] } });
      } else if (command.constructor.name === 'UpdateCommand') {
        return Promise.resolve({ Attributes: { listId: '1', items: [] } });
      } else if (command.constructor.name === 'DeleteCommand') {
        return Promise.resolve({});
      }
    });
  });

  describe('createNewList', () => {
    test('creates a new list successfully', async () => {
      const mockUuid = 'mock-uuid';
      uuidv4.mockReturnValue(mockUuid);
      const listName = 'New List';

      const result = await toDoRepository.createNewList(listName);

      expect(dynamoDb.send).toHaveBeenCalledWith(expect.objectContaining({
        input: {
          TableName: 'to-do-table',
          Item: {
            listId: mockUuid,
            name: listName,
            items: []
          },
          ConditionExpression: 'attribute_not_exists(listId)'
        }
      }));
      expect(result).toBe(mockUuid);
    });

    test('handles error when creating a new list', async () => {
      dynamoDb.send.mockRejectedValue(new Error('DynamoDB error'));

      await expect(toDoRepository.createNewList('New List')).rejects.toThrow('Unable to createNewList due to an Internal Failure.');
    });
  });

  describe('getAllLists', () => {
    test('retrieves all lists successfully', async () => {
      const result = await toDoRepository.getAllLists();

      expect(dynamoDb.send).toHaveBeenCalledWith(expect.objectContaining({
        input: {
          TableName: 'to-do-table'
        }
      }));
      expect(result).toEqual({ Items: [{ listId: '1', name: 'Test List', items: [] }] });
    });

    test('handles error when retrieving all lists', async () => {
      dynamoDb.send.mockRejectedValue(new Error('DynamoDB error'));

      await expect(toDoRepository.getAllLists()).rejects.toThrow('Unable to getAllLists due to an Internal Failure.');
    });
  });

  describe('getListById', () => {
    test('retrieves a list by ID successfully', async () => {
      const listId = '1';
      const result = await toDoRepository.getListById(listId);

      expect(dynamoDb.send).toHaveBeenCalledWith(expect.objectContaining({
        input: {
          TableName: 'to-do-table',
          Key: { listId }
        }
      }));
      expect(result).toEqual({ listId: '1', name: 'Test List', items: [] });
    });

    test('handles error when retrieving a list by ID', async () => {
      dynamoDb.send.mockRejectedValue(new Error('DynamoDB error'));

      await expect(toDoRepository.getListById('1')).rejects.toThrow('Unable to getListById due to an Internal Failure.');
    });
  });

  describe('addItemToList', () => {
    test('adds an item to a list successfully', async () => {
      const listId = '1';
      const item = { itemId: '123', name: 'New Item' };

      await toDoRepository.addItemToList(listId, item);

      expect(dynamoDb.send).toHaveBeenCalledWith(expect.objectContaining({
        input: {
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
        }
      }));
    });

    test('handles error when adding an item to a list', async () => {
      dynamoDb.send.mockRejectedValue(new Error('DynamoDB error'));

      await expect(toDoRepository.addItemToList('1', { name: 'New Item' })).rejects.toThrow('Unable to addItemToList due to an Internal Failure.');
    });
  });

  describe('updateItemInList', () => {
    test('updates an item in a list successfully', async () => {
      const listId = '1';
      const itemId = '123';
      const updateData = { name: 'Updated Item' };

      dynamoDb.send.mockImplementationOnce(() => Promise.resolve({ Item: { listId: '1', items: [{ itemId: '123', name: 'Old Item' }] } }));

      await toDoRepository.updateItemInList(listId, itemId, updateData);

      expect(dynamoDb.send).toHaveBeenCalledWith(expect.objectContaining({
        input: expect.objectContaining({
          TableName: 'to-do-table',
          Key: { listId },
          UpdateExpression: 'SET #items[0].#name = :name',
          ExpressionAttributeNames: {
            '#items': 'items',
            '#name': 'name'
          },
          ExpressionAttributeValues: {
            ':name': 'Updated Item'
          },
          ConditionExpression: 'attribute_exists(#items[0])',
          ReturnValues: 'ALL_NEW'
        })
      }));
    });

    test('handles error when item is not found in the list', async () => {
      dynamoDb.send.mockImplementationOnce(() => Promise.resolve({ Item: { listId: '1', items: [] } }));

      await expect(toDoRepository.updateItemInList('1', '123', { name: 'Updated Item' }))
        .rejects.toThrow('Item not found in the list');
    });

    test('handles error when updating an item in a list', async () => {
      dynamoDb.send.mockImplementationOnce(() => Promise.resolve({ Item: { listId: '1', items: [{ itemId: '123', name: 'Old Item' }] } }))
        .mockImplementationOnce(() => Promise.reject(new Error('DynamoDB error')));

      await expect(toDoRepository.updateItemInList('1', '123', { name: 'Updated Item' }))
        .rejects.toThrow('Unable to updateItemInList due to an Internal Failure');
    });
  });

  describe('deleteItemFromList', () => {
    test('deletes an item from a list successfully', async () => {
      const listId = '1';
      const itemId = '123';

      dynamoDb.send.mockImplementationOnce(() => Promise.resolve({ Item: { listId: '1', items: [{ itemId: '123', name: 'Item to Delete' }] } }));

      await toDoRepository.deleteItemFromList(listId, itemId);

      expect(dynamoDb.send).toHaveBeenCalledWith(expect.objectContaining({
        input: {
          TableName: 'to-do-table',
          Key: { listId },
          UpdateExpression: 'REMOVE #items[0]',
          ExpressionAttributeNames: {
            '#items': 'items'
          },
          ConditionExpression: 'attribute_exists(#items[0])'
        }
      }));
    });

    test('handles error when item is not found in the list', async () => {
      dynamoDb.send.mockImplementationOnce(() => Promise.resolve({ Item: { listId: '1', items: [] } }));

      await expect(toDoRepository.deleteItemFromList('1', '123'))
        .rejects.toThrow('Item not found in the list');
    });

    test('handles error when deleting an item from a list', async () => {
      dynamoDb.send.mockImplementationOnce(() => Promise.resolve({ Item: { listId: '1', items: [{ itemId: '123', name: 'Item to Delete' }] } }))
        .mockImplementationOnce(() => Promise.reject(new Error('DynamoDB error')));

      await expect(toDoRepository.deleteItemFromList('1', '123'))
        .rejects.toThrow('Unable to Delete Item From List due to an Internal Failure');
    });
  });

  describe('error handling', () => {
    test('handles ConditionalCheckFailedException', async () => {
      dynamoDb.send.mockRejectedValue({ name: 'ConditionalCheckFailedException' });

      await expect(toDoRepository.createNewList('New List'))
        .rejects.toThrow('Unable to createNewList due to an Internal Failure');
    });

    test('handles ProvisionedThroughputExceededException', async () => {
      dynamoDb.send.mockRejectedValue({ name: 'ProvisionedThroughputExceededException' });

      await expect(toDoRepository.getAllLists())
        .rejects.toThrow('Unable to getAllLists due to an Internal Failure');
    });

    test('handles ResourceNotFoundException', async () => {
      dynamoDb.send.mockRejectedValue({ name: 'ResourceNotFoundException' });

      await expect(toDoRepository.getListById('1'))
        .rejects.toThrow('Unable to getListById due to an Internal Failure');
    });

    test('handles InternalServerError', async () => {
      dynamoDb.send.mockRejectedValue({ name: 'InternalServerError' });

      await expect(toDoRepository.addItemToList('1', { name: 'New Item' }))
        .rejects.toThrow('Unable to addItemToList due to an Internal Failure');
    });

    test('handles Item not found error', async () => {
      dynamoDb.send.mockImplementationOnce(() => Promise.resolve({ Item: { listId: '1', items: [] } }));

      await expect(toDoRepository.updateItemInList('1', '123', { name: 'Updated Item' }))
        .rejects.toThrow('Item not found in the list');
    });
  });

  describe('deleteList', () => {
    test('calls dynamoDb.send with correct parameters', async () => {
      const listId = '123';

      await toDoRepository.deleteList(listId);

      expect(dynamoDb.send).toHaveBeenCalledWith(expect.objectContaining({
        input: {
          TableName: 'to-do-table',
          Key: { 'listId': listId }
        }
      }));
    });

    test('handles error when deleting a list', async () => {
      dynamoDb.send.mockRejectedValue(new Error('DynamoDB error'));

      await expect(toDoRepository.deleteList('123'))
        .rejects.toThrow('Unable to Delete List due to an Internal Failure');
    });
  });
});