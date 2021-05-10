import React, {Component } from 'react'
import {NavLink} from 'react-router-dom'

class UserItem extends Component{
    constructor(props) {
      super(props);
      this.state = {
       
      };
      this.user = props.user;
      this.linkClick = this.linkClick.bind(this)

    }

    linkClick = (e) => {
        // e.preventDefault();
        // this.props.getUser(this.user.user.username);
        window.location.href = "/user/" + this.user.username;
    }

    render(){
        return(
            <div className="">
                <div className="recommend-user d-flex mb-1 p-1">
                    <img className="rounded-circle" src={this.user.avatar} height="50" width="50"></img>
                    <div className="ml-2">
                        <p className="m-0"><b>{this.user.first_name} {this.user.last_name}</b></p>
                        <NavLink onClick={this.linkClick} style={{color:'#5b7083'}}  to={"/user/"+this.user.username}><p className="m-0">@{this.user.username}</p></NavLink>
                        <p className="m-0" style={{fontSize:'11pt'}}>{this.user.status}</p>
                    </div>
                </div>
                <hr className="mt-2 mb-2"/>

            </div>
        )
    }
}

export default UserItem