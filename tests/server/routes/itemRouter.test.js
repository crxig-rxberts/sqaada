const express = require('express');
const request = require('supertest');

const itemRouterPath = '../../../server/routes/itemRouter';
const itemRouter = require(itemRouterPath);
const itemController = require('../../../server/controllers/itemController');

jest.mock(itemRouterPath);
jest.mock('../../../server/controllers/itemController');

describe('itemRouter', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/api', itemRouter);

        jest.resetAllMocks();
        itemController.addItemInList.mockImplementation((req, res) => res.json({ status: 'SUCCESS' }));
        itemController.updateItemInList.mockImplementation((req, res) => res.json({ status: 'SUCCESS' }));
        itemController.deleteItemFromList.mockImplementation((req, res) => res.json({ status: 'SUCCESS' }));
    });

    test('POST /api/to-do-list/:listId calls addItemInList controller', async () => {
        await request(app).post('/api/to-do-list/123').send({});
        expect(itemController.addItemInList).toHaveBeenCalled();
    });

    test('PUT /api/to-do-list/:listId/:itemId calls updateItemInList controller', async () => {
        await request(app).put('/api/to-do-list/123/456').send({});
        expect(itemController.updateItemInList).toHaveBeenCalled();
    });

    test('DELETE /api/to-do-list/:listId/:itemId calls deleteItemFromList controller', async () => {
        await request(app).delete('/api/to-do-list/123/456');
        expect(itemController.deleteItemFromList).toHaveBeenCalled();
    });
});
