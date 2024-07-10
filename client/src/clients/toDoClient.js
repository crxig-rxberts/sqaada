import axios from 'axios';

const API_BASE_URL = '/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    validateStatus: function (status) {
        return status >= 200 && status < 599;
    },
});

async function createNewList(listName) {
    const response = await axiosInstance.post('/to-do-list/', { name: listName });
    return response.data;
}

async function getAllLists() {
    const response = await axiosInstance.get('/to-do-list/');
    return response.data;
}

async function getListById(listId) {
    const response = await axiosInstance.get(`/to-do-list/${listId}`);
    return response.data;
}

async function deleteList(listId) {
    const response = await axiosInstance.delete(`/to-do-list/${listId}`);
    return response.data;
}

async function addItemInList(listId, item) {
    const response = await axiosInstance.post(`/to-do-list/${listId}`, item);
    return response.data;
}

async function getItemFromList(listId, itemId) {
    const response = await axiosInstance.get(`/to-do-list/${listId}/${itemId}`);
    return response.data;
}

async function updateItemInList(listId, itemId, item) {
    const response = await axiosInstance.put(`/to-do-list/${listId}/${itemId}`, item);
    return response.data;
}

async function deleteItemFromList(listId, itemId) {
    const response = await axiosInstance.delete(`/to-do-list/${listId}/${itemId}`);
    return response.data;
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