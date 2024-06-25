import React from 'react'
import {Link} from 'react-router-dom';

export default function Navbar() {
    return (
        <div className="navigation">
					<nav className="navbar navbar-expand-lg navbar-light bg-light">
						<div className="container">
							<Link to="/home" className="navbar-brand" >Home</Link>
							<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
								<span className="navbar-toggler-icon"></span>
							</button>
							<div className="collapse navbar-collapse" id="navbarNav">
								<ul className="ml-auto navbar-nav">
									<li className="nav-item">
										<Link to="/newTODO" className="nav-link" >New TODO</Link>
									</li>
									<li className="nav-item">
										<Link to="/existingTODOList" className="nav-link" >Existing TODO List</Link>
									</li>
								</ul>
							</div>
						</div>
					</nav>
        </div>
    )
}
