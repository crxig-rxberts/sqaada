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
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h1 className="card-title text-center mb-4">Create New ToDo List</h1>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateList;
