import React, {Component } from 'react'
import {NavLink} from 'react-router-dom'
import axiosInstance from "../axios";

class UserFullItem extends Component{
    constructor(props) {
      super(props);
      this.state = {
          followers: this.props.user.followers
      };
      this.user = props.user;
      this.linkClick = this.linkClick.bind(this)
      this.unfollow = this.unfollow.bind(this)
    }

    linkClick = (e) => {
        window.location.href = "/user/" + this.user.username;
    }

    unfollow(event){
        axiosInstance
            .post(`http://0.0.0.0:8000/auth/users/${event.target.id}/follow/`)
            .then(res => {
                let followers = this.state.followers;
                if (followers.includes(this.props.currentUser.id))
                    followers.splice(followers.indexOf(this.props.currentUser.id), 1);
                else
                    followers.push(this.props.currentUser.id)
                this.setState({
                    followers: followers
                })
            })
        console.log(event.target.id)
    }

    render(){
        return(
            <div style={{cursor: "pointer"}}>
                <div className="d-flex p-3 followings-user justify-content-between">
                    <img style={{objectFit: "cover"}} className="rounded-circle mr-2" src={this.user.avatar} height="50" width="50"></img>
                    <div className="ml-2 flex-grow-1">
                        <p className="m-0"><b>{this.user.first_name} {this.user.last_name}</b></p>
                        <NavLink onClick={this.linkClick} style={{color:'#5b7083'}}  to={"/user/"+this.user.username}><p className="m-0">@{this.user.username}</p></NavLink>
                        <p className="m-0" style={{fontSize:'11pt'}}>{this.user.status}</p>
                    </div>
                    {
                        this.state.followers && <div className="d-flex align-items-center justify-content-end">
                            {
                                this.state.followers.includes(this.props.currentUser.id) ?
                                <div id={this.user.id} className="def-btn btn-normal" onClick={this.unfollow}>Unfollow</div> :
                                <div id={this.user.id} className="def-btn btn-outline" onClick={this.unfollow}>Follow</div>
                            }
                        </div>
                    }
                </div>
                <hr className="mt-0 mb-0"/>

            </div>
        )
    }
}

export default UserFullItem