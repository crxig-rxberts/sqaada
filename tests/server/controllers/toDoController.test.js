const { mockDeep } = require('jest-mock-extended');
const toDoService = require('../../../server/services/toDoService');
const toDoController = require('../../../server/controllers/toDoController');

jest.mock('../../../server/services/toDoService');

describe('toDoController', () => {
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

    test('getAllLists returns lists on success', async () => {
        const mockItems = [{ listId: '1', name: 'Test Item' }];
        toDoService.getAllLists.mockResolvedValue({ Items: mockItems });
        await toDoController.getAllLists(mockReq, mockRes);
        expect(mockRes.json).toHaveBeenCalledWith(mockItems);
    });

    test('getAllLists handles errors', async () => {
        const mockError = new Error('Test error');
        toDoService.getAllLists.mockRejectedValue(mockError);
        mockReq.params = { listId: '1' }; // Set listId
        await toDoController.getAllLists(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.send).toHaveBeenCalledWith({ status: 'FAIL', errorMessage: mockError.message });
    });

    test('getListById returns items on success', async () => {
        const mockItems = [{ itemId: '1', name: 'Test Item' }];
        toDoService.getListById.mockResolvedValue({ Items: mockItems });
        mockReq.params = { listId: '1' }; // Set listId
        await toDoController.getListById(mockReq, mockRes);
        expect(mockRes.json).toHaveBeenCalledWith(mockItems);
    });

    test('getListById handles errors', async () => {
        const mockError = new Error('Test error');
        toDoService.getListById.mockRejectedValue(mockError);
        mockReq.params = { listId: '1' }; // Set listId
        await toDoController.getListById(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.send).toHaveBeenCalledWith({ status: 'FAIL', errorMessage: mockError.message });
    });

    test('addItemInList returns success on successful addition', async () => {
        const mockItem = { itemId: '123', name: 'New Item' };
        toDoService.addItemToList.mockResolvedValue({ Item: mockItem });
        mockReq.params = { listId: '1' }; // Set listId
        mockReq.body = { itemId: '123', name: 'New Item' };
        await toDoController.addItemInList(mockReq, mockRes);
        expect(mockRes.json).toHaveBeenCalledWith({ status: 'SUCCESS', itemId: mockItem.itemId });
    });

    test('addItemInList handles errors', async () => {
        const mockError = new Error('Test error');
        toDoService.addItemToList.mockRejectedValue(mockError);
        mockReq.params = { listId: '1' }; // Set listId
        mockReq.body = { name: 'New Item' };
        await toDoController.addItemInList(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.send).toHaveBeenCalledWith({ status: 'FAIL', errorMessage: mockError.message });
    });

    test('updateItemInList returns success on successful update', async () => {
        toDoService.updateItemInList.mockResolvedValue({});
        mockReq.params = { listId: '1', itemId: '123' }; // Set listId and itemId
        mockReq.body = { name: 'Updated Item' };
        await toDoController.updateItemInList(mockReq, mockRes);
        expect(mockRes.json).toHaveBeenCalledWith({ status: 'SUCCESS' });
    });

    test('updateItemInList handles errors', async () => {
        const mockError = new Error('Test error');
        toDoService.updateItemInList.mockRejectedValue(mockError);
        mockReq.params = { listId: '1', itemId: '123' }; // Set listId and itemId
        mockReq.body = { name: 'Updated Item' };
        await toDoController.updateItemInList(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.send).toHaveBeenCalledWith({ status: 'FAIL', errorMessage: mockError.message });
    });

    test('deleteItemFromList returns success on successful deletion', async () => {
        toDoService.deleteItemFromList.mockResolvedValue({});
        mockReq.params = { listId: '1', itemId: '123' }; // Set listId and itemId
        await toDoController.deleteItemFromList(mockReq, mockRes);
        expect(mockRes.json).toHaveBeenCalledWith({ status: 'SUCCESS' });
    });

    test('deleteItemFromList handles errors', async () => {
        const mockError = new Error('Test error');
        toDoService.deleteItemFromList.mockRejectedValue(mockError);
        mockReq.params = { listId: '1', itemId: '123' }; // Set listId and itemId
        await toDoController.deleteItemFromList(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.send).toHaveBeenCalledWith({ status: 'FAIL', errorMessage: mockError.message });
    });
});
