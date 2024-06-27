const { v4: uuidv4 } = require('uuid');
const dynamoDb = require('../config/db');

const TABLE_NAME = 'to-do-table';

const createNewList = async (listName) => {
    const listId = uuidv4();
    const params = {
        TableName: TABLE_NAME,
        Item: {
            listId: listId,
            name: listName,
            items: []
        },
        ConditionExpression: 'attribute_not_exists(listId)'
    };

    try {
        await dynamoDb.put(params).promise();
        return listId;
    } catch (error) {
        handleDynamoDBError('createNewList', error);
    }
};

const getAllLists = async () => {
    const params = {
        TableName: TABLE_NAME
    };
    try {
        return await dynamoDb.scan(params).promise();
    } catch (error) {
        handleDynamoDBError('getAllLists', error);
    }
};

const getListById = async (listId) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { listId }
    };
    try {
        const result = await dynamoDb.get(params).promise();
        return result.Item;
    } catch (error) {
        handleDynamoDBError('getListById', error);
    }
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

    try {
        await dynamoDb.update(params).promise();
    } catch (error) {
        handleDynamoDBError('addItemToList', error);
    }
};

const updateItemInList = async (listId, itemId, updateData) => {
    try {
        const currentItem = await getCurrentItems(listId);
        const itemIndex = findItemIndex(currentItem, itemId);
        const updateParams = buildUpdateItemParams(listId, itemIndex, updateData);

        return await dynamoDb.update(updateParams).promise();
    } catch (error) {
        handleDynamoDBError('updateItemInList', error);
    }
};

const getCurrentItems = async (listId) => {
    const result = await dynamoDb.get({
        TableName: TABLE_NAME,
        Key: { listId }
    }).promise();

    return result.Item;
};

const findItemIndex = (currentItems, itemId) => {
    const itemIndex = currentItems.items.findIndex(item => item.itemId === itemId);
    if (itemIndex === -1) {
        throw new Error('Item not found in the list');
    }
    return itemIndex;
};

const buildUpdateItemParams = (listId, itemIndex, updateData) => {
    const { updateExpression, expressionAttributeNames, expressionAttributeValues } = buildUpdateItemExpressions(itemIndex, updateData);

    return {
        TableName: TABLE_NAME,
        Key: { listId },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ConditionExpression: `attribute_exists(#items[${itemIndex}])`,
        ReturnValues: 'ALL_NEW'
    };
};

const buildUpdateItemExpressions = (itemIndex, updateData) => {
    let updateExpression = "SET ";
    const expressionAttributeNames = { '#items': 'items' };
    const expressionAttributeValues = {};

    Object.entries(updateData).forEach(([key, value], index) => {
        const isLast = index === Object.keys(updateData).length - 1;
        updateExpression += `#items[${itemIndex}].#${key} = :${key}${isLast ? '' : ', '}`;
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = value;
    });

    return { updateExpression, expressionAttributeNames, expressionAttributeValues };
};

const deleteList = async (listId) => {
    try {
        const params = {
            TableName: TABLE_NAME,
            Key: { listId }
        };
        await dynamoDb.delete(params).promise();
    } catch (error) {
        handleDynamoDBError('Delete List', error);
    }
};

const deleteItemFromList = async (listId, itemId) => {
    try {
        const currentList = await getCurrentItems(listId);
        const itemIndexToRemove = findItemIndex(currentList, itemId);

        const updateParams = {
            TableName: TABLE_NAME,
            Key: { listId },
            UpdateExpression: 'REMOVE #items[' + itemIndexToRemove + ']',
            ExpressionAttributeNames: {
                '#items': 'items'
            },
            ConditionExpression: 'attribute_exists(#items[' + itemIndexToRemove + '])'
        };

        return await dynamoDb.update(updateParams).promise();
    } catch (error) {
        handleDynamoDBError('Delete Item From List', error);
    }
};

const handleDynamoDBError = (operation, error) => {
    let consumerNote = `Unable to ${operation} due to an Internal Failure`;
    let debugMessage = `Unexpected failure during ${operation}`;

    if (error.message && error.message.includes('Item not found in the list')) {
        consumerNote = error.message;
        debugMessage = 'Item not found';
    } else if (error.code === 'ConditionalCheckFailedException') {
        debugMessage = 'Condition check failed';
    } else if (error.code === 'ProvisionedThroughputExceededException') {
        debugMessage = 'Request rate is too high. Please retry with exponential backoff.';
    } else if (error.code === 'ResourceNotFoundException') {
        debugMessage = 'Specified table not found';
    } else if (error.code === 'InternalServerError') {
        debugMessage = 'Internal server error, please try again later';
    }

    console.error(`${operation} ${debugMessage} - DynamoDB Error:`, error);

    throw new Error(`${consumerNote}.`);
};

module.exports = {
    createNewList,
    getAllLists,
    getListById,
    addItemToList,
    updateItemInList,
    deleteList,
    deleteItemFromList
};
