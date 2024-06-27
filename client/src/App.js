import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Navbar from './Components/Navbar';
import routes from './routes/routes';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
const userName = "Craig";
export class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <Navbar />
                    <h1 className="welcome-message">Hello, {userName}!</h1>
                    <Routes>
                        {routes.map((route) => (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={<route.component userName={route.userName} />}
                            />
                        ))}
                    </Routes>
                </div>
            </Router>
        );
    }
}

export default App;
