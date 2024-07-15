const toDoRepository = require('../repositories/toDoRepository');

const createNewList = async (reqBody) => {
  if (!reqBody.name || reqBody.name.trim() === '') {
    throw new Error('List name cannot be empty');
  }
  return await toDoRepository.createNewList(reqBody.name.trim());
};

const getAllLists = async () => {
  return await toDoRepository.getAllLists();
};

const getListById = async (listId) => {
  const list = await toDoRepository.getListById(listId);
  if (!list) {
    throw new Error('List not found');
  }
  return list;
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
