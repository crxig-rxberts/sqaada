const { v4: uuidv4 } = require('uuid');
const toDoRepository = require("../repositories/toDoRepository");

const getAllLists = async () => {
    return await toDoRepository.getAllLists();
};

const getListById = async (listId) => {
    return await toDoRepository.getListById(listId);
};

const addItemToList = async (listId, itemData) => {
    // Create a new item with a new itemId
    const newItem = {
        itemId: uuidv4(),
        ...itemData,
        createdDate: new Date().toISOString().split('T')[0]
    };

    // Update the item within the list in DynamoDB
    const updateExpression = 'SET #items = list_append(if_not_exists(#items, :empty_list), :item)';
    const expressionAttributeValues = {
        ':item': [newItem],
        ':empty_list': []
    };

    return await toDoRepository.updateItemInList(listId, newItem.itemId, updateExpression, expressionAttributeValues);
};

const updateItemInList = async (listId, itemId, updateData) => {
    let updateExpression = 'SET ';
    const expressionAttributeValues = {};
    for (const [key, value] of Object.entries(updateData)) {
        updateExpression += `items[${itemId}].${key} = :${key}, `;
        expressionAttributeValues[`:${key}`] = value;
    }
    return await toDoRepository.updateItemInList(listId, itemId, updateExpression.slice(0, -2), expressionAttributeValues);
};

const deleteItemFromList = async (listId, itemId) => {
    return await toDoRepository.deleteItemFromList(listId, itemId);
};

module.exports = {
    getAllLists,
    getListById,
    addItemToList,
    updateItemInList,
    deleteItemFromList
};
