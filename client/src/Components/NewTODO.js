import React, { useState } from 'react';
import { addItemInList } from '../clients/toDoClient.js';
import '../StyleComponents/NewTODO.css';
import '../App.css';

export default function NewTODO() {
  const [todoLists, setTodoLists] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoDueDate, setNewTodoDueDate] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  const handleNewTodoClick = () => {
    setIsPopupOpen(true);
  };

  const handleNewTodoPopupClose = () => {
    setIsPopupOpen(false);
    resetNewTodoForm();
  };

  const resetNewTodoForm = () => {
    setNewTodoTitle('');
    setNewTodoDescription('');
    setNewTodoDueDate('');
    setIsUrgent(false);
  };

  const handleSaveNewTodo = async () => {
    const newTodo = {
      name: newTodoTitle,
      description: newTodoDescription,
      dueDate: newTodoDueDate,
      status: isUrgent ? 'FLAGGED' : 'TODO',
    };

    try {
      await addItemInList(newTodo);
      const updatedLists = [...todoLists];
      if (updatedLists.length === 0) {
        const newList = {
          listId: generateListId(),
          listName: 'Default List',
          items: [newTodo],
        };
        updatedLists.push(newList);
      } else {
        updatedLists[0].items.push(newTodo);
      }
      setTodoLists(updatedLists);
      handleNewTodoPopupClose();
    } catch (error) {
      console.error('Error adding new todo:', error);
    }
  };

  const generateItemId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  const generateListId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  return (
    <div className="new-todo-page-container">
      <div className="content">
        {!isPopupOpen && (
          <div className="button-container">
            <button className="button" onClick={handleNewTodoClick}>Create New TODO</button>
          </div>
        )}
        {isPopupOpen && (
          <div className="popup">
            <div className="popup-content">
              <h3>Create a TODO</h3>
              <label>
                Title:
                <input
                  type="text"
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                />
              </label>
              <label>
                Description:
                <textarea
                  value={newTodoDescription}
                  onChange={(e) => setNewTodoDescription(e.target.value)}
                />
              </label>
              <label>
                Due Date:
                <input
                  type="date"
                  value={newTodoDueDate}
                  onChange={(e) => setNewTodoDueDate(e.target.value)}
                />
              </label>
              <label>
                Urgent:
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                /> Urgent
              </label>
              <div className="popup-buttons">
                <button onClick={handleSaveNewTodo}>Save</button>
                <button onClick={handleNewTodoPopupClose}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        <div className="list-container">
          {todoLists.map((list) => (
            <div key={list.listId} className="list-item">
              <h2>{list.listName}</h2>
              {list.items.map((item) => (
                <div key={item.itemId} className={`todo-item ${item.status === 'FLAGGED' ? 'flagged' : ''}`}>
                  {item.status === 'FLAGGED' && <span className="pill-tag">Urgent</span>}
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}