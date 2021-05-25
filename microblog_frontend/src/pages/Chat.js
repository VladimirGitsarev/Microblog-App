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
        loading_messages: false,
      };
      this.getChats = this.getChats.bind(this)
      this.clickChat = this.clickChat.bind(this)
      this.handleMessage = this.handleMessage.bind(this)
        this.chatSocket = null
    }

    componentDidMount(){
        this.getCurrentUser()
        document.querySelector('#chat-message-input').focus();
        document.querySelector('#chat-message-input').onkeyup = function(e) {
            if (e.keyCode === 13) {  // enter, return
                document.querySelector('#chat-message-submit').click();
            }
        };
        this.getChats()
    }

    getCurrentUser(){
        axiosInstance
            .get('http://localhost:8000/auth/user/')
            .then(res => {
                this.setState({
                account: res.data
                });
            });
        }

    checkExistChat(){
        let existChatId = null
        if (this.props.location.state != null) {
                this.state.chats.forEach(chat => {
                    if ([chat.participants[0].id, chat.participants[1].id].includes(this.props.location.state.chatWith.id))
                        existChatId = chat.id
                })

                if (existChatId){
                    this.connectChat(existChatId)
                }
                else {
                    this.setState({loading:true})
                    axiosInstance
                        .post(`http://localhost:8000/chat/chats/`, {participants: this.props.location.state.chatWith.id})
                        .then(res => {
                            let chatId = res.data.id
                            axiosInstance.get(`http://localhost:8000/chat/chats/`)
                                .then(res => {
                                    this.setState({
                                        chats: res.data,
                                        loading: false
                                    })
                                    this.connectChat(chatId)
                                })
                        })
                }
        }
    }

    getChats(){
        axiosInstance.get(`http://localhost:8000/chat/chats/`)
            .then(res => {
                this.setState({
                    chats: res.data,
                    loading: false
                })
                this.checkExistChat()
            })
    }

    clickChat(event){
        this.connectChat(event.target.id)
    }

    connectChat(chatId){
        if (this.chatSocket != null)
            this.chatSocket.close()

        this.chatSocket = new WebSocket(
            'ws://'
            + "0.0.0.0:8000"
            + '/ws/chat/'
            + chatId
            + '/?token='
            + localStorage.getItem('access_token')
        );

        axiosInstance.get(`http://localhost:8000/chat/chats/${chatId}/messages`)
        .then(res => {
            this.setState({
                messages: res.data,
                loading: false,
                loading_messages: false
            })
            let chatWindow = document.querySelector('#chat-window')
            chatWindow.scrollTop = chatWindow.scrollHeight
        })

        this.chatSocket.onmessage = e => {
            const data = JSON.parse(e.data);
            this.handleMessage(data)
        }

        document.querySelector('#chat-message-submit').onclick = e => {
            const messageInputDom = document.querySelector('#chat-message-input');
            const message = messageInputDom.value;
            if (this.chatSocket != null){
                this.chatSocket.send(JSON.stringify({
                'message': message
            }));
            }
            messageInputDom.value = '';
        };
    }

    handleMessage(data){
        this.setState({
          messages: [...this.state.messages, data]
        })
        let chatWindow = document.querySelector('#chat-window')
        chatWindow.scrollTop = chatWindow.scrollHeight
    }


    render(){
        return(
                <Fragment>
                    <div className="container"><br/>
                        <div className="row justify-content-center">
                            <div className="ml-0 mb-4 col-md-4 col-lg-4">
                                {this.state.loading ? <Loader /> : <ChatsList chats={this.state.chats} account={this.state.account} clickChat={this.clickChat}/>}
                            </div>
                            <div className="col-md-8 col-lg-8" >
                                <div id="chat-window" style={{height: "80vh", overflowY: "auto", backgroundColor:"rgba(255, 255, 255, 0.9)"}}
                                     className="p-3 d-flex flex-column border rounded">

                                    {
                                        this.chatSocket == null ?
                                        <div style={{marginTop: '50%', color: "lightgray", fontSize: "14pt"}} className="align-self-center">Select chat to start messaging</div> :
                                        <div className="fix"/>
                                    }

                                    {this.state.loading_messages ? <Loader /> : <MessagesList messages={this.state.messages} account={this.state.account}/>}
                                </div><br/>
                                <div className={this.chatSocket == null ? "invisible" : "input-group mb-3 visible"}>
                                    <input id="chat-message-input" type="text" className="form-control"
                                            placeholder="Your message" aria-label="Your message"
                                            aria-describedby="chat-message-submit" />
                                    <button style={{borderRadius: 0, borderTopRightRadius: "1.5rem", borderBottomRightRadius: "1.5rem"}}
                                            id="chat-message-submit" className="def-btn btn-normal" type="button">Send</button>
                                </div>

                            </div>
                        </div>
                    </div>
                </Fragment>
        )
    }
}

export default Chat;