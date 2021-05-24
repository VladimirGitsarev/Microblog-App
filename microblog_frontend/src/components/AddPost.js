import React, { Component, useState } from 'react';
import {BrowserRouter, Redirect, Router, Route, Switch} from 'react-router-dom'
	
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { createBrowserHistory } from 'history';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faImage, faChartBar, faSmile, faCross, faTimes, faTimesCircle, faPlus} from '@fortawesome/free-solid-svg-icons'
import axiosInstance from 'axios';


class AddPost extends Component{
  constructor(props) {
    super(props);
    this.state = {
      body: '',
      symbols:300,
      placeholder: "What's up?",
      vote: false,
      options: ["", ""]
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleImage = this.handleImage.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
    this.clickVote = this.clickVote.bind(this);
    this.addOption = this.addOption.bind(this);
    this.optionChanged = this.optionChanged.bind(this);
  }

  handleSubmit(e){
    e.preventDefault();
    let formData = new FormData();
    formData.append("user", this.props.account.id);
    formData.append("body", this.state.body);
    if (this.state.vote)
      formData.append("options", this.state.options)
    if (this.state.images)
      this.state.images.forEach(image => {
        formData.append("images", image)
      })
    axiosInstance
        .post(`http://localhost:8000/blog/posts/`, formData, {headers:{'Content-Type': 'multipart/form-data'}})
        .then(response => {
          this.setState({
            body: '',
            symbols: 300,
            images: [],
            vote: !this.state.vote ? this.state.vote : this.state.vote,
            options: ["", ""],
            placeholder: this.state.vote ? "What's up?" : "Ask a question..."
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

  handleImage(event){
    let imagesArray = Array.from(event.target.files)
    this.setState({images: imagesArray})
  }

  deleteImage(event){
    let imageId = event.target.id === '' ? event.target.parentElement.id : event.target.id
    let images = this.state.images
    images.splice(imageId, 1)
    this.setState({images: images})
  }

  clickVote(event){
    this.setState({
      vote: !this.state.vote,
      options: ["", ""],
      placeholder: this.state.vote ? "What's up?" : "Ask a question..."
    })
  }

  addOption(event){
    let options = this.state.options;
    options.push("")
    this.setState({options: options})
    console.log(this.state)
  }

  optionChanged(event){
    let id = event.target.id
    const value = event.target.value;
    this.setState(prevstate => {
      const newState = { ...prevstate };
      newState["options"][id] = value.trim();
      return newState;
    })
  }

  render(){
    let images = this.state.images ? <div className="d-flex flex-row align-content-center mt-1 mb-1">{this.state.images.map( (image, index) => {
      return <div className="thumbnail">
              <FontAwesomeIcon id={index} className="delete-icon" icon={faTimesCircle} onClick={this.deleteImage}/>
              <img src={URL.createObjectURL(image)} style={{borderRadius: "1.5rem"}}/>
        </div>
    })}</div> : null
    let vote = <div className="mt-2 mb-2 vote-box">
      <div>{this.state.options.map((option, index) => {
      return <div className="form-group mb-2">
        <input id={index} className="form-control" type="text" value={option} onChange={this.optionChanged}/>
        <small className="form-text text-muted m-0 ml-3 ">Option {index+1}</small>
      </div>
    })}
        <div className="d-flex justify-content-center">
          <div className="m-0 def-btn btn-normal" onClick={this.addOption}>
            <FontAwesomeIcon icon={faPlus}/>
          </div>
        </div>
      </div>

    </div>
    return (
            <div className="pt-3 pb-3 home-container">
              <div className="d-flex justify-content-center flex-wrap">
                <div className="col-auto p-0">
                  <img style={{objectFit: "cover"}} className="mr-2 rounded-circle" src={this.props.account.avatar} width="75" height="75"/>
                </div>
                <div className="col-10 p-0 home-content">
                <h6 style={{color: '#5b7083'}}>Post something! <span style={{color:"#66b0ff"}}>{this.state.symbols}</span></h6>
                  <form onSubmit={this.handleSubmit}>
                      <textarea className="text-area w-100" rows="5" value={this.state.body} maxLength="300" onChange={this.handleChange} placeholder={this.state.placeholder} name="body"/>
                      {this.state.vote && vote}
                      {images}
                      <div className="d-flex align-items-baseline justify-content-between mt-1">
                        <div className="m-0 p-0">
                          <label><input type="file" hidden multiple onChange={this.handleImage}/><FontAwesomeIcon className="awesome-icon" icon={faImage} color="#5b7083" size="lg"/></label>
                          <FontAwesomeIcon className="awesome-icon" icon={faChartBar} color="#5b7083" size="lg" onClick={this.clickVote}/>
                          {/*<FontAwesomeIcon className="awesome-icon" icon={faSmile} color="#5b7083" size="lg"/>                                       */}
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


