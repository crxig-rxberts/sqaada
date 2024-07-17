import React from 'react';

const Card = ({ title, children }) => {
  return (
    <div className="card">
      {title && (
        <div className="card-header">
          <h2 className="card-title">{title}</h2>
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

export default Card;