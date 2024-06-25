const API_BASE_URL = 'http://localhost:8000/api/to-do-list';

async function getAllLists() {
    const response = await fetch(`${API_BASE_URL}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}

async function getListById(listId) {
    const response = await fetch(`${API_BASE_URL}/${listId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}

async function addItemInList(listId, item) {
    const response = await fetch(`${API_BASE_URL}/${listId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    });
    return response.json();
}

async function updateItemInList(listId, itemId, item) {
    const response = await fetch(`${API_BASE_URL}/${listId}/${itemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    });
    return response.json();
}

async function deleteItemFromList(listId, itemId) {
    const response = await fetch(`${API_BASE_URL}/${listId}/${itemId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}

/*
This needs updating dont refer to the below yet, will create postman to demonstrate example usage

getAllLists().then(data => console.log(data));
getListById('123').then(data => console.log(data));
addItemInList('123', { name: 'New Item', description: 'Description of the new item' }).then(data => console.log(data));
updateItemInList('123', '456', { name: 'Updated Item', status: 'COMPLETED' }).then(data => console.log(data));
deleteItemFromList('123', '456').then(data => console.log(data));
*/

export {
    getAllLists,
    getListById,
    addItemInList,
    updateItemInList,
    deleteItemFromList
};
