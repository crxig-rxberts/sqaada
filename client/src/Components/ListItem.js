import React from 'react';
import { Link } from 'react-router-dom';

const ListItem = ({ list, onDelete }) => (
  <div className="card h-100 shadow-sm">
    <div className="card-body d-flex flex-column">
      <h5 className="card-title">{list.name}</h5>
      <Link to={`/list/${list.listId}`} className="btn btn-outline-primary mt-auto mb-2">View List</Link>
      <button className="btn btn-outline-danger" onClick={() => onDelete(list.listId)}>Delete List</button>
    </div>
  </div>
);

export default ListItem;