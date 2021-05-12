import React, {Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {NavLink} from 'react-router-dom'

class MessageItem extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.account = props.account;
        this.message = props.message;
    }

    formatDate(date){
        let newDate = new Date(date)
        let minutes = newDate.getMinutes().toString().length === 1 ? '0' + newDate.getMinutes().toString() : newDate.getMinutes().toString();
        let stringDate = newDate.getHours() + ":" + minutes
        return stringDate
    }

    render(){
        let messageBox = ''
        if (this.account.id === this.message.sender.id){
            messageBox = <div className="align-self-end chat-box-container">
                <div className="chat-box-self"><strong style={{textAlign: "end"}}>{this.message.sender.username}</strong>
                    <div style={{wordWrap: "break-word", maxWidth: "100%"}}>{this.message.message}</div>
                    <div style={{textAlign: "end", fontSize: '8pt', color: 'gray'}}>{this.formatDate(this.message.created_at)}</div>

                </div>
                <div style={{marginLeft: "5px"}} className="mt-auto">
                    <img style={{objectFit: "cover"}} style={{borderRadius: "15px"}} width="25" height="25" src={this.message.sender.avatar}/>
                </div>
            </div>
        }
        else messageBox = <div className="chat-box-container">
            <div style={{marginRight: "5px"}} className="mt-auto">
                <img style={{borderRadius: "15px", objectFit: "cover"}} width="25" height="25" src={this.message.sender.avatar}/>
            </div>
            <div className="chat-box"><strong>{this.message.sender.username}</strong>
                <div style={{wordWrap: "break-word", maxWidth: "100%"}}>{this.message.message}</div>
                <div style={{textAlign: "start", fontSize: '8pt', color: 'gray'}}>{this.formatDate(this.message.created_at)}</div>
            </div>
        </div>
        return(
            messageBox
        )
    }
}

export default MessageItem