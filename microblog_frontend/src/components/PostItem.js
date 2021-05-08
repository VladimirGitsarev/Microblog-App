import React, {Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {NavLink} from 'react-router-dom'

import axiosInstance from 'axios';
import { faThumbsUp as likeReg, faThumbsDown as dislikeReg, faComment} from '@fortawesome/free-regular-svg-icons'
import { faReply, faThumbsUp as likeSol, faThumbsDown as dislikeSol} from '@fortawesome/free-solid-svg-icons'

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
          axiosInstance.post(`http://localhost:8000/api/posts/like/${this.post.id}`, {
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
          axiosInstance.post(`http://localhost:8000/api/posts/dislike/${this.post.id}`, {
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
      this.post.likes.forEach((user) => {
        if (user.id == this.props.account.user.id) 
          liked = true
      })
      return liked      
    }

    checkDislikes(){
      let disliked = false
      this.post.dislikes.forEach((user) => {
        if (user.id == this.props.account.user.id) 
          disliked = true
      })
      return disliked      
    }

    render(){
      let repost = ''
      if (this.post.repost){
        repost = 
        <NavLink style={{textDecoration: "none", color: "inherit"}} to={"/post/" + this.post.repost.id}>
          <div className="repost-item ">
              <p style={{fontSize: '11pt'}} className="m-0"> <FontAwesomeIcon style={{ color:"#5b7083"}} name="repost" icon={faReply}/> Repost from&nbsp;
                <b>{this.post.repost.user.user.first_name}&nbsp;{this.post.repost.user.user.last_name}</b>
                <NavLink style={{ color:"#5b7083"}} to={"/user/" + this.post.repost.user.user.username}>&nbsp;@{this.post.repost.user.user.username}</NavLink>
              </p>
              <p className="m-0">{this.post.repost.body}</p>
          </div>
        </NavLink>
      }
    return (
      <NavLink style={{textDecoration: "none", color:"inherit"}} to={"/post/" + this.post.id}>
    <article className="post-container d-flex">
      <div>
        <img className="mr-2 rounded-circle" src={this.post.user.img} width="50"></img>
      </div>
      <div>
        <div className="d-inline-flex flex-wrap">
          <p className="m-0"><b>{this.post.user.user.first_name} {this.post.user.user.last_name}</b></p>
          <p className="m-0" style={{color:"#5b7083"}}>&nbsp;
            <NavLink style={{ color:"#5b7083"}} to={"/user/" + this.post.user.user.username}>@{this.post.user.user.username}</NavLink>
          </p>
          <p className="m-0" style={{color:"#5b7083"}}>&nbsp;&middot;&nbsp;{this.formatDate(this.post.date)}</p>
        </div>
        <div className="pb-1">{this.post.body}</div>
        {repost}
        <div className="d-inline-flex flex-wrap" style={{fontSize:"10pt"}}>
          <p className="m-0" style={{color:"#17bf63"}}> <span name="like" onClick={this.btnClick} className="like-span">Одобряю <FontAwesomeIcon name="like" icon={this.state.liked ? likeSol : likeReg}/></span>{this.state.likes || ''} </p>
          &nbsp;&nbsp;&nbsp;
          <p className="m-0" style={{color:"#e0245e"}}> <span name="dislike" onClick={this.btnClick} className="dislike-span">Осуждаю <FontAwesomeIcon name="dislike" icon={this.state.disliked ? dislikeSol : dislikeReg}/></span>{this.state.dislikes || ''}</p>
          &nbsp;&nbsp;&nbsp;
          <p className="m-0" style={{color:"#007bff"}}> <NavLink style={{textDecoration: "none", color:"#007bff"}} to={"/post/" + this.post.id + "/comment"}> <span name="comment" className="repost-span">Comment <FontAwesomeIcon name="comment" icon={faComment}/></span></NavLink>{this.post.comments || ''}</p>
          &nbsp;&nbsp;&nbsp;
          <p className="m-0" style={{color:"#007bff"}}> <span name="repost" onClick={this.btnClick} className="repost-span">Repost <FontAwesomeIcon name="repost" icon={faReply}/></span>{this.post.reposts_count || ''}</p>
        </div>      
      </div>  
    </article>
    </NavLink>
    )
}
}

export default PostItem