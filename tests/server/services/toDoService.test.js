const { v4: uuidv4 } = require('uuid');
const toDoRepositoryPath = '../../../server/repositories/toDoRepository';
const toDoRepository = require(toDoRepositoryPath);
const toDoService = require('../../../server/services/toDoService');

jest.mock(toDoRepositoryPath);
jest.mock('../../../server/repositories/toDoRepository');
jest.mock('uuid');

describe('toDoService', () => {
    beforeEach(() => {
        jest.resetAllMocks()
        uuidv4.mockReturnValue('mocked-uuid');
    });

    test('getAllLists calls repository.getAllLists', async () => {
        await toDoService.getAllLists();
        expect(toDoRepository.getAllLists).toHaveBeenCalled();
    });

    test('getListById calls repository.getListById', async () => {
        const listId = '123';
        await toDoService.getListById(listId);
        expect(toDoRepository.getListById).toHaveBeenCalledWith(listId);
    });

    test('addItemToList calls repository.updateItemInList with correct data', async () => {
        const mockItemData = { listId: '1', name: 'Test Item', description: 'Test Description' };
        await toDoService.addItemToList(mockItemData.listId, { name: 'Test Item', description: 'Test Description' });

        expect(toDoRepository.updateItemInList).toHaveBeenCalledWith(
            '1',
            'mocked-uuid',
            'SET #items = list_append(if_not_exists(#items, :empty_list), :item)',
            {
                ':item': [{
                    itemId: 'mocked-uuid',
                    name: 'Test Item',
                    description: 'Test Description',
                    createdDate: expect.any(String)
                }],
                ':empty_list': []
            }
        );
    });

    test('updateItemInList calls repository.updateItemInList with correct data', async () => {
        const listId = '1';
        const itemId = '123';
        const mockUpdateData = { name: 'Updated Name', status: 'COMPLETED' };
        await toDoService.updateItemInList(listId, itemId, mockUpdateData);

        expect(toDoRepository.updateItemInList).toHaveBeenCalledWith(
            listId,
            itemId,
            'SET items[123].name = :name, items[123].status = :status',
            {
                ':name': 'Updated Name',
                ':status': 'COMPLETED'
            }
        );
    });

    test('deleteItemFromList calls repository.deleteItemFromList', async () => {
        const listId = '1';
        const itemId = '123';
        await toDoService.deleteItemFromList(listId, itemId);
        expect(toDoRepository.deleteItemFromList).toHaveBeenCalledWith(listId, itemId);
    });
});
