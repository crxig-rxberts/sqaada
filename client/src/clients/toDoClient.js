const API_BASE_URL = 'http://localhost:9000/api';

async function createNewList(listName) {
    const response = await fetch(`${API_BASE_URL}/to-do-list/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: listName })
    });
    return response.json();
}

async function getAllLists() {
    const response = await fetch(`${API_BASE_URL}/to-do-list/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}

async function getListById(listId) {
    const response = await fetch(`${API_BASE_URL}/to-do-list/${listId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}

async function deleteList(listId) {
    const response = await fetch(`${API_BASE_URL}/to-do-list/${listId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}

async function addItemInList(listId, item) {
    const response = await fetch(`${API_BASE_URL}/to-do-list/${listId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    });
    return response.json();
}

async function getItemFromList(listId, itemId) {
    const response = await fetch(`${API_BASE_URL}/to-do-list/${listId}/${itemId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}

async function updateItemInList(listId, itemId, item) {
    const response = await fetch(`${API_BASE_URL}/to-do-list/${listId}/${itemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    });
    return response.json();
}

async function deleteItemFromList(listId, itemId) {
    const response = await fetch(`${API_BASE_URL}/to-do-list/${listId}/${itemId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}

export {
    createNewList,
    getAllLists,
    getListById,
    deleteList,
    addItemInList,
    getItemFromList,
    updateItemInList,
    deleteItemFromList
};