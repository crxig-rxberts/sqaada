const express = require('express');
const request = require('supertest');

const toDoRouterPath = '../../../server/routes/toDoRouter';
const toDoRouter = require(toDoRouterPath);
const toDoController = require('../../../server/controllers/toDoController');

jest.mock(toDoRouterPath);
jest.mock('../../../server/controllers/toDoController');

describe('toDoRouter', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/api', toDoRouter); // Mount router under '/api'

        // Reset mocks and mock implementations for controller methods
        jest.resetAllMocks();
        toDoController.getListById.mockImplementation((req, res) => res.json({ status: 'SUCCESS' }));
        toDoController.addItemInList.mockImplementation((req, res) => res.json({ status: 'SUCCESS' }));
        toDoController.updateItemInList.mockImplementation((req, res) => res.json({ status: 'SUCCESS' }));
        toDoController.deleteItemFromList.mockImplementation((req, res) => res.json({ status: 'SUCCESS' }));
    });

    test('GET /api/to-do-list/:listId calls getListById controller', async () => {
        await request(app).get('/api/to-do-list/123');
        expect(toDoController.getListById).toHaveBeenCalled();
    });

    test('POST /api/to-do-list/:listId calls addItemInList controller', async () => {
        await request(app).post('/api/to-do-list/123').send({});
        expect(toDoController.addItemInList).toHaveBeenCalled();
    });

    test('PUT /api/to-do-list/:listId/:itemId calls updateItemInList controller', async () => {
        await request(app).put('/api/to-do-list/123/456').send({});
        expect(toDoController.updateItemInList).toHaveBeenCalled();
    });

    test('DELETE /api/to-do-list/:listId/:itemId calls deleteItemFromList controller', async () => {
        await request(app).delete('/api/to-do-list/123/456');
        expect(toDoController.deleteItemFromList).toHaveBeenCalled();
    });
});
