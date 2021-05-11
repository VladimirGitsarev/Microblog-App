import React,  {Component, Fragment} from 'react'
import AddPost from '../components/AddPost'
import PostsList from '../components/PostsList'
import Loader from '../Loader'
import Recommend from '../components/Recommend'
import axiosInstance from '../axios';
import ChatsList from "../components/ChatsList";
import MessagesList from "../components/MessagesList";


class Chat extends Component{
    constructor(props) {
      super(props);
      this.state = {
        loading: true,
        loading_messages: true
      };
      this.getChats = this.getChats.bind(this)
      this.clickChat = this.clickChat.bind(this)
    }

    componentDidMount(){
        this.getChats()
    }

    getChats(){
        axiosInstance.get(`http://localhost:8000/chat/chats/`)
        .then(res => {
            this.setState({
                chats: res.data,
                loading: false
            })
        })

    }

    clickChat(event){
        this.chatSocket = new WebSocket(
            'ws://'
            + "0.0.0.0:8000"
            + '/ws/chat/'
            + event.target.id
            + '/?token='
            + localStorage.getItem('access_token')
        );

        this.chatSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            console.log("MESSAGE: " + data.message)
        }

        axiosInstance.get(`http://localhost:8000/chat/chats/${event.target.id}/messages`)
        .then(res => {
            this.setState({
                messages: res.data,
                loading: false,
                loading_messages: false
            })
            let chatWindow = document.querySelector('#chat-window')
            chatWindow.scrollTop = chatWindow.scrollHeight
        })

    }



    render(){
        return(
                <Fragment>
                    <div className="container"><br/>
                        <div className="row justify-content-center">
                            <div className="ml-0 mb-4 d-none d-xl-block d-lg-block d-md-none col-lg-4">
                                {this.state.loading ? <Loader /> : <ChatsList chats={this.state.chats} clickChat={this.clickChat}/>}
                            </div>
                            <div className="col-md-10 col-lg-8">
                                <div id="chat-window" style={{height: "80vh", overflowY: "auto"}}
                                     className="p-3 d-flex flex-column border rounded">
                                    <div className="fix"/>
                                    {this.state.loading_messages ? <Loader /> : <MessagesList messages={this.state.messages} account={this.props.account}/>}
                                </div><br/>
                                <div className="input-group mb-3">
                                    <input id="chat-message-input" type="text" className="form-control"
                                            placeholder="Your message" aria-label="Your message"
                                            aria-describedby="chat-message-submit" />
                                    <button id="chat-message-submit" className="btn btn-outline-secondary" type="button">Send</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
        )
    }
}

export default Chat;