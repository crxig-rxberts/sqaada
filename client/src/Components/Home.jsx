import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllLists, deleteList } from '../clients/toDoClient';
import ListItem from './ListItem';
import LoadingSpinner from './LoadingSpinner';

const Home = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      setLoading(true);
      const response = await getAllLists();
      if (response.status === 'SUCCESS') {
        setLists(response.lists);
      }
    } catch (error) {
      console.error('Error fetching lists:', error);
    } finally {
      setLoading(false);
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

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container py-5">
      <h1 className="display-4 text-center mb-5">Your ToDo Lists</h1>
      {lists.length === 0 ? (
        <div className="text-center">
          <p className="lead text-muted">No lists found. Create a new one!</p>
          <Link to="/create-list" className="btn btn-primary btn-lg mt-3">Create New List</Link>
        </div>
      ) : (
        <div className="row justify-content-center">
          {lists.map((list) => (
            <div key={list.listId} className="col-lg-4 mb-4">
              <ListItem list={list} onDelete={handleDeleteList} />
            </div>
          ))}
        </div>
      )}
      {lists.length > 0 && (
        <div className="text-center mt-4">
          <Link to="/create-list" className="btn btn-primary btn-lg">Create New List</Link>
        </div>
      )}
    </div>
  );
};

export default Home;