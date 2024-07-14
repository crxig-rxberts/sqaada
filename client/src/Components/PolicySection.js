import React from 'react';

const PolicySection = ({ title, content }) => (
    <>
        <h2 className="h4 mb-4 mt-5">{title}</h2>
        {typeof content === 'string' ? (
            <p>{content}</p>
        ) : (
            content
        )}
    </>
);

export default PolicySection;