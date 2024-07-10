import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
	return (
		<nav className="navbar navbar-expand-lg bg-dark navbar-dark bg-opacity-75 shadow-sm">
			<div className="container">
				<Link className="navbar-brand fw-bold" to="/">ToDo App</Link>
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav ms-auto">
						<li className="nav-item">
							<Link className="nav-link" to="/">Home</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to="/create-list">Create New List</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to="/privacyandpolicies">Privacy Policy</Link>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;