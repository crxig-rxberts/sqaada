import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getListById, addItemInList, updateItemInList, deleteItemFromList } from '../clients/toDoClient';

const ListDetails = () => {
    const { listId } = useParams();
    const [list, setList] = useState(null);
    const [newItem, setNewItem] = useState({ name: '', description: '', status: 'TODO', dueDate: '' });

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
            }
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

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

    if (!list) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="mb-4">{list.name}</h1>
            <h2 className="mb-3">Add New Item</h2>
            <form onSubmit={handleAddItem}>
                <div className="form-group">
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Item Name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Description"
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    />
                    <input
                        type="date"
                        className="form-control mb-2"
                        value={newItem.dueDate}
                        onChange={(e) => setNewItem({ ...newItem, dueDate: e.target.value })}
                    />
                    <select
                        className="form-control mb-2"
                        value={newItem.status}
                        onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
                    >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Add Item</button>
            </form>
            <h2 className="mt-4 mb-3">Items</h2>
            {list.items.length === 0 ? (
                <p>No items in this list. Add one above!</p>
            ) : (
                <ul className="list-group">
                    {list.items.map((item) => (
                        <li key={item.itemId} className="list-group-item">
                            <h5>{item.name}</h5>
                            <p>{item.description}</p>
                            <p>Status: {item.status}</p>
                            <p>Due Date: {item.dueDate}</p>
                            <select
                                className="form-control mb-2"
                                value={item.status}
                                onChange={(e) => handleUpdateItem(item.itemId, { ...item, status: e.target.value })}
                            >
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                            <button className="btn btn-danger" onClick={() => handleDeleteItem(item.itemId)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ListDetails;