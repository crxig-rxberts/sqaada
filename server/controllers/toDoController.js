const toDoService = require('../services/toDoService');

const getAllLists = async (req, res) => {
    try {
        const result = await toDoService.getAllLists();
        res.json(result.Items);
    } catch (error) {
        res.status(500).send({ status: 'FAIL', errorMessage: error.message });
    }
};

const getListById = async (req, res) => {
    const { listId } = req.params;
    try {
        const result = await toDoService.getListById(listId);
        res.json(result.Items);
    } catch (error) {
        res.status(500).send({ status: 'FAIL', errorMessage: error.message });
    }
};

const addItemInList = async (req, res) => {
    const { listId } = req.params;
    try {
        const result = await toDoService.addItemToList(listId, req.body);
        res.json({ status: 'SUCCESS', itemId: result.Item.itemId });
    } catch (error) {
        res.status(500).send({ status: 'FAIL', errorMessage: error.message });
    }
};

const updateItemInList = async (req, res) => {
    const { listId, itemId } = req.params;
    try {
        await toDoService.updateItemInList(listId, itemId, req.body);
        res.json({ status: 'SUCCESS' });
    } catch (error) {
        res.status(500).send({ status: 'FAIL', errorMessage: error.message });
    }
};

const deleteItemFromList = async (req, res) => {
    const { listId, itemId } = req.params;
    try {
        await toDoService.deleteItemFromList(listId, itemId);
        res.json({ status: 'SUCCESS' });
    } catch (error) {
        res.status(500).send({ status: 'FAIL', errorMessage: error.message });
    }
};

module.exports = {
    getAllLists,
    getListById,
    addItemInList,
    updateItemInList,
    deleteItemFromList
};
