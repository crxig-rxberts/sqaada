import React from 'react'
import {Link} from 'react-router-dom';

export default function Navbar() {
	const userName = "Craig";
    return (
        <div className="navigation">
					<nav className="navbar navbar-expand-lg navbar-light bg-light">
					<h1 className="welcome-message">Hello, {userName}!</h1>
						<div className="container">
							<Link to="/" className="navbar-brand" >Home</Link>
							<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
								<span className="navbar-toggler-icon"></span>
							</button>
							<div className="collapse navbar-collapse" id="navbarNav">
								<ul className="ml-auto navbar-nav">
									<li className="nav-item">
										<Link to="/newTODO" className="nav-link" >New TODO</Link>
									</li>
								</ul>
							</div>
						</div>
					</nav>
        </div>
    )
}
