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

    describe('createNewList', () => {
        test('returns success with listId on successful creation', async () => {
            const mockListId = '123';
            toDoService.createNewList.mockResolvedValue(mockListId);
            mockReq.body = { name: 'New List' };

            await toDoController.createNewList(mockReq, mockRes);

            expect(toDoService.createNewList).toHaveBeenCalledWith(mockReq.body);
            expect(mockRes.json).toHaveBeenCalledWith({ status: 'SUCCESS', listId: mockListId });
        });

        test('handles errors during list creation', async () => {
            const mockError = new Error('Test error');
            toDoService.createNewList.mockRejectedValue(mockError);
            mockReq.body = { name: 'New List' };

            await toDoController.createNewList(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({ status: 'FAIL', errorMessage: mockError.message });
        });
    });

    describe('getAllLists', () => {
        test('returns all lists on success', async () => {
            const mockItems = [{ listId: '1', name: 'Test List' }];
            toDoService.getAllLists.mockResolvedValue({ Items: mockItems });

            await toDoController.getAllLists(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith({ status: 'SUCCESS', lists: mockItems });
        });

        test('handles errors when getting all lists', async () => {
            const mockError = new Error('Test error');
            toDoService.getAllLists.mockRejectedValue(mockError);

            await toDoController.getAllLists(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({ status: 'FAIL', errorMessage: mockError.message });
        });
    });

    describe('getListById', () => {
        test('returns a specific list on success', async () => {
            const mockList = { listId: '1', name: 'Test List', items: [] };
            toDoService.getListById.mockResolvedValue(mockList);
            mockReq.params = { listId: '1' };

            await toDoController.getListById(mockReq, mockRes);

            expect(toDoService.getListById).toHaveBeenCalledWith('1');
            expect(mockRes.json).toHaveBeenCalledWith({ status: 'SUCCESS', list: mockList });
        });

        test('handles errors when getting a specific list', async () => {
            const mockError = new Error('Test error');
            toDoService.getListById.mockRejectedValue(mockError);
            mockReq.params = { listId: '1' };

            await toDoController.getListById(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({ status: 'FAIL', errorMessage: mockError.message });
        });
    });

    describe('deleteList', () => {
        test('returns 200 and success message when list is deleted', async () => {
            toDoService.deleteList.mockResolvedValue();

            await toDoController.deleteList(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ status: 'SUCCESS', message: 'List deleted successfully' });
        });

        test('returns 404 when list is not found', async () => {
            toDoService.deleteList.mockRejectedValue(new Error('List not found'));

            await toDoController.deleteList(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ status: 'FAIL', message: 'List not found' });
        });

        test('returns 500 on internal server error', async () => {
            toDoService.deleteList.mockRejectedValue(new Error('Database error'));

            await toDoController.deleteList(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ status: 'FAIL', message: 'Internal server error' });
        });
    });
});