const itemService = require('../services/itemService');

const getItemFromList = async (req, res) => {
    const { listId, itemId } = req.params;
    try {
        const item = await itemService.getItemFromList(listId, itemId);
        res.json({ status: 'SUCCESS', item: item });
    } catch (error) {
        if (error.message && error.message.includes('not found')) {
            res.status(404).json({ status: 'FAIL', errorMessage: error.message });
        } else {
            res.status(500).json({ status: 'FAIL', errorMessage: error.message });
        }
    }
};

const addItemInList = async (req, res) => {
    const { listId } = req.params;
    try {
        const result = await itemService.addItemToList(listId, req.body);
        res.json({ status: 'SUCCESS', itemId: result });
    } catch (error) {
        if (error.message === 'List not found') {
            res.status(404).json({ status: 'FAIL', errorMessage: error.message });
        } else {
            res.status(500).json({ status: 'FAIL', errorMessage: error.message });
        }
    }
};

const updateItemInList = async (req, res) => {
    const { listId, itemId } = req.params;
    try {
        const result = await itemService.updateItemInList(listId, itemId, req.body);
        res.json({ status: 'SUCCESS', updatedItem: result });
    } catch (error) {
        if (error.message === 'List not found' || error.message === 'Item not found in the list') {
            res.status(404).json({ status: 'FAIL', errorMessage: error.message });
        } else {
            res.status(500).json({ status: 'FAIL', errorMessage: error.message });
        }
    }
};

const deleteItemFromList = async (req, res) => {
    const { listId, itemId } = req.params;
    try {
        await itemService.deleteItemFromList(listId, itemId);
        res.json({ status: 'SUCCESS' });
    } catch (error) {
        if (error.message === 'List not found' || error.message === 'Item not found in the list') {
            res.status(404).json({ status: 'FAIL', errorMessage: error.message });
        } else {
            res.status(500).json({ status: 'FAIL', errorMessage: error.message });
        }
    }
};

module.exports = {
    getItemFromList,
    addItemInList,
    updateItemInList,
    deleteItemFromList
};
