const { v4: uuidv4 } = require('uuid');
const toDoRepository = require("../repositories/toDoRepository");
const toDoService = require("./toDoService");

const getItemFromList = async (listId, itemId) => {
    const list = await toDoService.getListById(listId);

    if (!list) {
        throw new Error('List not found');
    }

    const item = list.items.find(item => item.itemId.toString() === itemId.toString());

    if (!item) {
        throw new Error('Item not found in the list');
    }

    return item;
};

const addItemToList = async (listId, itemData) => {
    const newItem = {
        itemId: uuidv4(),
        ...itemData,
        createdDate: new Date().toISOString().split('T')[0]
    };

    await toDoRepository.addItemToList(listId, newItem);

    return newItem.itemId;
};

const updateItemInList = async (listId, itemId, updateData) => {
    await toDoRepository.updateItemInList(listId, itemId, updateData);
    return await getItemFromList(listId, itemId);
};

const deleteItemFromList = async (listId, itemId) => {
    return await toDoRepository.deleteItemFromList(listId, itemId);
};

module.exports = {
    getItemFromList,
    addItemToList,
    updateItemInList,
    deleteItemFromList
};
