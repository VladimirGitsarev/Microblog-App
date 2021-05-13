import React, { Component} from 'react';
import PostItem from './PostItem'
import PropTypes from 'prop-types'
import UserItem from '../components/UserItem'
import UserFullItem from "./UserFullItem";

class UsersList extends Component{
    constructor(props) {
      super(props);
      this.state = {
  
      };
    }

    render(){
        return(
            <div>
                { this.props.users.map( (user) => {
                    return this.props.full ? <UserFullItem currentUser={this.props.user} user={user} key={user.id}/> : <UserItem getUser={this.props.getUser} user={user} key={user.id}/>
                })}
            </div>
        )    
    }   
}

export default UsersList