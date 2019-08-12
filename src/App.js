import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './components/Header';
import Login from './pages/Login';
import Main from './pages/Main';

export default function App() {
  return (
    <div id="container">
      <Router>
        <Header />
        <Route path="/" exact component={Main} />
        <Route path="/login" component={Login} />
      </Router>
    </div>
  );
}
