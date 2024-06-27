import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNewList } from '../clients/toDoClient';

const CreateList = () => {
    const [listName, setListName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createNewList(listName);
            if (response.status === 'SUCCESS') {
                navigate(`/list/${response.listId}`);
            }
        } catch (error) {
            console.error('Error creating list:', error);
        }
    };

    return (
        <div>
            <h1 className="mb-4">Create New ToDo List</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="listName">List Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="listName"
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">Create List</button>
            </form>
        </div>
    );
};

export default CreateList;
