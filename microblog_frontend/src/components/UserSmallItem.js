import React, {Component } from 'react'
import {NavLink} from 'react-router-dom'

class UserSmallItem extends Component{
    constructor(props) {
      super(props);
      this.state = {
       
      };
      this.user = props.user;

    }

    render(){
        return(
            <div className="">
                <NavLink style={{textDecoration: "none", color:"inherit"}} to={"/user/"+this.user.user.username}>
                <div className="d-flex m-0 user-small">
                    <img className="rounded-circle" src={this.user.img} height="50" width="50"></img>
                    <div className="ml-2">
                        <p className="m-0"><b>{this.user.user.first_name} {this.user.user.last_name}</b></p>
                        <p className="m-0" style={{color:'#5b7083'}} ><p className="m-0">@{this.user.user.username}</p></p>
                        <p className="m-0" style={{fontSize:'11pt'}}>{this.user.status}</p>
                    </div>
                </div>
                </NavLink>
            </div>
        )
    }
}

export default UserSmallItem