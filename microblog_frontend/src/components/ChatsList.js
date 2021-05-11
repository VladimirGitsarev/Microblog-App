import React, { Component} from 'react';
import ChatItem from './ChatItem'
import PropTypes from 'prop-types'
import CommentItem from '../components/CommentItem'

class ChatsList extends Component{
    constructor(props) {
      super(props);
      this.state = {
          chats: this.props.chats
      };
    }

    render(){
        return(
            <div className="p-0 d-flex flex-column border rounded chat-list">
                { this.state.chats ? this.state.chats.map( (chat) => {
                    return <ChatItem account={this.props.account} chat={chat} key={chat.id} clickChat={this.props.clickChat}/>
                }) : null}
            </div>
        )
    }
}

export default ChatsList