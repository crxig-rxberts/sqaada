import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllLists, deleteList } from '../clients/toDoClient';

const Home = () => {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    fetchLists().catch(error => {
      console.error('Error in Home.useEffect when fetching lists:', error);
    });
  }, []);

  const fetchLists = async () => {
    try {
      const response = await getAllLists();
      if (response.status === 'SUCCESS') {
        setLists(response.lists);
      }
    } catch (error) {
      console.error('Error fetching lists:', error);
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      await deleteList(listId);
      await fetchLists();
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  return (
      <div>
        <h1 className="mb-4">Your ToDo Lists</h1>
        {lists.length === 0 ? (
            <p>No lists found. Create a new one!</p>
        ) : (
            <ul className="list-group">
              {lists.map((list) => (
                  <li key={list.listId} className="list-group-item d-flex justify-content-between align-items-center">
                    <Link to={`/list/${list.listId}`}>{list.name}</Link>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteList(list.listId)}>Delete</button>
                  </li>
              ))}
            </ul>
        )}
        <Link to="/create-list" className="btn btn-primary mt-3">Create New List</Link>
      </div>
  );
};

export default Home;