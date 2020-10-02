import React from 'react';
import Auth from './components/Auth';
import Board from './components/Board';
import Dashboard from './components/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Auth} />
          <ProtectedRoute exact path="/board" component={Board} />
          <ProtectedRoute path="/board/:boardId" component={Dashboard} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
