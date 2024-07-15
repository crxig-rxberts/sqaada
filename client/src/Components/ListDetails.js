import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  getListById,
  addItemInList,
  updateItemInList,
  deleteItemFromList,
  getItemFromList
} from '../clients/toDoClient';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';

const ListDetails = () => {
  const { listId } = useParams();
  const [list, setList] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', description: '', status: 'TODO', dueDate: '' });
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchList = useCallback(async () => {
    try {
      const response = await getListById(listId);
      if (response.status === 'SUCCESS') {
        setList(response.list);
      }
    } catch (error) {
      console.error('Error fetching list:', error);
    }
  }, [listId]);

  useEffect(() => {
    fetchList().catch(error => {
      console.error('Error in ListDetails.useEffect when fetching list:', error);
    });
  }, [fetchList]);

  const handleUpdateItem = async (itemId, updatedItem) => {
    try {
      await updateItemInList(listId, itemId, updatedItem);
      await fetchList();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteItemFromList(listId, itemId);
      await fetchList();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const response = await addItemInList(listId, newItem);
      if (response.status === 'SUCCESS') {
        setList(prevList => ({
          ...prevList,
          items: [...prevList.items, { ...newItem, itemId: response.itemId }]
        }));
        setNewItem({ name: '', description: '', status: 'TODO', dueDate: '' });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleItemClick = async (itemId) => {
    try {
      const response = await getItemFromList(listId, itemId);
      if (response.status === 'SUCCESS') {
        setCurrentItem(response.item);
        setNewItem(response.item);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching item:', error);
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (currentItem) {
      await handleUpdateItem(currentItem.itemId, newItem);
    } else {
      await handleAddItem(e);
    }
    setIsModalOpen(false);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setCurrentItem(null);
    setNewItem({ name: '', description: '', status: 'TODO', dueDate: '' });
  };

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortedItems = list?.items.slice().sort((a, b) => {
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  if (!list) return <LoadingSpinner />;

  return (
      <div className="container py-5">
        <h1 className="display-4 text-center mb-5">{list.name}</h1>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button onClick={toggleModal} className="btn bg-info shadow-sm">Add New Item</button>
          <button onClick={toggleSortOrder} className="btn btn-outline-secondary">
            Sort by Date {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        <div className="row">
          <div className="col-md-12">
            <h2 className="h4 mb-4">Items</h2>
            {sortedItems.length === 0 ? (
                <p className="text-muted">No items in this list. Add one using the button above!</p>
            ) : (
                <div className="list-group">
                  {sortedItems.map((item) => (
                      <TodoItem
                          key={item.itemId}
                          item={item}
                          onStatusChange={handleUpdateItem}
                          onEdit={handleItemClick}
                          onDelete={handleDeleteItem}
                      />
                  ))}
                </div>
            )}
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={toggleModal} title={currentItem ? 'Edit Item' : 'Add New Item'}>
          <TodoForm
              item={newItem}
              onChange={setNewItem}
              onSubmit={handleModalSubmit}
          />
        </Modal>
      </div>
  );
};

export default ListDetails;