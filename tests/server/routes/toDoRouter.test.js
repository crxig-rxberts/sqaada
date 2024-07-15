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
    toDoController.createNewList.mockImplementation((req, res) => res.json({ status: 'SUCCESS' }));
    toDoController.getAllLists.mockImplementation((req, res) => res.json({ status: 'SUCCESS' }));
    toDoController.getListById.mockImplementation((req, res) => res.json({ status: 'SUCCESS' }));
    toDoController.deleteList.mockImplementation((req, res) => res.json({ status: 'SUCCESS' }));
  });

  test('POST /api/to-do-list/ calls createNewList controller', async () => {
    await request(app)
      .post('/api/to-do-list/')
      .send({'name': 'To Do List'});
    expect(toDoController.createNewList).toHaveBeenCalled();
  });

  test('GET /api/to-do-list/ calls getAllLists controller', async () => {
    await request(app).get('/api/to-do-list/');
    expect(toDoController.getAllLists).toHaveBeenCalled();
  });

  test('GET /api/to-do-list/:listId calls getListById controller', async () => {
    await request(app).get('/api/to-do-list/123');
    expect(toDoController.getListById).toHaveBeenCalled();
  });

  test('DELETE /api/to-do-list/:listId calls deleteList controller', async () => {
    await request(app).delete('/api/to-do-list/123');
    expect(toDoController.deleteList).toHaveBeenCalled();
  });
});