import React, {Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {NavLink} from 'react-router-dom'

import axiosInstance from 'axios';
import { faThumbsUp as likeReg, faThumbsDown as dislikeReg, faComment} from '@fortawesome/free-regular-svg-icons'
import {faReply, faThumbsUp as likeSol, faThumbsDown as dislikeSol, faShare} from '@fortawesome/free-solid-svg-icons'
import ChatItem from "./ChatItem";
import Slider from "./Slider";

class PostItem extends Component{
    constructor(props) {
      super(props);
      this.state = {
        liked: '',
        disliked: '',
        likes: null,
        dislikes: null
      };
      this.post = props.post;
      this.btnClick = this.btnClick.bind(this)
      this.toPost = this.toPost.bind(this)
    }

    componentDidMount(){
      this.setState({
        liked: this.checkLikes(),
        disliked: this.checkDislikes(),
        likes: this.post.likes.length,
        dislikes: this.post.dislikes.length
      })
    }

    formatDate(date){
      let dateObj = new Date(date)
      let dateNow = new Date();
      let timeDiff = Math.abs(dateNow.getTime() - dateObj.getTime())/1000;
      let add;
      if (timeDiff < 60)
        add = ' seconds'
      else if (timeDiff < 60 * 60){
        add = ' minutes'
        timeDiff /= 60
      }
      else if (timeDiff < 60 * 60 * 24){
        add = ' hours'
        timeDiff /= 60 * 60
      }
      else if (timeDiff < 60 * 60 * 24 * 30){
        add = ' days'
        timeDiff /= 60 * 60 * 24
      }

      let res = add ? Math.round(timeDiff) + add : 'More than month ago' 
      return res
    }

    getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    }

    btnClick = e => {
      e.preventDefault();
      let element = e.target.getAttribute('name');
      switch(element){
        case 'like':
          axiosInstance.post(`http://localhost:8000/blog/posts/${this.post.id}/like/`, {
            liked: this.state.liked
          })
          .then(res => {
            this.setState({
              dislikes: res.data.dislikes.length,
              likes: res.data.likes.length,
              disliked: false,
              liked:!this.state.liked
            })
          })
          break;
        case 'dislike':
          axiosInstance.post(`http://localhost:8000/blog/posts/${this.post.id}/dislike/`, {
            disliked: this.state.disliked
          })
          .then(res => {
            this.setState({
              likes: res.data.likes.length,
              dislikes: res.data.dislikes.length,
              liked: false,
              disliked:!this.state.disliked
            })
          });
           break;
      }
    }

    checkLikes(){
      let liked = false
      this.post.likes.forEach((id) => {
        if (id == this.props.account.id)
          liked = true
      })
      return liked      
    }

    checkDislikes(){
      let disliked = false
      this.post.dislikes.forEach((id) => {
        if (id == this.props.account.id)
          disliked = true
      })
      return disliked      
    }

    toPost(event){
      if (event.target.id === 'post-trigger' || event.target.tagName === 'ARTICLE')
        this.props.history.push("/post/" + this.post.id)
    }
    //
    // toRepost(event){
    //   if (event.target.id === 'post-trigger' || event.target.tagName === 'ARTICLE')
    //     this.props.history.push("/post/" + this.post.repost.id)
    // }

    render(){
      let imageSize;
      switch (this.post.images.length){
        case 1: imageSize = window.innerWidth * 0.25; break;
        case 2: imageSize = window.innerWidth * 0.14; break;
        case 3: imageSize = window.innerWidth * 0.14; break;
        case 4: imageSize = window.innerWidth * 0.14; break;
        default: imageSize = window.innerWidth * 0.125; break;
      }
      let repost = ''
      if (this.post.repost){
        let repostImages = this.post.repost.images ? <div className="d-flex align-content-center flex-wrap mt-1 mb-1">{this.post.repost.images.map( (image) => {
                    return <img src={image} style={{width: "100px", height: "100px", objectFit:"cover", borderRadius: "1.5rem", marginBottom:"0.5rem", marginRight:"0.5rem"}}/>
                })}</div> : null
        repost = 
        <NavLink style={{textDecoration: "none", color: "inherit"}} to={"/post/" + this.post.repost.id}>
          <div className="repost-item ">
              <p style={{fontSize: '11pt'}} className="m-0"> <FontAwesomeIcon style={{ color:"#5b7083"}} name="repost" icon={faShare}/> Repost from&nbsp;
                <b>{this.post.repost.user.first_name}&nbsp;{this.post.repost.user.last_name}</b>
                <NavLink style={{ color:"#5b7083"}} to={"/user/" + this.post.repost.user.username}>&nbsp;@{this.post.repost.user.username}</NavLink>
              </p>
              <p className="m-0">{this.post.repost.body}</p>
            {repostImages}
          </div>
        </NavLink>
      }

      let images = this.post.images ? <div className="d-flex justify-content-center align-content-center flex-wrap mt-1 mb-1">{this.post.images.map( (image) => {
                    return <img data-toggle="modal" data-target={"#exampleModal" + this.post.id} src={image} style={{width: imageSize + "px", height: imageSize + "px", objectFit:"cover", borderRadius: "1.5rem", marginBottom:"0.5rem", marginRight:"0.5rem"}}/>
                })}</div> : null
    return (
      <div onClick={this.toPost} style={{textDecoration: "none", color:"inherit"}} to={"/post/" + this.post.id}>
      <article className="post-container d-flex">
        <div>
          <img style={{objectFit: "cover"}} className="mr-2 rounded-circle" src={this.post.user.avatar} width="50" height="50" />
        </div>
        <div id="post-trigger">
          <div className="d-inline-flex flex-wrap">
            <p className="m-0"><b>{this.post.user.first_name} {this.post.user.last_name}</b></p>
            <p className="m-0" style={{color:"#5b7083"}}>&nbsp;
              <NavLink style={{ color:"#5b7083"}} to={"/user/" + this.post.user.username}>@{this.post.user.username}</NavLink>
            </p>
            <p className="m-0" style={{color:"#5b7083"}}>&nbsp;&middot;&nbsp;{this.formatDate(this.post.created_at)}</p>
          </div>
          <div className="pb-1">{this.post.body}</div>
          {repost}
          {images}
          <Slider post={this.post}/>
          <div className="d-inline-flex flex-wrap" style={{fontSize:"10pt"}}>
            <p className="m-0" style={{color:"#17bf63"}}> <span name="like" onClick={this.btnClick} className="like-span">Одобряю <FontAwesomeIcon name="like" icon={this.state.liked ? likeSol : likeReg}/></span>{this.state.likes || ''} </p>
            &nbsp;&nbsp;&nbsp;
            <p className="m-0" style={{color:"#e0245e"}}> <span name="dislike" onClick={this.btnClick} className="dislike-span">Осуждаю <FontAwesomeIcon name="dislike" icon={this.state.disliked ? dislikeSol : dislikeReg}/></span>{this.state.dislikes || ''}</p>
            &nbsp;&nbsp;&nbsp;
            <p className="m-0" style={{color:"#007bff"}}> <NavLink style={{textDecoration: "none", color:"#007bff"}} to={"/post/" + this.post.id + "/comment"}> <span name="comment" className="repost-span">Comment <FontAwesomeIcon name="comment" icon={faComment}/></span></NavLink>{this.post.comments.length || ''}</p>
            &nbsp;&nbsp;&nbsp;
            <p className="m-0" style={{color:"#007bff"}}> <NavLink style={{textDecoration: "none", color:"#007bff"}} name="repost" to={"/repost/" + this.post.id} className="repost-span">Repost <FontAwesomeIcon name="repost" icon={faShare}/></NavLink>{this.post.reposts.length || ''}</p>
          </div>
        </div>
      </article>
    </div>
    )
}
}

export default PostItem