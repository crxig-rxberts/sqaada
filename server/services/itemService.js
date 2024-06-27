const { v4: uuidv4 } = require('uuid');
const toDoRepository = require("../repositories/toDoRepository");

const getItemFromList = async (listId, itemId) => {
    return await checkListAndItemsExistOrThrow(listId, itemId);
};

const addItemToList = async (listId, itemData) => {
    await checkListAndItemsExistOrThrow(listId, null)

    const newItem = {
        itemId: uuidv4(),
        ...itemData,
        createdDate: new Date().toISOString().split('T')[0]
    };

    await toDoRepository.addItemToList(listId, newItem);

    return newItem.itemId;
};

const updateItemInList = async (listId, itemId, updateData) => {
    await checkListAndItemsExistOrThrow(listId, itemId)

    await toDoRepository.updateItemInList(listId, itemId, updateData);
    return await getItemFromList(listId, itemId);
};

const deleteItemFromList = async (listId, itemId) => {
    await checkListAndItemsExistOrThrow(listId, itemId);

    return await toDoRepository.deleteItemFromList(listId, itemId);
};

const checkListAndItemsExistOrThrow = async (listId, itemId) => {
    const list = await toDoRepository.getListById(listId);
    if (list === undefined) {
        throw new Error('List not found');
    }
    const item = list.items.find(item => item.itemId.toString() === itemId.toString());
    if (!item && itemId != null) {
        throw new Error('Item not found in the list');
    }
    return item;
}

module.exports = {
    getItemFromList,
    addItemToList,
    updateItemInList,
    deleteItemFromList
};
