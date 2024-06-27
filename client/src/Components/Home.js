import React, { useState, useEffect } from 'react';
import '../StyleComponents/Home.css';
import { Link, useNavigate } from 'react-router-dom';
import { createNewList } from '../clients/toDoClient.js';

const Home = () => {
  const [listTitle, setListTitle] = useState('');
  const [todoLists, setTodoLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodoLists()
      .then(data => setTodoLists(data))
      .catch(error => console.error('Error fetching TODO lists:', error));
  }, []);

  const fetchTodoLists = async () => {
    return [
      {
        listId: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p',
        listName: 'Grocery List',
        items: [
          {
            itemId: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
            name: 'Buy milk',
            description: 'Get a gallon of whole milk',
            status: 'TODO',
            dueDate: '2024-06-25',
            createdDate: '2024-06-20'
          },
          {
            itemId: 'b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5',
            name: 'Buy eggs',
            description: 'Dozen large eggs',
            status: 'FLAGGED',
            dueDate: '2024-06-27',
            createdDate: '2024-06-20'
          },
          {
            itemId: 'b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5',
            name: 'Buy eggs',
            description: 'Dozen large eggs',
            status: 'FLAGGED',
            dueDate: '2024-06-27',
            createdDate: '2024-06-20'
          },
          {
            itemId: 'b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5',
            name: 'Buy eggs',
            description: 'Dozen large eggs',
            status: 'FLAGGED',
            dueDate: '2024-06-27',
            createdDate: '2024-06-20'
          },
          {
            itemId: 'b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5',
            name: 'Buy eggs',
            description: 'Dozen large eggs',
            status: 'FLAGGED',
            dueDate: '2024-06-27',
            createdDate: '2024-06-20'
          },
          
        ]
      },
      {
        listId: 'q1w2e3r4t5y6u7i8o9p0a1s2d3f4g5h6j',
        listName: 'Work Tasks',
        items: [
          {
            itemId: 'c1v2b3n4m5v6b7n8m9z0x1c2v3b4n5m6v7b8',
            name: 'Finish project proposal',
            description: 'Submit to the client for approval',
            status: 'TODO',
            dueDate: '2024-06-28',
            createdDate: '2024-06-18'
          },
          {
            itemId: 'qazwsxedcrfvtgbyhnujmikolpqazwsx',
            name: 'Prepare presentation slides',
            description: 'Slides for the team meeting',
            status: 'COMPLETED',
            dueDate: '2024-06-30',
            createdDate: '2024-06-18'
          }
        ]
      }
    ];
  };

  const handleListClick = (list) => {
    setSelectedList(list);
  };

  const handleBackToLists = () => {
    setSelectedList(null);
    setSelectedItem(null);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setSelectedItem(null);
  };

  const handleSaveChanges = () => {
    const updatedList = { ...selectedList };
    const updatedItems = updatedList.items.map(item =>
      item.itemId === selectedItem.itemId ? selectedItem : item
    );
    updatedList.items = updatedItems;
    setSelectedList(updatedList);

    const updatedTodoLists = todoLists.map(list =>
      list.listId === updatedList.listId ? updatedList : list
    );
    setTodoLists(updatedTodoLists);

    handlePopupClose();
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedItem({ ...selectedItem, [name]: value });
  };

  const handleAddNewList = async () => {
    try {
      const newList = await createNewList(listTitle);
      setTodoLists([...todoLists, newList]);
      setIsCreatePopupOpen(false);
      navigate('/newTODO');
    } catch (error) {
      console.error('Error creating new list:', error);
    }
  };

  const handleCreatePopupClose = () => {
    setIsCreatePopupOpen(false);
    setListTitle('');
  };

  const renderTodoList = (list) => {
    return (
      <div className="todo-list">
        <h2>{list.listName}</h2>
        {list.items.map(item => (
          <div
            key={item.itemId}
            className={`todo-item ${item.status === 'FLAGGED' ? 'flagged' : ''}`}
            onClick={() => handleItemClick(item)}
          >
            {item.status === 'FLAGGED' && <div className="red-dot"></div>}
            {item.status === 'COMPLETED' && <span className="pill-tag">Completed</span>}
            <p>{item.name}</p>
          </div>
        ))}
        <button className="back-button" onClick={handleBackToLists}>Back to Lists</button>
      </div>
    );
  };

  const renderEditPopup = () => {
    if (!selectedItem) return null;

    return (
      <div className="popup">
        <div className="popup-content">
          <h3>Edit TODO Item</h3>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={selectedItem.name}
              onChange={handleEditChange}
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={selectedItem.description}
              onChange={handleEditChange}
            />
          </label>
          <label>
            Due Date:
            <input
              type="date"
              name="dueDate"
              value={selectedItem.dueDate}
              onChange={handleEditChange}
            />
          </label>
          <label>
            Status:
            <select
              name="status"
              value={selectedItem.status}
              onChange={handleEditChange}
            >
              <option value="TODO">TODO</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="FLAGGED">FLAGGED</option>
            </select>
          </label>
          <div className="popup-buttons">
            <button onClick={handleSaveChanges}>Save</button>
            <button onClick={handlePopupClose}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  const renderCreatePopup = () => {
    return (
      <div className="popup">
        <div className="popup-content">
          <h3>Create New TODO List</h3>
          <label>
            List Title:
            <input
              type="text"
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
            />
          </label>
          <div className="popup-buttons">
            <button onClick={handleAddNewList}>Submit</button>
            <button onClick={handleCreatePopupClose}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`existing-todo-page-container ${isCreatePopupOpen ? 'hide-content' : ''}`}>
      <div className="content">
        {!selectedList && !isCreatePopupOpen && (
          <div className="button-container">
            <button className="button" onClick={() => setIsCreatePopupOpen(true)}>Add New TODO List</button>
          </div>
        )}
        {!selectedList && !isCreatePopupOpen ? (
          <div className="list-container">
            {todoLists.map(list => (
              <div key={list.listId} className="list-item" onClick={() => handleListClick(list)}>
                <h2>{list.listName}</h2>
              </div>
            ))}
          </div>
        ) : (
          renderTodoList(selectedList)
        )}
      </div>
      {isPopupOpen && renderEditPopup()}
      {isCreatePopupOpen && renderCreatePopup()}
    </div>
  );
};

export default Home;
