const toDoRepositoryPath = '../../../server/repositories/toDoRepository';
const toDoRepository = require(toDoRepositoryPath);
const toDoService = require('../../../server/services/toDoService');

jest.mock(toDoRepositoryPath);

describe('toDoService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        toDoRepository.createNewList = jest.fn();
        toDoRepository.getAllLists = jest.fn();
        toDoRepository.getListById = jest.fn();
        toDoRepository.deleteList = jest.fn();
    });

    describe('createNewList', () => {
        test('calls repository.createNewList with correct name', async () => {
            const mockName = 'New List';
            await toDoService.createNewList({ name: mockName });
            expect(toDoRepository.createNewList).toHaveBeenCalledWith(mockName);
        });

        test('returns the result from repository.createNewList', async () => {
            const mockResult = { id: 'list-id', name: 'New List' };
            toDoRepository.createNewList.mockResolvedValue(mockResult);
            const result = await toDoService.createNewList({ name: 'New List' });
            expect(result).toEqual(mockResult);
        });

        test('throws error when name is empty', async () => {
            await expect(toDoService.createNewList({ name: '' }))
                .rejects.toThrow('List name cannot be empty');
            expect(toDoRepository.createNewList).not.toHaveBeenCalled();
        });

        test('throws error when name is only whitespace', async () => {
            await expect(toDoService.createNewList({ name: '   ' }))
                .rejects.toThrow('List name cannot be empty');
            expect(toDoRepository.createNewList).not.toHaveBeenCalled();
        });

        test('throws error when name is not provided', async () => {
            await expect(toDoService.createNewList({}))
                .rejects.toThrow('List name cannot be empty');
            expect(toDoRepository.createNewList).not.toHaveBeenCalled();
        });

        test('trims whitespace from name before calling repository', async () => {
            const mockName = '  New List  ';
            await toDoService.createNewList({ name: mockName });
            expect(toDoRepository.createNewList).toHaveBeenCalledWith('New List');
        });
    });

    describe('getAllLists', () => {
        test('calls repository.getAllLists', async () => {
            await toDoService.getAllLists();
            expect(toDoRepository.getAllLists).toHaveBeenCalled();
        });

        test('returns the result from repository.getAllLists', async () => {
            const mockLists = [{ id: 'list1' }, { id: 'list2' }];
            toDoRepository.getAllLists.mockResolvedValue(mockLists);
            const result = await toDoService.getAllLists();
            expect(result).toEqual(mockLists);
        });
    });

    describe('getListById', () => {
        test('calls repository.getListById with correct listId', async () => {
            const mockList = { id: 'list-id', name: 'Test List' };
            toDoRepository.getListById.mockResolvedValue(mockList);
            const result = await toDoService.getListById(mockList.id);
            expect(toDoRepository.getListById).toHaveBeenCalledWith(mockList.id);
            expect(result).toEqual(mockList);
        });

        test('throws "List not found" error when list does not exist', async () => {
            const nonExistentListId = 'non-existent-id';
            toDoRepository.getListById.mockResolvedValue(null);

            await expect(toDoService.getListById(nonExistentListId)).rejects.toThrow('List not found');
            expect(toDoRepository.getListById).toHaveBeenCalledWith(nonExistentListId);
        });
    });

    describe('deleteList', () => {
        test('calls repository.deleteList with correct listId', async () => {
            const listId = '123';
            toDoRepository.getListById.mockResolvedValue({ id: listId, name: 'Test List' });
            await toDoService.deleteList(listId);
            expect(toDoRepository.deleteList).toHaveBeenCalledWith(listId);
        });

        test('throws error when list is not found', async () => {
            const listId = '123';
            toDoRepository.getListById.mockResolvedValue(null);
            await expect(toDoService.deleteList(listId)).rejects.toThrow('List not found');
        });
    });
});