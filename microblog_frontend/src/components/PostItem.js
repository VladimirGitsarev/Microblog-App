import React, {Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {NavLink} from 'react-router-dom'

import axiosInstance from 'axios';
import { faThumbsUp as likeReg, faThumbsDown as dislikeReg, faComment} from '@fortawesome/free-regular-svg-icons'
import {
  faReply,
  faThumbsUp as likeSol,
  faThumbsDown as dislikeSol,
  faShare,
  faChartBar
} from '@fortawesome/free-solid-svg-icons'
import ChatItem from "./ChatItem";
import Slider from "./Slider";

class PostItem extends Component{
    constructor(props) {
      super(props);
      this.state = {
        liked: '',
        disliked: '',
        likes: null,
        dislikes: null,
        post: props.post
      };
      this.post = props.post;
      this.btnClick = this.btnClick.bind(this)
      this.toPost = this.toPost.bind(this)
      this.optionClick = this.optionClick.bind(this)
    }

    componentDidMount(){
      this.setState({
        liked: this.checkLikes(),
        disliked: this.checkDislikes(),
        likes: this.state.post.likes.length,
        dislikes: this.state.post.dislikes.length
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
          axiosInstance.post(`http://localhost:8000/blog/posts/${this.state.post.id}/like/`, {
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
          axiosInstance.post(`http://localhost:8000/blog/posts/${this.state.post.id}/dislike/`, {
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
      this.state.post.likes.forEach((id) => {
        if (id === this.props.account.id)
          liked = true
      })
      return liked      
    }

    checkDislikes(){
      let disliked = false
      this.state.post.dislikes.forEach((id) => {
        if (id === this.props.account.id)
          disliked = true
      })
      return disliked      
    }

    toPost(event){
      if (event.target.id === 'post-trigger' || event.target.tagName === 'ARTICLE')
        this.props.history.push("/post/" + this.state.post.id)
    }

    optionClick(event){
      if (!this.state.post.vote.users.includes(this.props.account.id)){
        axiosInstance.post(`http://0.0.0.0:8000/blog/votes/${this.state.post.vote.id}/vote/`, {"option":event.target.id})
            .then(res => {
              this.setState({post: res.data})
            })
      }
    }

    toRepost(event){
      if (event.target.id === 'post-trigger' || event.target.tagName === 'ARTICLE')
        this.props.history.push("/post/" + this.state.post.repost.id)
    }

    render(){
      let imageSize;
      switch (this.state.post.images.length){
        case 1: imageSize = window.innerWidth * 0.25; break;
        case 2: imageSize = window.innerWidth * 0.14; break;
        case 3: imageSize = window.innerWidth * 0.14; break;
        case 4: imageSize = window.innerWidth * 0.14; break;
        default: imageSize = window.innerWidth * 0.125; break;
      }
      let repost = ''
      if (this.state.post.repost){
        let repostImages = this.state.post.repost.images ? <div className="d-flex align-content-center flex-wrap mt-1 mb-1">{this.state.post.repost.images.map( (image) => {
                    return <img src={image} style={{width: "100px", height: "100px", objectFit:"cover", borderRadius: "1.5rem", marginBottom:"0.5rem", marginRight:"0.5rem"}}/>
                })}</div> : null
        let vote = this.state.post.repost.vote ? <div className="d-flex justify-content-center">
                <div className="d-flex flex-column align-items-center">
                    <FontAwesomeIcon icon={faChartBar} color="#e2ebffdc" size="10x"/>
                    <small>Poll</small>
                </div>
            </div> : null
        repost =
        <NavLink style={{textDecoration: "none", color: "inherit"}} to={"/post/" + this.state.post.repost.id}>
          <div className="repost-item ">
              <p style={{fontSize: '11pt'}} className="m-0"> <FontAwesomeIcon style={{ color:"#5b7083"}} name="repost" icon={faShare}/> Repost from&nbsp;
                <b>{this.state.post.repost.user.first_name}&nbsp;{this.state.post.repost.user.last_name}</b>
                <NavLink style={{ color:"#5b7083"}} to={"/user/" + this.state.post.repost.user.username}>&nbsp;@{this.state.post.repost.user.username}</NavLink>
              </p>
              <p className="m-0">{this.state.post.repost.body}</p>
            {vote}
            {repostImages}
          </div>
        </NavLink>
      }

      let vote = null;
      if (this.state.post.vote){
        vote = <div className="vote-box">{this.state.post.vote.options.map( option => {
          console.log()
          return <div className="d-flex flex-row align-items-center">
            <div className={(this.state.post.vote.users.includes(this.props.account.id) ? "vote-option-voted" : "vote-option") + (option.users.includes(this.props.account.id) ? " user-option-voted" : "")} id={option.id} key={option.id} onClick={this.optionClick} >{option.body}
              <div className={"ml-2" + (option.users.includes(this.props.account.id) ? " user-option-voted" : " option-count")}>{this.state.post.vote.users.includes(this.props.account.id) ? option.users.length : null} </div>
            </div>
          </div>
        })}</div>
      }

      let images = this.state.post.images ? <div className="d-flex justify-content-center align-content-center flex-wrap mt-1 mb-1">{this.state.post.images.map( (image) => {
                    return <img data-toggle="modal" data-target={"#exampleModal" + this.state.post.id} src={image} style={{width: imageSize + "px", height: imageSize + "px", objectFit:"cover", borderRadius: "1.5rem", marginBottom:"0.5rem", marginRight:"0.5rem"}}/>
                })}</div> : null
    return (
      <div onClick={this.toPost} style={{textDecoration: "none", color:"inherit"}} to={"/post/" + this.state.post.id}>
      <article className="post-container d-flex">
        <div>
          <img style={{objectFit: "cover"}} className="mr-2 rounded-circle" src={this.state.post.user.avatar} width="50" height="50" />
        </div>
        <div id="post-trigger">
          <div className="d-inline-flex flex-wrap">
            <p className="m-0"><b>{this.state.post.user.first_name} {this.state.post.user.last_name}</b></p>
            <p className="m-0" style={{color:"#5b7083"}}>&nbsp;
              <NavLink style={{ color:"#5b7083"}} to={"/user/" + this.state.post.user.username}>@{this.state.post.user.username}</NavLink>
            </p>
            <p className="m-0" style={{color:"#5b7083"}}>&nbsp;&middot;&nbsp;{this.formatDate(this.state.post.created_at)}</p>
          </div>
          <div className="pb-1">{this.state.post.body}</div>
          {vote}
          {repost}
          {images}
          <Slider post={this.state.post}/>
          <div className="d-inline-flex flex-wrap" style={{fontSize:"10pt"}}>
            <p className="m-0" style={{color:"#17bf63"}}> <span name="like" onClick={this.btnClick} className="like-span">Одобряю <FontAwesomeIcon name="like" icon={this.state.liked ? likeSol : likeReg}/></span>{this.state.likes || ''} </p>
            &nbsp;&nbsp;&nbsp;
            <p className="m-0" style={{color:"#e0245e"}}> <span name="dislike" onClick={this.btnClick} className="dislike-span">Осуждаю <FontAwesomeIcon name="dislike" icon={this.state.disliked ? dislikeSol : dislikeReg}/></span>{this.state.dislikes || ''}</p>
            &nbsp;&nbsp;&nbsp;
            <p className="m-0" style={{color:"#007bff"}}> <NavLink style={{textDecoration: "none", color:"#007bff"}} to={"/post/" + this.state.post.id + "/comment"}> <span name="comment" className="repost-span">Comment <FontAwesomeIcon name="comment" icon={faComment}/></span></NavLink>{this.state.post.comments.length || ''}</p>
            &nbsp;&nbsp;&nbsp;
            <p className="m-0" style={{color:"#007bff"}}> <NavLink style={{textDecoration: "none", color:"#007bff"}} name="repost" to={"/repost/" + this.state.post.id} className="repost-span">Repost <FontAwesomeIcon name="repost" icon={faShare}/></NavLink>{this.state.post.reposts.length || ''}</p>
          </div>
        </div>
      </article>
    </div>
    )
}
}

export default PostItem