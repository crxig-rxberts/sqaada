const toDoRepository = require("../repositories/toDoRepository");

const createNewList = async (reqBody) => {
    return await toDoRepository.createNewList(reqBody.name);
};

const getAllLists = async () => {
    return await toDoRepository.getAllLists();
};

const getListById = async (listId) => {
    return await toDoRepository.getListById(listId);
};

const deleteList = async (listId) => {
    const list = await toDoRepository.getListById(listId);
    if (!list) {
        throw new Error('List not found');
    }
    await toDoRepository.deleteList(listId);
};

module.exports = {
    createNewList,
    getAllLists,
    getListById,
    deleteList
};
