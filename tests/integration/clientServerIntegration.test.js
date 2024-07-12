const toDoClient = require('../../client/src/clients/toDoClient');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

const waitForServer = async (url, maxRetries = 10, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            await axios.get(`${url}/api/to-do-list`);
            return;
        } catch (error) {
            console.log(`Failed to connect. Error: ${error.message}`);
            await new Promise(res => setTimeout(res, delay));
        }
    }
    throw new Error('Server did not become ready in time');
};

describe('ToDo List API Integration Tests', () => {
    let server;

    beforeAll(async () => {
        server = require('../../server/index');
        await waitForServer('http://localhost:8080');
    });

    afterAll((done) => {
        if (server && server.close) {
            server.close((err) => {
                if (err) {
                    console.error('Error closing the server:', err);
                }
                done();
            });
        } else {
            done();
        }
    });

    describe('List Management', () => {
        let createdListId;

        test('Create a new list', async () => {
            const response = await toDoClient.createNewList("ToDo Project List");
            expect(response.status).toBe('SUCCESS');
            expect(response.listId).toBeDefined();
            createdListId = response.listId;
        });

        test('Get all lists', async () => {
            const response = await toDoClient.getAllLists();
            expect(response.status).toBe('SUCCESS');
            expect(Array.isArray(response.lists)).toBe(true);
            expect(response.lists.some(list => list.listId === createdListId)).toBe(true);
        });

        test('Get list by ID', async () => {
            const response = await toDoClient.getListById(createdListId);
            expect(response.status).toBe('SUCCESS');
            expect(response.list.listId).toBe(createdListId);
            expect(response.list.name).toBe("ToDo Project List");
        });

        test('Try to get non-existent list', async () => {
            const fakeId = uuidv4();
            const response = await toDoClient.getListById(fakeId);
            expect(response.status).toBe('FAIL');
            expect(response.errorMessage).toBeDefined();
        });

        test('Delete list', async () => {
            const response = await toDoClient.deleteList(createdListId);
            expect(response.status).toBe('SUCCESS');

            const getResponse = await toDoClient.getListById(createdListId);
            expect(getResponse.status).toBe('FAIL');
        });
    });

    describe('Item Management', () => {
        let listId, itemId;

        beforeAll(async () => {
            const listResponse = await toDoClient.createNewList("Item Test List");
            listId = listResponse.listId;
        });

        afterAll(async () => {
            await toDoClient.deleteList(listId);
        });

        test('Add item to list', async () => {
            const newItem = {
                name: "Do This Task",
                description: "You need to complete this task, to achieve this.",
                status: "TODO",
                dueDate: "24/07/2025"
            };
            const response = await toDoClient.addItemInList(listId, newItem);
            expect(response.status).toBe('SUCCESS');
            expect(response.itemId).toBeDefined();
            itemId = response.itemId;
        });

        test('Get item from list', async () => {
            const response = await toDoClient.getItemFromList(listId, itemId);
            expect(response.status).toBe('SUCCESS');
            expect(response.item.name).toBe("Do This Task");
            expect(response.item.status).toBe("TODO");
        });

        test('Update item in list', async () => {
            const updatedItem = {
                name: "This Name Was Updated",
                description: "This Description Was Updated.",
                status: "COMPLETED",
                dueDate: "24/07/2025"
            };
            const response = await toDoClient.updateItemInList(listId, itemId, updatedItem);
            expect(response.status).toBe('SUCCESS');
            expect(response.updatedItem.name).toBe("This Name Was Updated");
            expect(response.updatedItem.status).toBe("COMPLETED");
        });

        test('Try to update non-existent item', async () => {
            const fakeItemId = uuidv4();
            const updatedItem = {
                name: "This Should Fail",
                status: "FAILED"
            };
            const response = await toDoClient.updateItemInList(listId, fakeItemId, updatedItem);
            expect(response.status).toBe('FAIL');
            expect(response.errorMessage).toBeDefined();
        });

        test('Delete item from list', async () => {
            const response = await toDoClient.deleteItemFromList(listId, itemId);
            expect(response.status).toBe('SUCCESS');

            const getResponse = await toDoClient.getItemFromList(listId, itemId);
            expect(getResponse.status).toBe('FAIL');
        });
    });

    describe('Error Handling', () => {
        test('Try to add item to non-existent list', async () => {
            const fakeListId = uuidv4();
            const newItem = {
                name: "This Should Fail",
                status: "TODO"
            };
            const response = await toDoClient.addItemInList(fakeListId, newItem);
            expect(response.status).toBe('FAIL');
            expect(response.errorMessage).toBeDefined();
        });

        test('Try to get item from non-existent list', async () => {
            const fakeListId = uuidv4();
            const fakeItemId = uuidv4();
            const response = await toDoClient.getItemFromList(fakeListId, fakeItemId);
            expect(response.status).toBe('FAIL');
            expect(response.errorMessage).toBeDefined();
        });

        test('Try to update item in non-existent list', async () => {
            const fakeListId = uuidv4();
            const fakeItemId = uuidv4();
            const updatedItem = {
                name: "This Should Fail",
                status: "FAILED"
            };
            const response = await toDoClient.updateItemInList(fakeListId, fakeItemId, updatedItem);
            expect(response.status).toBe('FAIL');
            expect(response.errorMessage).toBeDefined();
        });

        test('Try to delete item from non-existent list', async () => {
            const fakeListId = uuidv4();
            const fakeItemId = uuidv4();
            const response = await toDoClient.deleteItemFromList(fakeListId, fakeItemId);
            expect(response.status).toBe('FAIL');
            expect(response.errorMessage).toBeDefined();
        });
    });
});
