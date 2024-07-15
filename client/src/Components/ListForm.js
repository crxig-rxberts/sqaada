// components/ListForm.js
import React, { useState } from 'react';

const ListForm = ({ onSubmit }) => {
    const [listName, setListName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(listName);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="listName" className="form-label">List Name:</label>
                <input
                    type="text"
                    className="form-control"
                    id="listName"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    required
                />
            </div>
            <div className="d-grid">
                <button type="submit" className="btn btn-primary btn-lg">Create List</button>
            </div>
        </form>
    );
};

export default ListForm;