const express = require('express');
const router = express.Router();
const toDoController = require('../controllers/toDoController');

// This file defines the backend endpoint routes and associates them with controllers methods
router.get('/to-do-list/', toDoController.getAllLists);
router.get('/to-do-list/:listId', toDoController.getListById);
router.post('/to-do-list/:listId', toDoController.addItemInList);
router.put('/to-do-list/:listId/:itemId', toDoController.updateItemInList);
router.delete('/to-do-list/:listId/:itemId', toDoController.deleteItemFromList);

module.exports = router;
