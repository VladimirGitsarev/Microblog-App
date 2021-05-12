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
            .get('http://localhost:8000/auth/user/')
            .then(res => {
                this.setState({
                    account: res.data
                });
            });
        }

    getPost(id){
        axiosInstance.get(`http://localhost:8000/blog/posts/${id}`)
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
            .post(`http://localhost:8000/blog/posts/`, {
                body: this.state.body,
                repost: this.state.post.id
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
        let images = null
        if (!this.state.loading_post){
            console.log(this.state.post)
            let imageSize = this.state.post.images.length === 1 ? window.innerWidth * 0.25 : window.innerWidth * 0.125
            images = this.state.post.images ? <div className="d-flex justify-content-center align-content-center align-self-center flex-wrap mt-1 mb-1">{this.state.post.images.map( (image) => {
                    return <img src={image} style={{width: imageSize + "px", height: imageSize + "px", objectFit:"cover", borderRadius: "1.5rem", marginBottom:"0.5rem", marginRight:"0.5rem"}}/>
                })}</div> : null
        }
        let header = this.state.loading_post ? '' :
            <span style={{color:"gray", fontSize:"12pt", fontWeight: "normal"}}>
                Publish repost from <NavLink to={"/user/" + this.state.post.user.username}> @{this.state.post.user.username}</NavLink>
            </span>
        let repost = this.state.loading_post ? <Loader /> :
        <div style={{borderBottom: "1px solid #e6ecf0"}} className="home-container pt-3 pb-3 pr-4 pl-4">
            <div className="d-flex mb-3">
                <img style={{objectFit: "cover"}} className="rounded-circle" src={this.state.account.avatar} height="50" width="50"></img>
                <div className="ml-2">
                    <p className="m-0"><b>{this.state.account.first_name} {this.state.account.last_name}</b></p>
                    <NavLink style={{color:'#5b7083'}}  to={"/user/"+this.state.account.username}><p className="m-0">@{this.state.account.username}</p></NavLink>
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
                            <img style={{objectFit: "cover"}} className="rounded-circle" src={this.state.post.user.avatar} height="50" width="50"></img>
                            <div className="ml-2">
                                <p className="m-0"><b>{this.state.post.user.first_name} {this.state.post.user.last_name}</b></p>
                                <NavLink style={{color:'#5b7083'}}  to={"/user/"+this.state.post.user.username}><p className="m-0">@{this.state.post.user.username}</p></NavLink>
                            </div>
                        </div>
                        <p style={{fontSize: "14pt"}} className="m-0">{this.state.post.body}</p>
                        {images}
                    </div>
                </NavLink>
                <div className="d-flex align-items-baseline justify-content-end mt-1">
                    <div>
                        <button type='submit' className="def-btn btn-normal">Repost</button>
                    </div>
                </div>
            </form> 
        </div>

        let recommend = this.state.loading_post ? '' : <Recommend content={'posts'} user={this.state.post.user.id}/>

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