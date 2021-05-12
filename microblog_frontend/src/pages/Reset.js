import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import ReactDOM from 'react-dom'
import React, { Component} from 'react';
import axiosInstance from '../axios';
import Loader from "../Loader";

class Reset extends Component {
    state = {
        username: '',
        message: '',
        error: '',
        loading: false
    };

    componentDidMount() {
        if (this.props.match.params.token){
            this.setState({loading: true})
            axiosInstance.get(`auth/reset-password/` + this.props.match.params.token)
                .then(res => {
                    this.setState({message: res.data.details, loading: false})
                })
        }
    }

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

    handle_submit = (e, data) => {
    e.preventDefault();
    this.setState({loading: true})
    axiosInstance
			.post(`auth/reset-password/`, {
				username: data.username,
			})
            .then(res => {
                this.setState({message: res.data.details, loading: false})
            })
            .catch(err => {
                if (err.response.status === 400) {
                  this.setState({
                      loading: false,
                      error: "No active accounts with this username!",
                  })
                }
              })
    }

    render() {

        let userSearch = <div>
            <div className="row justify-content-center mt-3">
              <h5>Enter your username to reset the password</h5>
            </div>
            <div className="row justify-content-center mt-3">
                <form className="col-8 col-lg-4 col-md-6 col-sm-8" onSubmit={e => this.handle_submit(e, this.state)}>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Username</label>
                        <input onChange={this.handle_change} type="text" className="form-control" id="username" name="username" aria-describedby="usernameHelp" placeholder="Enter username" />
                    </div>
                    <button type="submit" className="def-btn btn-normal btn-block">Reset</button>
                </form>
            </div>
            <div className="row justify-content-center mt-5">
                {this.state.message ? <div className="d-flex flex-column justify-content-center align-items-center"><h5>{this.state.message.charAt(0).toUpperCase() + this.state.message.slice(1)}</h5> <h6>Check your email and follow the instructions described in it</h6></div> : null}
                {this.state.loading && <div className="reset-loader"></div>}
            </div>
                <div className="row justify-content-center mt-3">
                    {this.state.error && <p style={{ color: '#d53d3dd0'}}><b>{this.state.error}</b></p>}
                </div>
        </div>

        let resetting = <div className="container mt-3  ">
            <div className="row justify-content-center mt-0">
              <h5>{this.state.message.charAt(0).toUpperCase() + this.state.message.slice(1)}</h5>
            </div>
            <div className="row justify-content-center mt-3">
                <form className="col-8 col-lg-4 col-md-6 col-sm-8" onSubmit={e => this.handle_login(e, this.state)}>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Password</label>
                        <input onChange={this.handle_change} type="text" className="form-control" id="password" name="password" aria-describedby="usernameHelp" placeholder="Enter password" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Password Repeat</label>
                        <input onChange={this.handle_change} type="password" className="form-control" id="passwordRepeat" name="passwordRepeat" placeholder="Repeat password" />
                    </div>
                    <button type="submit" className="def-btn btn-normal btn-block">Save</button>
                </form>
            </div>
        </div>
        return (
            <div className="container mt-5">
            <div className="row justify-content-center mt-5">
              <h2>Reset the <strong>password</strong></h2>
            </div>
                {this.state.loading ? <div className="reset-loader"/> : (this.props.match.params.token ? resetting : userSearch) }
        </div>
        )
    }
}


export default Reset;