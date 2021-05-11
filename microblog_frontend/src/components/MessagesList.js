import React, { Component} from 'react';
import ChatItem from './ChatItem'
import PropTypes from 'prop-types'
import CommentItem from '../components/CommentItem'
import MessageItem from "./MessageItem";

class MessagesList extends Component{
    constructor(props) {
      super(props);
    }

    render(){
        return(
            <div className="d-flex flex-column">
                { this.props.messages ? this.props.messages.map( (message) => {
                    return <MessageItem account={this.props.account} message={message} key={message.created_at}/>
                }) : null}
            </div>
        )
    }
}

export default MessagesList