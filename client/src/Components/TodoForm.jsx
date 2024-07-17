import React from 'react';

const TodoForm = ({ item, onChange, onSubmit }) => (
  <form onSubmit={onSubmit}>
    <div className="mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Item Name"
        value={item.name}
        onChange={(e) => onChange({ ...item, name: e.target.value })}
        required
      />
    </div>
    <div className="mb-3">
      <textarea
        className="form-control"
        placeholder="Description"
        value={item.description}
        onChange={(e) => onChange({ ...item, description: e.target.value })}
      ></textarea>
    </div>
    <div className="mb-3">
      <input
        type="date"
        className="form-control"
        value={item.dueDate}
        onChange={(e) => onChange({ ...item, dueDate: e.target.value })}
      />
    </div>
    <div className="mb-3">
      <select
        className="form-select"
        value={item.status}
        onChange={(e) => onChange({ ...item, status: e.target.value })}
        disabled={item.status === 'COMPLETED'}
      >
        <option value="TODO">To Do</option>
        <option value="FLAGGED">Flagged</option>
        <option value="COMPLETED">Completed</option>
      </select>
    </div>
    <button type="submit" className="btn btn-primary w-100">
      {item.itemId ? 'Save Changes' : 'Add Item'}
    </button>
  </form>
);

export default TodoForm;