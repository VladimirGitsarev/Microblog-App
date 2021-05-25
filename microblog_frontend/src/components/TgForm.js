import React, {Component} from "react";
import AddComment from "./AddComment";
import axiosInstance from "../axios";
import Loader from "../Loader";

class TgForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            tg_user: null,
            error: ''
        };
        this.getTgUser = this.getTgUser.bind(this);
        this.submitCode = this.submitCode.bind(this);
    }

    componentDidMount() {
        this.getTgUser()
    }

    handleChange = (e) => {
        this.setState({error: ''})
        const name = e.target.name;
        const value = e.target.value;
        this.setState(prevstate => {
            const newState = { ...prevstate };
            newState[name] = value;
            return newState;
        })
    }

    getTgUser(){
        axiosInstance
            .get('http://0.0.0.0:8000/telegram/profile/')
            .then(res => {
                this.setState({
                    tg_user: res.data,
                    loading: false
                })
            })
            .catch(err => {
                this.setState({
                    tg_user: null,
                    loading: false
                })
            })
    }

    submitCode(event){
        event.preventDefault()
        this.setState({loading: true})
        axiosInstance
            .post('http://0.0.0.0:8000/telegram/profile/', {"code": this.state.code})
            .then(res => {
                this.setState({
                    tg_user: res.data,
                    loading: false
                })
            })
            .catch(err => {
                this.setState({
                    error: 'This code is not valid. Enter the code from the Bot.',
                    loading: false
                })
            })
    }

    render(){
        let info = this.state.tg_user && <div>
            <p>Your <b>Microblog</b> account connected to <a href={"https://t.me/" + this.state.tg_user.username}>@{this.state.tg_user.username} </a><b>Telegram</b> account.</p>
        </div>
        let form = <form onSubmit={this.submitCode}>
                    <p>Perform a these easy steps to connect your <b>Microblog</b> account to Telegram account
                        to get all notifications in Telegram!
                    </p>
                    <ol className="pl-3">
                        <li>Go to <a href="https://t.me/micro_blog_bot"><b>Mocroblog Telegram Bot.</b></a></li>
                        <li>Start the bot via <i>/start</i> command.</li>
                        <li>Get the activation code from the Bot.</li>
                        <li>Enter the code you received from the bot below.</li>
                        <li>Confirm the action and enjoy!</li>
                    </ol>
                    <div className="form-group row">
                        <label htmlFor="inputUsername" className="col-sm-2 col-form-label">Code</label>
                        <div className="col-sm-10">
                            <input onChange={this.handleChange} type="text" name="code"
                                   className="form-control" id="inputUsername" placeholder="Code"/>
                            <small className="form-text text-muted">Code you received from the Bot</small>
                            <p><small style={{color: "#D53D3DD0"}}>{this.state.error}</small></p>
                        </div>
                    </div>
                    <div className="form-group row justify-content-end">
                        <div className="col-sm-0 pr-3">
                            <button type="submit" className="def-btn btn-normal">Save</button>
                        </div>
                    </div>
                </form>
        return (
            <div>
                <hr/>
                <h6><span style={{color: "#5b7083"}}>Telegram</span></h6>
                {!this.state.loading ? (!this.state.tg_user ? form : info) : <div className="pb-5"><Loader/></div>}
            </div>
        )
    }
}

export default TgForm
