import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import NavBar from './components/navbar/navbar'
import Home from './components/home'
import Chapter from './components/manga/chapter'
import Login from './components/auth/login'
import Signup from './components/auth/signup'
import User from './components/user'

class App extends Component {
  render () {
    return (
      <BrowserRouter>
        <div className="App">
          <NavBar />
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/m/:chapter' component={Chapter} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/signup' component={Signup} />
            <Route exact path='/u/:username' component={User} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
