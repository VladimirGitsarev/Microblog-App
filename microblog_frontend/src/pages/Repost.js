import React,  {Component, Fragment} from 'react'
import PostsList from '../components/PostsList'
import Loader from '../Loader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage, faReply} from '@fortawesome/free-solid-svg-icons'
import { faEdit} from '@fortawesome/free-regular-svg-icons'
import axiosInstance from '../axios'
import { NavLink } from 'react-router-dom';
import Recommend from '../components/Recommend';

class Repost extends Component{
    constructor(props) {
      super(props);
      this.state = {
        loading_post: true,
        symbols: 300,
        body: ''
      };
      this.handleSubmit = this.handleSubmit.bind(this);

    }

    componentDidMount(){        
        const id = this.props.match.params.id;
        this.getCurrentUser();
        this.getPost(id);
    }

    getCurrentUser(){
        axiosInstance
            .get('http://localhost:8000/api/current_user/')
            .then(res => {
                this.setState({
                    account: res.data
                });
            });
        }

    getPost(id){
        axiosInstance.get(`http://localhost:8000/api/posts/${id}`)
        .then(res => {
            this.setState({
                post: res.data,
                loading_post: false,
            });
        })
    }

    handleSubmit(e){
        e.preventDefault();
        axiosInstance
            .post(`http://localhost:8000/api/posts/repost/${this.state.post.id}`, {
                body: this.state.body
            })
            .then(response => {
            this.props.history.push('/');
            })
      }

    handleChange = e => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState(prevstate => {
          const newState = { ...prevstate };
          newState[name] = value;
          newState['symbols'] = 300 - value.length;
          return newState;
        });
      };

    render(){
        let header = this.state.loading_post ? '' : 
            <span style={{color:"gray", fontSize:"12pt", fontWeight: "normal"}}>
                Publish repost from <NavLink to={"/user/" + this.state.post.user.user.username}> @{this.state.post.user.user.username}</NavLink>
            </span>
        let repost = this.state.loading_post ? <Loader /> :
        <div style={{borderBottom: "1px solid #e6ecf0"}} className="home-container pt-3 pb-3 pr-4 pl-4">
            <div className="d-flex mb-3">
                <img className="rounded-circle" src={this.state.account.img} height="50" width="50"></img>
                <div className="ml-2">
                    <p className="m-0"><b>{this.state.account.user.first_name} {this.state.account.user.last_name}</b></p>
                    <NavLink style={{color:'#5b7083'}}  to={"/user/"+this.state.account.user.username}><p className="m-0">@{this.state.account.user.username}</p></NavLink>
                </div>
            </div>
            <h6 style={{color: 'gray'}}>Add your comment to post! <span style={{color:"#66b0ff"}}>{this.state.symbols}</span></h6>
            <form onSubmit={this.handleSubmit}>
                <textarea onChange={this.handleChange} value={this.state.body} autoFocus="true" className="text-area w-100" rows="3"  maxLength="300"  placeholder="What do you think?" name="body"></textarea>
                <NavLink onClick={this.postClick} style={{textDecoration: "none", color: "inherit"}} to={"/post/" + this.state.post.id}> 
                    <div className="repost pt-2 pb-2 ml-0 mt-3">
                        <p style={{fontSize: '14pt'}} className="mb-1"> 
                            <FontAwesomeIcon style={{ color:"#5b7083"}} name="repost" icon={faReply}/> Repost from&nbsp;
                        </p>
                        <div className="d-flex mb-1">
                            <img className="rounded-circle" src={this.state.post.user.img} height="50" width="50"></img>
                            <div className="ml-2">
                                <p className="m-0"><b>{this.state.post.user.user.first_name} {this.state.post.user.user.last_name}</b></p>
                                <NavLink style={{color:'#5b7083'}}  to={"/user/"+this.state.post.user.user.username}><p className="m-0">@{this.state.post.user.user.username}</p></NavLink>
                            </div>
                        </div>
                        <p style={{fontSize: "14pt"}} className="m-0">{this.state.post.body}</p>
                    </div>
                </NavLink>
                <div className="d-flex align-items-baseline justify-content-end mt-1">
                    {/* <div className="m-0 p-0">
                        <FontAwesomeIcon className="awesome-icon" icon={faImage} color="#007bff" size="lg" />                                   
                    </div> */}
                    <div>
                        <button type='submit' className="def-btn btn-normal">Repost</button>
                    </div>
                </div>
            </form> 
        </div>
        
        let recommend = this.state.loading_post ? '' : <Recommend content={'posts'} user={this.state.post.user.user.id}/>

            
        return(
            <Fragment>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-7">
                        <h5 className="header">Repost
                            <br />
                            {header}
                        </h5>
                        {repost}
                    </div>
                    <div className="ml-0 mb-4 d-none d-xl-block d-lg-block d-md-none col-lg-4">
                        <div className="side-container sticky-top">
                            {recommend}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
        )
    }
}

export default Repost