import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Navbar from './Components/Navbar';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import routes from './routes/routes';

export class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <Navbar />
                    {routes.map((route) => (
                        <Route
                            key={route.path}
                            path={route.path}
                            exact={route.exact}
                            render={(props) => (
                                <route.component {...props} userName={route.userName} />
                            )}
                        />
                    ))}
                </div>
            </Router>
        );
    }
}

export default App;
