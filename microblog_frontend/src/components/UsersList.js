import React, { Component} from 'react';
import PostItem from './PostItem'
import PropTypes from 'prop-types'
import UserItem from '../components/UserItem'

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
                    return <UserItem getUser={this.props.getUser} user={user} key={user.user.id}/>
                })}
            </div>
        )    
    }   
}

export default UsersList