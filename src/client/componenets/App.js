import React, { Component } from 'react';
import { BrowserRouter,Switch,Route } from 'react-router-dom';

import './App.css';
import SoldierList from './soldier-list';
import updateSodiler from './modify-soldier';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/create" exact component={updateSodiler('create')}/>
          <Route path="/edit" exact component={updateSodiler('edit')}/>
          <Route component={SoldierList} />
        </Switch>
      </BrowserRouter>
    );
  }
};

export default App;