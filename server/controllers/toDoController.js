const toDoService = require('../services/toDoService');

const createNewList = async (req, res) => {
    try {
        const result = await toDoService.createNewList(req.body);
        res.json({ status: 'SUCCESS', listId: result });
    } catch (error) {
        if (error.message === 'List name cannot be empty') {
            res.status(400).json({ status: 'FAIL', errorMessage: error.message });
        } else {
            res.status(500).json({ status: 'FAIL', errorMessage: error.message });
        }
    }
};

const getAllLists = async (req, res) => {
    try {
        const result = await toDoService.getAllLists();
        res.json({ status: 'SUCCESS', lists: result.Items });
    } catch (error) {
        res.status(500).send({ status: 'FAIL', errorMessage: error.message });
    }
};

const getListById = async (req, res) => {
    const { listId } = req.params;
    try {
        const result = await toDoService.getListById(listId);
        res.json({ status: 'SUCCESS', list: result });
    } catch (error) {
        if (error.message === 'List not found') {
            res.status(404).json({ status: 'FAIL', errorMessage: 'List not found' });
        } else {
            res.status(500).json({ status: 'FAIL', errorMessage: error.message });
        }
    }
};

const deleteList = async (req, res) => {
    const { listId } = req.params;
    try {
        await toDoService.deleteList(listId);
        res.status(200).json({ status: 'SUCCESS', message: 'List deleted successfully' });
    } catch (error) {
        if (error.message === 'List not found') {
            res.status(404).json({ status: 'FAIL', message: error.message });
        } else {
            res.status(500).json({ status: 'FAIL', message: 'Internal server error' });
        }
    }
};

module.exports = {
    createNewList,
    getAllLists,
    getListById,
    deleteList
};