import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addItemInList, getListById, createNewList } from '../clients/toDoClient.js';
import '../StyleComponents/NewTODO.css';
import '../App.css';

export default function NewTODO() {
  const navigate = useNavigate();
  const { listId: urlListId } = useParams();
  const [todoLists, setTodoLists] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoDueDate, setNewTodoDueDate] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [currentListName, setCurrentListName] = useState('');
  const [listName, setListName] = useState('');
  const [listId, setListId] = useState(urlListId || '');
  const [isListNameSubmitted, setIsListNameSubmitted] = useState(false);

  useEffect(() => {
    if (listId) {
      console.log('Fetching list details for listId:', listId);
      fetchListDetails(listId);
    }
  }, [listId]);

  const fetchListDetails = async (id) => {
    try {
      const response = await getListById(id);
      console.log('Fetched list details:', response.list.name);
      setListName(response.list.name || '');
      setIsListNameSubmitted(true);
    } catch (error) {
      console.error('Error fetching list details:', error);
    }
  };

  const handleListNameChange = (e) => {
    setCurrentListName(e.target.value);
  };

  const handleListNameSubmit = async () => {
    if (currentListName) {
      try {
        const newList = await createNewList(currentListName);
        console.log('New list created:', newList);
        setListId(newList.listId);
        setListName(currentListName); // Set the list name immediately
        setIsListNameSubmitted(true);
      } catch (error) {
        console.error('Error creating new list:', error);
      }
    }
  };

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
      await addItemInList(listId, newTodo);
      const updatedLists = [...todoLists];
      if (updatedLists.length === 0) {
        const newList = {
          listId: listId,
          listName: currentListName,
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

  return (
    <div className="new-todo-page-container">
      <div className="content">
        {!isListNameSubmitted ? (
          <div className="list-name-input-container">
            <label>
              Enter List Name:
              <input
                type="text"
                value={currentListName}
                onChange={handleListNameChange}
                className="list-name-input"
              />
            </label>
            <button className="button" onClick={handleListNameSubmit}>Submit</button>
          </div>
        ) : (
          <>
            <h1>{listName ? `${listName}` : 'Loading list details...'}</h1>
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
                    />
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
                      {item.description}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
