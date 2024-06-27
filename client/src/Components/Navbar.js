import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<div className="container">
				<Link className="navbar-brand" to="/">ToDo App</Link>
				<div className="navbar-nav">
					<Link className="nav-item nav-link" to="/">Home</Link>
					<Link className="nav-item nav-link" to="/create-list">Create New List</Link>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;