import React from 'react';
import '../StyleComponents/Home.css';
import { Link } from 'react-router-dom';
export default function Home({ userName }) {
    return (
        <div className="home-page-container">
        <h1 className="welcome-message">Hello, {userName}!</h1>
        <div className="button-container">
        <Link to="/newTODO" className="button">
          Create A New TODO List
        </Link>
        <Link to="/openExistingTODO" className="button">
          Open An Existing TODO List
        </Link>
      </div>
      </div>
    )
}
