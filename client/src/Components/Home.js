import React from 'react';
import '../StyleComponents/Home.css';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="home-page-container">
        <div className="button-container">
        <Link to="/newTODO" className="button">
          Create A New TODO List
        </Link>
        <Link to="/existingTODOList" className="button">
          Open An Existing TODO List
        </Link>
      </div>
      </div>
    )
}
