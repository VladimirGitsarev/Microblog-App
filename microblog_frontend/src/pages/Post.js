import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import ReactDOM from 'react-dom'
import React, { Component, Fragment } from 'react';
import axiosInstance from '../axios';
import Loader from '../Loader'
import CommentsList from '../components/CommentsList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment as commentReg, faThumbsDown as dislikeReg, faThumbsUp as likeReg} from '@fortawesome/free-regular-svg-icons'
import { faReply, faComment as commentSol, faThumbsDown as dislikeSol, faThumbsUp as likeSol, faCross, faTimes} from '@fortawesome/free-solid-svg-icons';
import AddComment from '../components/AddComment'
import Modal from '../components/Modal';
import Recommend from '../components/Recommend';

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post: '',
            comments: '',
            loading_post: true,
            loading_comments: true,
            commenting: false,
            liked: '',
            disliked: '',
            modal: false
        };
        this.commentClick = this.commentClick.bind(this)
        this.getComments = this.getComments.bind(this)
        this.btnClick = this.btnClick.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
        this.deletePost = this.deletePost.bind(this)
        this.showPost = this.showPost.bind(this)
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
                liked: '',
                disliked: '',
                post: res.data,
                likes: res.data.likes.length,
                dislikes: res.data.dislikes.length,
                loading_post: false,
            });
            this.getComments(id);
            this.state.post.likes.forEach(like => {
                if (like == this.state.account.id){
                    this.setState({liked: true})
                }
            })
            this.state.post.dislikes.forEach(dislike => {
                if (dislike == this.state.account.id){
                    this.setState({disliked: true})
                }
            })
        })
    }

    getComments(id){
        axiosInstance.get(`http://localhost:8000/blog/posts/${id}/comments/`)
        .then(res => {
            this.setState({
                comments: res.data,
                loading_comments: false,
                commenting: false
            });
            const comment = this.props.match.params.comment;
            if (comment){
                this.setState({
                    commenting: true,
                })
            }
                
        })
    }

    btnClick = e => {
        e.preventDefault();
        let element = e.target.getAttribute('name');

        switch(element){
            case 'like':
                axiosInstance.post(`http://localhost:8000/blog/posts/${this.state.post.id}/like/`, {
                    liked: this.state.liked
                })
                .then(response => this.setState({
                    liked: !this.state.liked,
                    likes: response.data.likes.length,
                    dislikes: response.data.dislikes.length,
                    disliked: false,
                    loading_post: false,
                    loading_comments: false
                }))  
                break;
            case 'dislike':
                axiosInstance.post(`http://localhost:8000/blog/posts/${this.state.post.id}/dislike/`, {
                    disliked: this.state.disliked
                })
                .then(response => this.setState({
                    disliked: !this.state.disliked,
                    likes: response.data.likes.length,
                    dislikes: response.data.dislikes.length,
                    liked: false,
                    loading_post: false,
                    loading_comments: false
                }))
                break;
        }
    }

    deletePost(){
        axiosInstance.delete(`http://localhost:8000/blog/posts/${this.state.post.id}`)
        .then(res => {
            this.props.history.push('/');
        })
    }

    formatDate(str){
        let date = new Date(str);
        return date.getHours() + ':' + (date.getMinutes().toString().length == 1 ? '0' + date.getMinutes() : date.getMinutes()) + ' · ' +
               date.getFullYear()+ '-' + (date.getMonth()+1) + '-' + date.getDate();   
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    
    commentClick(){
        this.setState({commenting: !this.state.commenting});
    }

    postClick = e =>{
        window.location.href = "/post/" + this.state.post.repost.id;
    }

    toggleModal(){
        this.setState({
            modal: !this.state.modal
        })
    }

    showPost(id){
        this.getPost(id);
    }

    render(){
        let images = this.state.post.images ? <div className="d-flex align-content-center align-self-center flex-wrap mt-2 mb-2">{this.state.post.images.map( (image) => {
                    return <img className="img-fluid" src={image} style={{maxWidth:"100%", height: "auto", objectFit:"cover", borderRadius: "1.5rem", marginBottom:"0.5rem", marginRight:"0.5rem"}}/>
                })}</div> : null

        let repost = ''
        if (this.state.post.repost){
            let repostImages = this.state.post.repost.images ? <div className="d-flex align-content-center flex-wrap mt-1 mb-1">{this.state.post.repost.images.map( (image) => {
                    return <img src={image} style={{width: "95px", height: "95px", objectFit:"cover", borderRadius: "1.5rem", marginBottom:"0.5rem", marginRight:"0.5rem"}}/>
                })}</div> : null
            repost = 
            <NavLink onClick={this.postClick} style={{textDecoration: "none", color: "inherit"}} to={"/post/" + this.state.post.repost.id}> 
                <div className="repost pt-2 pb-2">
                <p style={{fontSize: '14pt'}} className="mb-1"> 
                    <FontAwesomeIcon style={{ color:"#5b7083"}} name="repost" icon={faReply}/> Repost from&nbsp;
                </p>
                    <div className="d-flex mb-1">
                        <img style={{objectFit: "cover"}} className="rounded-circle" src={this.state.post.repost.user.avatar} height="50" width="50"></img>
                        <div className="ml-2">
                            <p className="m-0"><b>{this.state.post.repost.user.first_name} {this.state.post.repost.user.last_name}</b></p>
                            <NavLink style={{color:'#5b7083'}}  to={"/user/"+this.state.post.repost.user.username}><p className="m-0">@{this.state.post.repost.user.username}</p></NavLink>
                        </div>
                    </div>
                    <p style={{fontSize: "14pt"}} className="m-0">{this.state.post.repost.body}</p>
                    {repostImages}
                </div>
            </NavLink>
        }
        let post = this.state.loading_post ? <Loader /> : 
            <div>
            <article className="home-container pt-3 pl-3 pr-3 pb-0">
                <div className="d-flex">
                    <img style={{objectFit: "cover"}} className="rounded-circle" src={this.state.post.user.avatar} height="50" width="50"></img>
                    <div className="ml-2">
                        <p className="m-0"><b>{this.state.post.user.first_name} {this.state.post.user.last_name}</b></p>
                        <NavLink style={{color:'#5b7083'}}  to={"/user/"+this.state.post.user.username}><p className="m-0">@{this.state.post.user.username}</p></NavLink>
                    </div>
                    {this.state.post.user.id == this.state.account.id ?
                    <FontAwesomeIcon onClick={this.toggleModal} className="ml-auto awesome-cross" icon={faTimes} size="lg"/> : ''}
                </div>
                <div>
                    <p style={{fontSize: "18pt"}} className="mt-2 mb-1" >{this.state.post.body}</p>
                    {repost}
                    {images}
                    <p className="mb-3" style={{color:'#5b7083', fontSize: "12pt"}}> {this.formatDate(this.state.post.created_at)}</p>
                    <hr className="mt-3 mb-3"/>
                    <p className="mb-3" style={{color: "#5b7083"}}> 
                        <span><b style={{color: "#212529"}}>{this.state.likes}</b> likes</span>
                        &nbsp;|&nbsp;
                        <span><b style={{color: "#212529"}}>{this.state.dislikes}</b> dislikes</span>
                        &nbsp;|&nbsp;
                        <span><b style={{color: "#212529"}}>{this.state.comments.length}</b> comments</span>
                        &nbsp;|&nbsp;
                        <span><b style={{color: "#212529"}}>{this.state.post.reposts.length}</b> reposts</span>
                    </p>
                    <hr className="mt-3 mb-3"/>
                    <div className='d-flex justify-content-around' style={{color: "#5b7083"}}>
                        <p>
                            <span name="like" onClick={this.btnClick} className="post-icon like-post">
                                {this.state.liked ? <FontAwesomeIcon style={{color:"#17bf63"}}icon={ likeSol } size="lg"/> : <FontAwesomeIcon icon={ likeReg } size="lg"/>}
                            </span>
                        </p>
                        <p>
                            <span name="dislike" onClick={this.btnClick} className="post-icon dislike-post">
                                {this.state.disliked ? <FontAwesomeIcon style={{color:"#e0245e"}} icon={ dislikeSol} size="lg"/> : <FontAwesomeIcon icon={ dislikeReg} size="lg"/>}
                                
                            </span>
                        </p>
                        <p onClick={this.commentClick}><span className="post-icon repost-post"><FontAwesomeIcon icon={this.state.commenting ? commentSol : commentReg} size="lg"/></span></p>
                        <p> <NavLink style={{textDecoration: "none", color: "inherit"}} to={"/repost/"+this.state.post.id}> <span className="post-icon repost-post"><FontAwesomeIcon icon={faReply} size="lg"/></span></NavLink></p>
                    </div>
                </div>
            </article>
            {this.state.commenting && <AddComment focus={this.state.commenting} post={this.state.post} getComments={this.getComments}/>}
            </div>
        let comments = this.state.loading_comments ? <Loader /> : <CommentsList comments={this.state.comments} post={this.state.post} ></CommentsList>
        let recommend = this.state.loading_post ? '' : <Recommend showPost={this.showPost} content={'posts'} user={this.state.post.user.id}/>
        return(
        <Fragment>
            <div className="container">
                {this.state.modal && <Modal delete={this.deletePost} toggle={this.toggleModal}/>}
                <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-7">
                        <h5 className="header">Post</h5>
                        {post}
                        {comments}
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

export default Post