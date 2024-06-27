const { mockDeep } = require('jest-mock-extended');
const itemService = require('../../../server/services/itemService');
const itemController = require('../../../server/controllers/itemController');

jest.mock('../../../server/services/itemService');

describe('itemController', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        jest.resetAllMocks();

        mockReq = mockDeep();
        mockRes = {
            json: jest.fn(),
            status: jest.fn(() => mockRes),
            send: jest.fn()
        };
    });

    describe('getItemFromList', () => {
        test('returns a specific item from a list on success', async () => {
            const mockItem = { itemId: '123', name: 'Test Item', description: 'Test Description' };
            itemService.getItemFromList.mockResolvedValue(mockItem);
            mockReq.params = { listId: '1', itemId: '123' };

            await itemController.getItemFromList(mockReq, mockRes);

            expect(itemService.getItemFromList).toHaveBeenCalledWith('1', '123');
            expect(mockRes.json).toHaveBeenCalledWith({ status: 'SUCCESS', item: mockItem });
        });

        test('returns 404 when list is not found', async () => {
            const mockError = new Error('List not found');
            itemService.getItemFromList.mockRejectedValue(mockError);
            mockReq.params = { listId: '1', itemId: '123' };

            await itemController.getItemFromList(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ status: 'FAIL', errorMessage: 'List not found' });
        });

        test('returns 404 when item is not found in the list', async () => {
            const mockError = new Error('Item not found in the list');
            itemService.getItemFromList.mockRejectedValue(mockError);
            mockReq.params = { listId: '1', itemId: '123' };

            await itemController.getItemFromList(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ status: 'FAIL', errorMessage: 'Item not found in the list' });
        });

        test('handles other errors when getting a specific item', async () => {
            const mockError = new Error('Test error');
            itemService.getItemFromList.mockRejectedValue(mockError);
            mockReq.params = { listId: '1', itemId: '123' };

            await itemController.getItemFromList(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ status: 'FAIL', errorMessage: 'Test error' });
        });
    });

    describe('addItemInList', () => {
        test('returns success with itemId on successful item addition', async () => {
            const mockItemId = '123';
            itemService.addItemToList.mockResolvedValue(mockItemId);
            mockReq.params = { listId: '1' };
            mockReq.body = { name: 'New Item' };

            await itemController.addItemInList(mockReq, mockRes);

            expect(itemService.addItemToList).toHaveBeenCalledWith('1', mockReq.body);
            expect(mockRes.json).toHaveBeenCalledWith({ status: 'SUCCESS', itemId: mockItemId });
        });

        test('returns 404 when list is not found during item addition', async () => {
            const mockError = new Error('List not found');
            itemService.addItemToList.mockRejectedValue(mockError);
            mockReq.params = { listId: '1' };
            mockReq.body = { name: 'New Item' };

            await itemController.addItemInList(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ status: 'FAIL', errorMessage: 'List not found' });
        });

        test('handles other errors during item addition', async () => {
            const mockError = new Error('Test error');
            itemService.addItemToList.mockRejectedValue(mockError);
            mockReq.params = { listId: '1' };
            mockReq.body = { name: 'New Item' };

            await itemController.addItemInList(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ status: 'FAIL', errorMessage: 'Test error' });
        });
    });

    describe('updateItemInList', () => {
        test('returns success on successful item update', async () => {
            const mockUpdatedItem = { id: '123', name: 'Updated Item' };
            itemService.updateItemInList.mockResolvedValue(mockUpdatedItem);
            mockReq.params = { listId: '1', itemId: '123' };
            mockReq.body = { name: 'Updated Item' };

            await itemController.updateItemInList(mockReq, mockRes);

            expect(itemService.updateItemInList).toHaveBeenCalledWith('1', '123', mockReq.body);
            expect(mockRes.json).toHaveBeenCalledWith({ status: 'SUCCESS', updatedItem: mockUpdatedItem });
        });

        test('returns 404 when list is not found during item update', async () => {
            const mockError = new Error('List not found');
            itemService.updateItemInList.mockRejectedValue(mockError);
            mockReq.params = { listId: '1', itemId: '123' };
            mockReq.body = { name: 'Updated Item' };

            await itemController.updateItemInList(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ status: 'FAIL', errorMessage: 'List not found' });
        });

        test('returns 404 when item is not found during item update', async () => {
            const mockError = new Error('Item not found in the list');
            itemService.updateItemInList.mockRejectedValue(mockError);
            mockReq.params = { listId: '1', itemId: '123' };
            mockReq.body = { name: 'Updated Item' };

            await itemController.updateItemInList(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ status: 'FAIL', errorMessage: 'Item not found in the list' });
        });

        test('handles other errors during item update', async () => {
            const mockError = new Error('Test error');
            itemService.updateItemInList.mockRejectedValue(mockError);
            mockReq.params = { listId: '1', itemId: '123' };
            mockReq.body = { name: 'Updated Item' };

            await itemController.updateItemInList(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ status: 'FAIL', errorMessage: 'Test error' });
        });
    });

    describe('deleteItemFromList', () => {
        test('returns success on successful item deletion', async () => {
            itemService.deleteItemFromList.mockResolvedValue();
            mockReq.params = { listId: '1', itemId: '123' };

            await itemController.deleteItemFromList(mockReq, mockRes);

            expect(itemService.deleteItemFromList).toHaveBeenCalledWith('1', '123');
            expect(mockRes.json).toHaveBeenCalledWith({ status: 'SUCCESS' });
        });

        test('returns 404 when list is not found during item deletion', async () => {
            const mockError = new Error('List not found');
            itemService.deleteItemFromList.mockRejectedValue(mockError);
            mockReq.params = { listId: '1', itemId: '123' };

            await itemController.deleteItemFromList(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ status: 'FAIL', errorMessage: 'List not found' });
        });

        test('returns 404 when item is not found during item deletion', async () => {
            const mockError = new Error('Item not found in the list');
            itemService.deleteItemFromList.mockRejectedValue(mockError);
            mockReq.params = { listId: '1', itemId: '123' };

            await itemController.deleteItemFromList(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ status: 'FAIL', errorMessage: 'Item not found in the list' });
        });

        test('handles other errors during item deletion', async () => {
            const mockError = new Error('Test error');
            itemService.deleteItemFromList.mockRejectedValue(mockError);
            mockReq.params = { listId: '1', itemId: '123' };

            await itemController.deleteItemFromList(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ status: 'FAIL', errorMessage: 'Test error' });
        });
    });
});
