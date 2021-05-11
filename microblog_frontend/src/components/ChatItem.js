import React, {Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {NavLink} from 'react-router-dom'

class ChatItem extends Component {
    constructor(props) {
        super(props);
        this.state = {chat: props.chat};
        this.account = props.account;
    }

    render(){
        let participant = this.account.id === this.props.chat.participants[1].id ?
            this.props.chat.participants[0] : this.props.chat.participants[1]
        return(
            <div>
                 <div className="chat-user d-flex p-3" id={this.props.chat.id} onClick={this.props.clickChat}>
                    <img className="rounded-circle" src={participant.avatar} height="50" width="50"/>
                    <div className="ml-2">
                        <p className="m-0"><b>{participant.first_name} {participant.last_name}</b></p>
                        <NavLink onClick={this.linkClick} style={{color:'#5b7083'}}  to={"/user/"+participant.username}><p className="m-0">@{participant.username}</p></NavLink>
                    </div>
                </div>
                <hr className="mt-0 mb-0"/>
            </div>
        )
    }
}

export default ChatItem