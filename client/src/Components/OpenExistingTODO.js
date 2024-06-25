import React, { useState, useEffect } from 'react';
import '../StyleComponents/OpenExistingTODO.css';

const OpenExistingTODO = () => {
      const [listTitle, setListTitle] = useState('');
      const [todoLists, setTodoLists] = useState([]);
      const [selectedList, setSelectedList] = useState(null);
    
      useEffect(() => {
        // Simulated fetch from API
        fetchTodoLists()
          .then(data => setTodoLists(data))
          .catch(error => console.error('Error fetching TODO lists:', error));
      }, []);
    
      const fetchTodoLists = async () => {
        // Simulated API response
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
                dueDate: '25/06/2024',
                createdDate: '20/06/2024'
              },
              {
                itemId: 'b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5',
                name: 'Buy eggs',
                description: 'Dozen large eggs',
                status: 'FLAGGED',
                dueDate: '27/06/2024',
                createdDate: '20/06/2024'
              }
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
                dueDate: '28/06/2024',
                createdDate: '18/06/2024'
              },
              {
                itemId: 'qazwsxedcrfvtgbyhnujmikolpqazwsx',
                name: 'Prepare presentation slides',
                description: 'Slides for the team meeting',
                status: 'COMPLETED',
                dueDate: '30/06/2024',
                createdDate: '18/06/2024'
              }
            ]
          }
          // Add more lists as needed
        ];
      };
    
      const handleListClick = (list) => {
        setSelectedList(list);
      };
    
      const handleBackToLists = () => {
        setSelectedList(null);
      };
    
      const renderTodoList = (list) => {
        return (
          <div className="todo-list">
            <h2>{list.listName}</h2>
            {list.items.map(item => (
              <div key={item.itemId} className={`todo-item ${item.status === 'FLAGGED' ? 'flagged' : ''}`}>
                {item.status === 'FLAGGED' && <div className="red-dot"></div>}
                <p>{item.description}</p>
              </div>
            ))}
            <button className="back-button" onClick={handleBackToLists}>Back to Lists</button>
          </div>
        );
      };
    
      return (
        <div className="existing-todo-page-container">
          <div className="content">
            <div className="button-container">
              <div className="button" onClick={() => setListTitle('')}>Add New TODO List</div>
            </div>
            {!selectedList ? (
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
        </div>
      );
    };
    
export default OpenExistingTODO;