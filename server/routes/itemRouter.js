const express = require('express');
const router = express.Router({ mergeParams: true });
const itemController = require('../controllers/itemController');

// POST - Add Item In List
router.post('/to-do-list/:listId', itemController.addItemInList);

// GET - Get Item From List
router.get('/to-do-list/:listId/:itemId', itemController.getItemFromList);

// PUT - Update Item In List
router.put('/to-do-list/:listId/:itemId', itemController.updateItemInList);

// DELETE - Delete Item From List
router.delete('/to-do-list/:listId/:itemId', itemController.deleteItemFromList);

module.exports = router;