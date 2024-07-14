import React from 'react';

const TodoItem = ({ item, onStatusChange, onEdit, onDelete }) => (
    <div className={`list-group-item list-group-item-action mb-3 rounded shadow-sm position-relative ${
        item.status === 'COMPLETED' ? 'bg-success bg-opacity-25' : item.status === 'FLAGGED'  ? 'bg-warning bg-opacity-25' : ''
    }`}>
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
                onChange={(e) => onStatusChange(item.itemId, e.target.value)}
                disabled={item.status === 'COMPLETED'}
            >
                <option value="TODO">To Do</option>
                <option value="FLAGGED">Flagged</option>
                <option value="COMPLETED">Completed</option>
            </select>
            <div className="btn-group">
                <button 
                    className="btn btn-primary btn-md" 
                    onClick={() => onEdit(item.itemId)}
                >
                    Edit
                </button>
                <button 
                    className="btn btn-danger btn-md ms-2" 
                    onClick={() => onDelete(item.itemId)}
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
);

export default TodoItem;