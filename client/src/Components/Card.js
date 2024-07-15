import React from 'react';

const Card = ({ title, children }) => {
    return (
        <div className="card shadow">
            {title && (
                <div className="card-header">
                    <h2 className="card-title">{title}</h2>
                </div>
            )}
            <div className="card-body bg-light-opaque">
                {children}
            </div>
        </div>
    );
};

export default Card;