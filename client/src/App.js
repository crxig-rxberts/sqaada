import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Navbar from './Components/Navbar';
import routes from './routes/routes';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <Navbar />
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
