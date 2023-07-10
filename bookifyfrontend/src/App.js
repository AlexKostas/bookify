import React from 'react';
import { Switch, Route } from 'react-router-dom';
import CustomAppBar from './components/CustomAppBar';
import Login from './components/auth/Login';
import Registration from './components/auth/Registration';
import Home from './components/Home';

const App = () => {
    return (
        <div>
            <CustomAppBar />
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Registration} />
            </Switch>
        </div>
    );
};

export default App;
