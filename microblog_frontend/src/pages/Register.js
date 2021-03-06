import {NavLink, useHistory} from 'react-router-dom';
import { useState } from 'react';
import React, {Component, Fragment} from 'react'
import axiosInstance from '../axios';

class Register extends Component{
    constructor(props) {
      super(props);

      this.state = {
          error: '',
          activating: false,
          activated: false,
      };
    }

    componentDidMount() {
        if (this.props.match.params.token){
            this.setState({activating: true})
            axiosInstance
                .get(`http://localhost:8000/auth/register/` + this.props.match.params.token)
                .then(res => {
                    this.setState({activated: true, activating: false})
                })
        }
    }

    handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState(prevstate => {
        const newState = { ...prevstate };
        newState[name] = value.trim();
        this.setState({
            error: ""
        })
        return newState;
        })   
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({activating: true})
        axiosInstance
			.post(`http://localhost:8000/auth/register/`, {
				username: this.state.username,
                password: this.state.password,
                email: this.state.email,
                first_name: this.state.firstname,
                last_name: this.state.lastname
			})
            .then((res) => {
                this.setState({activating: false, messageSent: true})
            })
            .catch(err =>{
                this.setState({
                    error: "Invalid data! Check all the fields.",
                    activating: false
                })
            })   
    }     

    render(){

        let userForm = !this.state.activated ? <div className="row justify-content-center">
                    <form className="col-8 col-lg-4 col-md-6 col-sm-8 mb-3">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input onChange={this.handleChange} type="text" className="form-control" id="username" name="username" aria-describedby="usernameHelp" placeholder="Enter username" />
                            <small id="usernameHelp" className="form-text text-muted">Create your unique username</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input onChange={this.handleChange} type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" placeholder="Enter email" />
                            <small id="emailHelp" className="form-text text-muted">Your email</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="firstname">Firstname</label>
                            <input onChange={this.handleChange} type="text" className="form-control" id="firstname" name="firstname" aria-describedby="firstnameHelp" placeholder="Enter firstname" />
                            <small id="firstnameHelp" className="form-text text-muted">Your firstname</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastname">Lastname</label>
                            <input onChange={this.handleChange} type="text" className="form-control" id="lastname" name="lastname" aria-describedby="lastnameHelp" placeholder="Enter lastname" />
                            <small id="lastnameHelp" className="form-text text-muted">Your lastname</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Password</label>
                            <input onChange={this.handleChange} type="password" className="form-control" id="password" name="password" placeholder="Password" />
                        </div>
                        <button onClick={this.handleSubmit} type="submit" className="def-btn btn-normal btn-block">Sign Up</button>
                    </form>
                </div> : <div>
                    <div className="row justify-content-center mt-3"><h5>Your account successfully activated!</h5></div>
                    <div className="row justify-content-center mt-3"><p>Go to <i><NavLink to={"/login"}>Login page</NavLink></i></p> </div>
                </div>
        return (
            <div className="container pt-4 mt-4" style={{backgroundColor:"rgba(255, 255, 255, 0.9)", borderRadius: "1.5rem"}}>
                <div className="row justify-content-center">
                <h2>Welcome to <strong>Microblog!</strong></h2>
                </div>
                <div className="row justify-content-center mt-3">
                    <h3>Sign Up</h3>
                </div>
                {!this.state.messageSent ? (!this.state.activating && userForm) : null }
                {this.state.activating && <div className="reset-loader"/>}
                {this.state.messageSent && <div className="d-flex flex-column justify-content-center align-items-center mt-5"><h5>We've sent the email to <b>{this.state.email}</b></h5> <h6>Check your email and follow the instructions described in it</h6></div>}
                <div className="row justify-content-center">
                    <p style={{ color: '#d53d3dd0'}}><b>{this.state.error}</b></p>
                </div>
            </div>
    )}
}

export default Register;
