import React, {Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {NavLink} from 'react-router-dom'

class CommentItem extends Component{
    constructor(props) {
      super(props);
      this.state = {
    
      };
      this.comment = props.comment;
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

    render(){
        return(
                <article className="post-container d-flex">
                    <div>
                        <img className="mr-2 rounded-circle" src={this.comment.user.img} width="50"></img>
                    </div>
                    <div>
                        <div className="d-inline-flex flex-wrap">
                        <p className="m-0"><b>{this.comment.user.user.first_name} {this.comment.user.user.last_name}</b></p>
                        <p className="m-0" style={{color:"#5b7083"}}>&nbsp;
                            <NavLink style={{ color:"#5b7083"}} to={"/user/" + this.comment.user.user.username}>@{this.comment.user.user.username}</NavLink>
                        </p>
                        <p className="m-0" style={{color:"#5b7083"}}>&nbsp;&middot;&nbsp;{this.formatDate(this.comment.date)}</p>
                        </div>
                        <div style={{color: "#5b7083", fontSize: "11pt"}} className=""> Answer to @{this.props.post.user.user.username}</div>
                        <div className="">{this.comment.body}</div>
                        {/* <div className="d-inline-flex flex-wrap" style={{fontSize:"10pt"}}>
                        <p className="m-0" style={{color:"#17bf63"}}> <span name="like" onClick={this.btnClick} className="like-span">Одобряю <FontAwesomeIcon name="like" icon={this.state.liked ? likeSol : likeReg}/></span>{this.state.likes || ''} </p>
                        &nbsp;&nbsp;&nbsp;
                        <p className="m-0" style={{color:"#e0245e"}}> <span name="dislike" onClick={this.btnClick} className="dislike-span">Осуждаю <FontAwesomeIcon name="dislike" icon={this.state.disliked ? dislikeSol : dislikeReg}/></span>{this.state.dislikes || ''}</p>
                        &nbsp;&nbsp;&nbsp;
                        <p className="m-0" style={{color:"#007bff"}}> <span name="comment" onClick={this.btnClick} className="repost-span">Comment <FontAwesomeIcon name="comment" icon={faComment}/></span>{this.getRandomInt(1000)}</p>
                        &nbsp;&nbsp;&nbsp;
                        <p className="m-0" style={{color:"#007bff"}}> <span name="repost" onClick={this.btnClick} className="repost-span">Repost <FontAwesomeIcon name="repost" icon={faReply}/></span>{this.getRandomInt(1000)}</p>
                        </div>       */}
                    </div>  
                </article>
        )
    }
}

export default CommentItem