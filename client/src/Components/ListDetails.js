import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getListById, addItemInList, updateItemInList, deleteItemFromList } from '../clients/toDoClient';

const ListDetails = () => {
    const { listId } = useParams();
    const [list, setList] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    if (!list) return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-primary" role="status"></div></div>;

    return (
        <div className="container py-5">
            <h1 className="display-4 text-center mb-5">{list.name}</h1>
            <button onClick={toggleModal} className="btn btn-primary mb-4">Add New Item</button>

            {!isModalOpen && (
                <div className="row">
                    <div className="col-md-12">
                        <h2 className="h4 mb-4">Items</h2>
                        {list.items.length === 0 ? (
                            <p className="text-muted">No items in this list. Add one using the button above!</p>
                        ) : (
                            <div className="list-group">
                                {list.items.map((item) => (
                                    <div 
                                    key={item.itemId} 
                                    className={`list-group-item list-group-item-action mb-3 rounded shadow-sm position-relative ${
                                        item.status === 'COMPLETED' ? 'bg-success bg-opacity-25' : item.status === 'FLAGGED'  ? 'bg-warning bg-opacity-25' : ''
                                    }`}
                                    >
                                    {item.status === 'FLAGGED' && (
                                        <span className="position-absolute top-0 end-0 translate-middle p-2 bg-danger border border-light rounded-circle">
                                        <span className="visually-hidden">Flagged item</span>
                                        </span>
                                    )}
                                    <div className="d-flex w-100 justify-content-between align-items-center mb-2">
                                        <h5 className="mb-1">{item.name}</h5>
                                        <small className="text-muted">{item.dueDate}</small>
                                    </div>
                                    <p className="mb-2">{item.description}</p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <select
                                        className="form-select w-50"
                                        value={item.status}
                                        onChange={(e) => handleUpdateItem(item.itemId, { ...item, status: e.target.value })}
                                        disabled={item.status === 'COMPLETED'}
                                        >
                                        <option value="TODO">To Do</option>
                                        <option value="FLAGGED">Flagged</option>
                                        <option value="COMPLETED">Completed</option>
                                        </select>
                                        <button 
                                        className="btn btn-danger btn-sm" 
                                        onClick={() => handleDeleteItem(item.itemId)}
                                        >
                                        Delete
                                        </button>
                                    </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="modal d-block align-content-center" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add New Item</h5>
                                <button type="button" className="btn-close" onClick={toggleModal} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleAddItem}>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Item Name"
                                            value={newItem.name}
                                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <textarea
                                            className="form-control"
                                            placeholder="Description"
                                            value={newItem.description}
                                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={newItem.dueDate}
                                            onChange={(e) => setNewItem({ ...newItem, dueDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <select
                                            className="form-select"
                                            value={newItem.status}
                                            onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
                                        >
                                            <option value="TODO">To Do</option>
                                            <option value="FLAGGED">Flagged</option>
                                            <option value="COMPLETED">Completed</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">Add Item</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && <div className="modal-backdrop fade show"></div>}
        </div>
    );
};

export default ListDetails;
