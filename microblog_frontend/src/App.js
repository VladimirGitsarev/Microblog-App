import React, { Component, useState } from 'react';
import {BrowserRouter, Redirect, Router, Route, Switch} from 'react-router-dom'
	
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { createBrowserHistory } from 'history';
import axiosInstance from 'axios';

import Home from './pages/Home'
import Navbar from './components/Navbar'
import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile'
import User from './pages/User'
import Post from './pages/Post'
import EditProfile from './pages/EditProfile';
import Repost from './pages/Repost';
import Search from './pages/Search';
import Chat from "./pages/Chat";

class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      logged_in: localStorage.getItem('access_token') ? true : false,
      user: '',
      account: ''
    };
    this.history = createBrowserHistory();
    this.updateState = this.updateState.bind(this)
  }

  updateState = (logged_in) =>{
    this.setState({
      logged_in: logged_in,
    })
    this.getCurrentUser();
  }

  getCurrentUser(){
    axiosInstance.defaults.headers['Authorization'] =
    'Bearer ' + localStorage.getItem('access_token');
    if (this.state.logged_in){
      axiosInstance
      .get('http://localhost:8000/auth/user/')
      .then(res => {
        this.setState({
          user: res.data,
          account: res.data
        });
      });
    }
    else{
      this.history.push('/login');
    }
  }

  componentDidMount() {
    if (this.state.logged_in)
      this.getCurrentUser();
    else{
      this.history.push('/login');
    }
  }

  handle_logout = () => {
    // axiosInstance.post(`http://localhost:8000/logout/`, { // to do logout
	// 		refresh_token: localStorage.getItem('refresh_token'),
	// 	});
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    axiosInstance.defaults.headers['Authorization'] = null;
    this.setState({ logged_in: false, username: '', user_id: ''});
    this.history.push('/login')
  };

  render(){
    return (
      <Router history={this.history}>
        <Navbar  
          history={this.history}
          logged_in={this.state.logged_in}
          user={this.state.user}
          account={this.state.account}
          handle_logout={this.handle_logout}
        />
        <Switch>
          <Route path={'/'} exact
          render={(props) => <Home {...props}
          account = {this.state.account}
          />}/>
          <Route path={'/user/:name/'} 
            render={(props) => <User {...props} 
              account={this.state.account}
            />}/>
          <Route path={'/post/:id/:comment?'} 
          render={(props) => <Post {...props} 
            account={this.state.account}
          />}/>
          <Route path={'/repost/:id'} component={Repost} /> 
          <Route path={'/register'} component={Register}/>
          <Route path={'/profile/edit'} component={EditProfile}/>
          <Route path={'/profile'} 
            render={(props) => <Profile {...props}
              history={this.history}
              account={this.state.account}
            />}/>
          <Route path={'/search'} component={Search} />
          <Route path={'/login'}  
            render={(props) => <Login {...props} 
              history={this.history}
              updateState={this.updateState} 
              getCurrentUser={this.getCurrentUser}
            />}/>
          <Route path={'/chat'} component={Chat}/>
          <Route path={'/logout'} />
        </Switch>
    </Router>
    );
  }
}

export default App;
