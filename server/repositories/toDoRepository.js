const { v4: uuidv4 } = require('uuid');
const dynamoDb = require('../config/db');

const TABLE_NAME = 'to-do-table';

const getAllLists = async () => {
    const params = {
        TableName: TABLE_NAME
    };
    return await dynamoDb.scan(params).promise();
};

const getListById = async (listId) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { listId }
    };
    return await dynamoDb.get(params).promise();
};

const addItemToList = async (listId, item) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { listId },
        UpdateExpression: 'SET #items = list_append(if_not_exists(#items, :empty_list), :item)',
        ExpressionAttributeNames: {
            '#items': 'items'
        },
        ExpressionAttributeValues: {
            ':item': [item],
            ':empty_list': []
        },
        ReturnValues: 'ALL_NEW'
    };
    return await dynamoDb.update(params).promise();
};

const updateItemInList = async (listId, itemId, updateExpression, expressionAttributeValues) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { listId },
        UpdateExpression: `SET items[${itemId}] = ${updateExpression}`,
        ExpressionAttributeValues: expressionAttributeValues
    };
    return await dynamoDb.update(params).promise();
};

const deleteItemFromList = async (listId, itemId) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { listId },
        UpdateExpression: `REMOVE items[${itemId}]`
    };
    return await dynamoDb.update(params).promise();
};

module.exports = {
    getAllLists,
    getListById,
    addItemToList,
    updateItemInList,
    deleteItemFromList
};
