
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import ReactDOM from 'react-dom'
import React, { Component} from 'react';
import axiosInstance from '../axios';

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    error: ''
  };

  handle_change = e => {
    this.setState({error: ''});
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevstate => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
    });
  };

  handle_login = (e, data) => {
    e.preventDefault();
    axiosInstance
			.post(`token-auth/`, {
				username: data.username,
        password: data.password,
			})
      .then(res => {
          localStorage.setItem('access_token', res.data.access);
          localStorage.setItem('refresh_token', res.data.refresh);
          axiosInstance.defaults.headers['Authorization'] =
          'JWT ' + localStorage.getItem('access_token');
          this.props.updateState(true)
          this.props.history.push('/')
      })
      .catch(err => { 
        if (err.response.status === 401) { 
          this.setState({
            error: "Invalid username or password!",
          })
        }
      })

  };

  render() {
    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
              <h2>Welcome to <strong>Microblog!</strong></h2>
            </div>
            <div className="row justify-content-center mt-3">
              <h3>Sign In</h3>
            </div>
            <div className="row justify-content-center">
                <form className="col-8 col-lg-4 col-md-6 col-sm-8" onSubmit={e => this.handle_login(e, this.state)}>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Username</label>
                        <input onChange={this.handle_change} type="text" className="form-control" id="username" name="username" aria-describedby="usernameHelp" placeholder="Enter username" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input onChange={this.handle_change} type="password" className="form-control" id="password" name="password" placeholder="Password" />
                    </div>
                    <button type="submit" className="def-btn btn-normal btn-block">Sign In</button>
                </form>
            </div>
            <div className="row justify-content-center mt-3">
              <p>Please, log in or <i><NavLink to={"/register"}>create an account!</NavLink></i></p>
            </div>
            <div className="row justify-content-center mt-3">
              <p style={{ color: '#d53d3dd0'}}><b>{this.state.error}</b></p>
            </div>
        </div>
    );
  }
}

export default LoginForm;

// LoginForm.propTypes = {
//   handle_login: PropTypes.func.isRequired
// };