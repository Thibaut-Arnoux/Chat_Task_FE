import React from 'react';
import Auth from './components/Auth';
import Board from './components/Board';
import Dashboard from './components/Dashboard'
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    // <div className="App">
      <BrowserRouter>
        <Route exact path="/" component={Auth} />
        <Route path="/board" component={Board} />
        <Route path="/dashboard/:boardId" component={Dashboard} />
      
      </BrowserRouter>
    // </div>
  );
}

export default App;
