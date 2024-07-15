const { v4: uuidv4 } = require('uuid');
const toDoRepositoryPath = '../../../server/repositories/toDoRepository';
const toDoRepository = require(toDoRepositoryPath);
const itemService = require('../../../server/services/itemService');

jest.mock(toDoRepositoryPath);
jest.mock('uuid');

describe('itemService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    uuidv4.mockReturnValue('mocked-uuid');
    toDoRepository.addItemToList = jest.fn();
    toDoRepository.updateItemInList = jest.fn();
    toDoRepository.deleteItemFromList = jest.fn();
    toDoRepository.getListById = jest.fn();
  });

  describe('getItemFromList', () => {
    test('returns the correct item from the list', async () => {
      const listId = '123';
      const itemId = '456';
      const mockList = {
        id: listId,
        name: 'Test List',
        items: [
          { itemId: '789', name: 'Other Item' },
          { itemId: itemId, name: 'Correct Item' },
        ]
      };
      toDoRepository.getListById.mockResolvedValue(mockList);

      const result = await itemService.getItemFromList(listId, itemId);
      expect(result).toEqual({ itemId: itemId, name: 'Correct Item' });
    });

    test('throws an error when list is not found', async () => {
      toDoRepository.getListById.mockResolvedValue(undefined);
      await expect(itemService.getItemFromList('123', '456')).rejects.toThrow('List not found');
    });

    test('throws an error when item is not found in the list', async () => {
      const mockList = {
        id: '123',
        name: 'Test List',
        items: [{ itemId: '789', name: 'Other Item' }]
      };
      toDoRepository.getListById.mockResolvedValue(mockList);
      await expect(itemService.getItemFromList('123', '456')).rejects.toThrow('Item not found in the list');
    });
  });

  describe('addItemToList', () => {
    test('calls repository.addItemToList with correct data', async () => {
      const listId = '1';
      const itemData = { name: 'Test Item', description: 'Test Description' };
      const expectedNewItem = {
        itemId: 'mocked-uuid',
        ...itemData,
        createdDate: expect.any(String)
      };
      toDoRepository.getListById.mockResolvedValue({ items: [] });

      await itemService.addItemToList(listId, itemData);

      expect(toDoRepository.addItemToList).toHaveBeenCalledWith(listId, expectedNewItem);
    });

    test('returns the new itemId', async () => {
      const listId = '1';
      const itemData = { name: 'Test Item' };
      toDoRepository.getListById.mockResolvedValue({ items: [] });
      const result = await itemService.addItemToList(listId, itemData);
      expect(result).toBe('mocked-uuid');
    });

    test('sets the createdDate to today', async () => {
      const listId = '1';
      const itemData = { name: 'Test Item' };
      toDoRepository.getListById.mockResolvedValue({ items: [] });
      await itemService.addItemToList(listId, itemData);

      const addedItem = toDoRepository.addItemToList.mock.calls[0][1];
      expect(addedItem.createdDate).toBe(new Date().toISOString().split('T')[0]);
    });

    test('throws an error when list is not found', async () => {
      toDoRepository.getListById.mockResolvedValue(undefined);
      await expect(itemService.addItemToList('1', { name: 'Test Item' })).rejects.toThrow('List not found');
    });
  });

  describe('updateItemInList', () => {
    test('calls repository.updateItemInList with correct parameters and returns updated item', async () => {
      const listId = '1';
      const itemId = '123';
      const updateData = { name: 'Updated Name', status: 'COMPLETED' };
      const originalItem = { itemId, name: 'Original Name' };
      const updatedItem = { ...originalItem, ...updateData };

      toDoRepository.getListById.mockResolvedValueOnce({
        items: [originalItem]
      });

      toDoRepository.updateItemInList.mockResolvedValue({});

      // Mock getListById again to return the updated item
      toDoRepository.getListById.mockResolvedValueOnce({
        items: [updatedItem]
      });

      const result = await itemService.updateItemInList(listId, itemId, updateData);

      expect(toDoRepository.updateItemInList).toHaveBeenCalledWith(listId, itemId, updateData);
      expect(result).toEqual(updatedItem);
    });

    test('throws an error when list is not found', async () => {
      toDoRepository.getListById.mockResolvedValue(undefined);
      await expect(itemService.updateItemInList('1', '123', {})).rejects.toThrow('List not found');
    });

    test('throws an error when item is not found in the list', async () => {
      toDoRepository.getListById.mockResolvedValue({
        items: [{ itemId: '456', name: 'Other Item' }]
      });
      await expect(itemService.updateItemInList('1', '123', {})).rejects.toThrow('Item not found in the list');
    });
  });

  describe('deleteItemFromList', () => {
    test('calls repository.deleteItemFromList with correct parameters', async () => {
      const listId = '1';
      const itemId = '123';
      toDoRepository.getListById.mockResolvedValue({
        items: [{ itemId, name: 'Item to Delete' }]
      });
      await itemService.deleteItemFromList(listId, itemId);
      expect(toDoRepository.deleteItemFromList).toHaveBeenCalledWith(listId, itemId);
    });

    test('returns the result from repository.deleteItemFromList', async () => {
      const mockResult = { success: true };
      toDoRepository.getListById.mockResolvedValue({
        items: [{ itemId: '123', name: 'Item to Delete' }]
      });
      toDoRepository.deleteItemFromList.mockResolvedValue(mockResult);
      const result = await itemService.deleteItemFromList('1', '123');
      expect(result).toEqual(mockResult);
    });

    test('throws an error when list is not found', async () => {
      toDoRepository.getListById.mockResolvedValue(undefined);
      await expect(itemService.deleteItemFromList('1', '123')).rejects.toThrow('List not found');
    });

    test('throws an error when item is not found in the list', async () => {
      toDoRepository.getListById.mockResolvedValue({
        items: [{ itemId: '456', name: 'Other Item' }]
      });
      await expect(itemService.deleteItemFromList('1', '123')).rejects.toThrow('Item not found in the list');
    });
  });
});
