const express = require('express');
const router = express.Router();
const toDoController = require('../controllers/toDoController');

// POST - Create New List
router.post('/to-do-list/', toDoController.createNewList);

// GET - Get All Lists
router.get('/to-do-list/', toDoController.getAllLists);

// GET - Get List
router.get('/to-do-list/:listId', toDoController.getListById);

// DELETE - Delete List
router.delete('/to-do-list/:listId', toDoController.deleteList);

module.exports = router;