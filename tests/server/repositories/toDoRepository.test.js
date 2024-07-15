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

    dynamoDb.put.mockReturnValue({
      promise: jest.fn().mockResolvedValue({})
    });
    dynamoDb.scan.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Items: [{ listId: '1', name: 'Test List', items: [] }] })
    });
    dynamoDb.get.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Item: { listId: '1', name: 'Test List', items: [] } })
    });
    dynamoDb.update.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Attributes: { listId: '1', items: [] } })
    });
    dynamoDb.delete.mockReturnValue({
      promise: jest.fn().mockResolvedValue({})
    });
  });

  describe('createNewList', () => {
    test('creates a new list successfully', async () => {
      const mockUuid = 'mock-uuid';
      uuidv4.mockReturnValue(mockUuid);
      const listName = 'New List';

      const result = await toDoRepository.createNewList(listName);

      expect(dynamoDb.put).toHaveBeenCalledWith({
        TableName: 'to-do-table',
        Item: {
          listId: mockUuid,
          name: listName,
          items: []
        },
        ConditionExpression: 'attribute_not_exists(listId)'
      });
      expect(result).toBe(mockUuid);
    });

    test('handles error when creating a new list', async () => {
      dynamoDb.put.mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error('DynamoDB error'))
      });

      await expect(toDoRepository.createNewList('New List')).rejects.toThrow('Unable to createNewList due to an Internal Failure.');
    });
  });

  describe('getAllLists', () => {
    test('retrieves all lists successfully', async () => {
      const result = await toDoRepository.getAllLists();

      expect(dynamoDb.scan).toHaveBeenCalledWith({
        TableName: 'to-do-table'
      });
      expect(result).toEqual({ Items: [{ listId: '1', name: 'Test List', items: [] }] });
    });

    test('handles error when retrieving all lists', async () => {
      dynamoDb.scan.mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error('DynamoDB error'))
      });

      await expect(toDoRepository.getAllLists()).rejects.toThrow('Unable to getAllLists due to an Internal Failure.');
    });
  });

  describe('getListById', () => {
    test('retrieves a list by ID successfully', async () => {
      const listId = '1';
      const result = await toDoRepository.getListById(listId);

      expect(dynamoDb.get).toHaveBeenCalledWith({
        TableName: 'to-do-table',
        Key: { listId }
      });
      expect(result).toEqual({ listId: '1', name: 'Test List', items: [] });
    });

    test('handles error when retrieving a list by ID', async () => {
      dynamoDb.get.mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error('DynamoDB error'))
      });

      await expect(toDoRepository.getListById('1')).rejects.toThrow('Unable to getListById due to an Internal Failure.');
    });
  });

  describe('addItemToList', () => {
    test('adds an item to a list successfully', async () => {
      const listId = '1';
      const item = { itemId: '123', name: 'New Item' };

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

    test('handles error when adding an item to a list', async () => {
      dynamoDb.update.mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error('DynamoDB error'))
      });

      await expect(toDoRepository.addItemToList('1', { name: 'New Item' })).rejects.toThrow('Unable to addItemToList due to an Internal Failure.');
    });
  });

  describe('updateItemInList', () => {
    test('updates an item in a list successfully', async () => {
      const listId = '1';
      const itemId = '123';
      const updateData = { name: 'Updated Item' };

      dynamoDb.get.mockReturnValueOnce({
        promise: jest.fn().mockResolvedValue({ Item: { listId: '1', items: [{ itemId: '123', name: 'Old Item' }] } })
      });

      await toDoRepository.updateItemInList(listId, itemId, updateData);

      expect(dynamoDb.update).toHaveBeenCalledWith(expect.objectContaining({
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
      }));
    });

    test('handles error when item is not found in the list', async () => {
      dynamoDb.get.mockReturnValueOnce({
        promise: jest.fn().mockResolvedValue({ Item: { listId: '1', items: [] } })
      });

      await expect(toDoRepository.updateItemInList('1', '123', { name: 'Updated Item' }))
        .rejects.toThrow('Item not found in the list');
    });

    test('handles error when updating an item in a list', async () => {
      dynamoDb.get.mockReturnValueOnce({
        promise: jest.fn().mockResolvedValue({ Item: { listId: '1', items: [{ itemId: '123', name: 'Old Item' }] } })
      });
      dynamoDb.update.mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error('DynamoDB error'))
      });

      await expect(toDoRepository.updateItemInList('1', '123', { name: 'Updated Item' }))
        .rejects.toThrow('Unable to updateItemInList due to an Internal Failure');
    });
  });

  describe('deleteItemFromList', () => {
    test('deletes an item from a list successfully', async () => {
      const listId = '1';
      const itemId = '123';

      dynamoDb.get.mockReturnValueOnce({
        promise: jest.fn().mockResolvedValue({ Item: { listId: '1', items: [{ itemId: '123', name: 'Item to Delete' }] } })
      });

      await toDoRepository.deleteItemFromList(listId, itemId);

      expect(dynamoDb.update).toHaveBeenCalledWith({
        TableName: 'to-do-table',
        Key: { listId },
        UpdateExpression: 'REMOVE #items[0]',
        ExpressionAttributeNames: {
          '#items': 'items'
        },
        ConditionExpression: 'attribute_exists(#items[0])'
      });
    });

    test('handles error when item is not found in the list', async () => {
      dynamoDb.get.mockReturnValueOnce({
        promise: jest.fn().mockResolvedValue({ Item: { listId: '1', items: [] } })
      });

      await expect(toDoRepository.deleteItemFromList('1', '123'))
        .rejects.toThrow('Item not found in the list');
    });

    test('handles error when deleting an item from a list', async () => {
      dynamoDb.get.mockReturnValueOnce({
        promise: jest.fn().mockResolvedValue({ Item: { listId: '1', items: [{ itemId: '123', name: 'Item to Delete' }] } })
      });
      dynamoDb.update.mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error('DynamoDB error'))
      });

      await expect(toDoRepository.deleteItemFromList('1', '123'))
        .rejects.toThrow('Unable to Delete Item From List due to an Internal Failure');
    });
  });

  describe('error handling', () => {
    test('handles ConditionalCheckFailedException', async () => {
      dynamoDb.put.mockReturnValue({
        promise: jest.fn().mockRejectedValue({ code: 'ConditionalCheckFailedException' })
      });

      await expect(toDoRepository.createNewList('New List'))
        .rejects.toThrow('Unable to createNewList due to an Internal Failure');
    });

    test('handles ProvisionedThroughputExceededException', async () => {
      dynamoDb.scan.mockReturnValue({
        promise: jest.fn().mockRejectedValue({ code: 'ProvisionedThroughputExceededException' })
      });

      await expect(toDoRepository.getAllLists())
        .rejects.toThrow('Unable to getAllLists due to an Internal Failure');
    });

    test('handles ResourceNotFoundException', async () => {
      dynamoDb.get.mockReturnValue({
        promise: jest.fn().mockRejectedValue({ code: 'ResourceNotFoundException' })
      });

      await expect(toDoRepository.getListById('1'))
        .rejects.toThrow('Unable to getListById due to an Internal Failure');
    });

    test('handles InternalServerError', async () => {
      dynamoDb.update.mockReturnValue({
        promise: jest.fn().mockRejectedValue({ code: 'InternalServerError' })
      });

      await expect(toDoRepository.addItemToList('1', { name: 'New Item' }))
        .rejects.toThrow('Unable to addItemToList due to an Internal Failure');
    });

    test('handles Item not found error', async () => {
      dynamoDb.get.mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Item: { listId: '1', items: [] } })
      });

      await expect(toDoRepository.updateItemInList('1', '123', { name: 'Updated Item' }))
        .rejects.toThrow('Item not found in the list');
    });
  });

  describe('deleteList', () => {
    test('calls dynamoDb.delete with correct parameters', async () => {
      const listId = '123';

      await toDoRepository.deleteList(listId);

      expect(dynamoDb.delete).toHaveBeenCalledWith({
        TableName: 'to-do-table',
        Key: { 'listId': listId }
      });
      expect(dynamoDb.delete().promise).toHaveBeenCalled();
    });

    test('handles error when deleting a list', async () => {
      dynamoDb.delete.mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error('DynamoDB error'))
      });

      await expect(toDoRepository.deleteList('123'))
        .rejects.toThrow('Unable to Delete List due to an Internal Failure');
    });
  });
});
