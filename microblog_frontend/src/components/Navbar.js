import React, {Fragment, Component} from 'react'
import {NavLink} from 'react-router-dom'

class Navbar extends Component{
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  handle_change = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevstate => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
    });
  };

  handleSubmit = e =>{
    e.preventDefault();
    this.props.history.push('/search?query=' + this.state.query);
  }

  render(){
    let label;
    let menu;
    if (this.props.logged_in){
      label = <p className="m-0 pr-2 align-baseline"><b>@{this.props.user.username}</b></p>
      menu = <div className="collapse navbar-collapse" id="navbarToggler">
        <ul className="navbar-nav mr-auto mt-2 mt-lg-0" style={{fontSize: '14pt'}}>
          <li className="nav-item">
            <NavLink className="nav-link" to="/" exact><span className="sr-only">(current)</span>Home</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/profile">Profile</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/chat">Chat</NavLink>
          </li>
        </ul>
        {label}
        <form onSubmit={this.handleSubmit} className="form-inline my-2 my-lg-0">
          <input onChange={this.handle_change} name="query" className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
        </form>
        <button className="def-btn btn-normal" onClick={this.props.handle_logout} >Logout</button>
      </div>
    }
    return(
      <div>
      <nav className="navbar navbar-expand-md navbar-light sticky-top" style={{backgroundColor: "rgba(248, 249, 253, 0.95)", borderBottom: "1px solid #e6ecf0"}}>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        {localStorage.getItem('access_token') ? <NavLink className="navbar-brand" to="/"><b style={{color: "rgba(82,123,222,0.8)"}}>Microblog</b></NavLink> : <NavLink className="navbar-brand" to="/login"><b style={{color: "rgba(82,123,222,0.8)"}}>Microblog</b></NavLink>}
        {menu}
      </nav>
      </div>
    );
  }
}

export default Navbar;
