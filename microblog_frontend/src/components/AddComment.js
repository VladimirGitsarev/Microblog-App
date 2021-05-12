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


class AddComment extends Component{
  constructor(props) {
    super(props);
    this.state = {
      symbols: 300,
      body: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleSubmit(e){
    e.preventDefault();
    axiosInstance
			.post(`http://localhost:8000/blog/posts/${this.props.post.id}/comments/`, {
        body: this.state.body
			})
    .then(response => {
      this.setState({
        body: '',
        symbols: 300
      })
      this.props.getComments(this.props.post.id);
    })
  }

  render(){
      return(
        <div style={{borderTop: "1px solid #e6ecf0"}} className="pt-3 pb-3 pr-4 pl-4 home-container">
          <h6 style={{color: 'gray'}}>Leave a comment! <span style={{color:"#66b0ff"}}>{this.state.symbols}</span></h6>
            <form onSubmit={this.handleSubmit}>
                <textarea autoFocus="true" className="text-area w-100" rows="3" value={this.state.body} maxLength="300" onChange={this.handleChange}  placeholder="What do you think?" name="body"></textarea>
                <div className="d-flex align-items-baseline justify-content-between mt-1">
                  <div className="m-0 p-0">
                    {/*<FontAwesomeIcon className="awesome-icon" icon={faImage} color="#5b7083" size="lg" />*/}
                  </div>
                  <div>
                    <button type='submit' className="def-btn btn-normal">Comment</button>
                  </div>
                </div>
          </form> 

      </div>
      )
  }
}

export default AddComment
