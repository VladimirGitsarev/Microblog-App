import React, { Component, useState } from 'react';
import {BrowserRouter, Redirect, Router, Route, Switch} from 'react-router-dom'
	
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { createBrowserHistory } from 'history';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage, faChartBar, faSmile} from '@fortawesome/free-solid-svg-icons'
import axiosInstance from 'axios';


class AddPost extends Component{
  constructor(props) {
    super(props);
    this.state = {
      body: '',
      symbols:300
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e){
    e.preventDefault();
    axiosInstance
			.post(`http://localhost:8000/blog/posts/`, {
				user: this.props.account.id,
                body: this.state.body
			})
    .then(response => {
      this.setState({
        body: '',
        symbols: 300
      })
      this.props.getPosts();
    })
  }

  handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevstate => {
      const newState = { ...prevstate };
      newState[name] = value;
      newState['symbols'] = 300 - value.length;
      return newState;
    });
  };

  render(){
    return (
            <div className="pt-3 pb-3 home-container">
              <div className="d-flex justify-content-center flex-wrap">
                <div className="col-auto p-0">
                  <img className="mr-2 rounded-circle" src={this.props.account.avatar} width="75" height="75"/>
                </div>
                <div className="col-10 p-0 home-content">
                <h6 style={{color: '#5b7083'}}>Post something! <span style={{color:"#66b0ff"}}>{this.state.symbols}</span></h6>
                  <form onSubmit={this.handleSubmit}>
                      <textarea className="text-area w-100" rows="5" value={this.state.body} maxLength="300" onChange={this.handleChange} placeholder="What's up?" name="body"></textarea>
                      <div className="d-flex align-items-baseline justify-content-between mt-1">
                        <div className="m-0 p-0">
                          <FontAwesomeIcon className="awesome-icon" icon={faImage} color="#5b7083" size="lg" /> 
                          <FontAwesomeIcon className="awesome-icon" icon={faChartBar} color="#5b7083" size="lg"/>   
                          <FontAwesomeIcon className="awesome-icon" icon={faSmile} color="#5b7083" size="lg"/>                                       
                        </div>
                        <div>
                          <button type='submit' className="def-btn btn-normal">Post</button>
                        </div>
                      </div>
                </form> 
                </div>
              </div>
            </div>
    );
  }
}

export default AddPost;


