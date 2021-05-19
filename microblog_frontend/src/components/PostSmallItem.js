import PostsList from "./PostsList";
import React, { Component} from 'react';
import {NavLink} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChartBar, faPoll, faReply,} from '@fortawesome/free-solid-svg-icons'

class PostSmallItem extends Component{
    constructor(props) {
      super(props);
      this.state = {
       
      };
      this.post = props.post;
      this.showPost = this.showPost.bind(this)
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

      showPost(){
        window.location.href = "/post/" + this.post.id;
      }

    render(){
        let images = this.post.images ? <div className="d-flex justify-content-center align-content-center flex-wrap mt-1 mb-1">{this.post.images.map( (image) => {
                    return <img src={image} style={{width: "75px", height: "75px", objectFit:"cover", borderRadius: "1.5rem", marginBottom:"0.5rem", marginRight:"0.5rem"}}/>
                })}</div> : null
        let repost = ''
        if (this.post.repost){
            repost = 
            <NavLink style={{textDecoration: "none", color: "inherit"}} to={"/post/" + this.post.repost.id}>
              <div className="repost-small-item ">
                  <p style={{fontSize: '10pt'}} className="m-0"> <FontAwesomeIcon style={{ color:"#5b7083"}} name="repost" icon={faReply}/> Repost from&nbsp;
                    <NavLink style={{ color:"#5b7083"}} to={"/user/" + this.post.repost.user.username}>&nbsp;@{this.post.repost.user.username}</NavLink>
                  </p>
                  <p className="m-0">{this.post.repost.body}</p>
              </div>
            </NavLink>
          }
        let vote = null
        if (this.post.vote){
            vote = <div className="d-flex justify-content-center">
                <div className="d-flex flex-column align-items-center">
                    <FontAwesomeIcon icon={faChartBar} color="#e2ebffdc" size="3x"/>
                    <small>Poll</small>
                </div>
            </div>
        }
        return(
            <div onClick={this.showPost}>
                <article className="post-container d-flex">
                    <div>
                        <img style={{objectFit: "cover"}} className="mr-2 rounded-circle" src={this.post.user.avatar} width="30" height="30"></img>
                    </div>
                    <div style={{fontSize: '11pt'}}>
                        <div className="d-inline-flex flex-wrap">
                        <p className="m-0"><b>{this.post.user.first_name} {this.post.user.last_name}</b></p>
                        <p className="m-0" style={{color:"#5b7083"}}>&nbsp;
                            <NavLink style={{ color:"#5b7083"}} to={"/user/" + this.post.user.username}>@{this.post.user.username}</NavLink>
                        </p>
                        </div>
                        <div className="pb-1">{this.post.body.substring(0, 100)} {this.post.body.length < 100 ? '' : '...'}</div>
                        {vote}
                        {images}
                        {repost}
                    </div>
                </article>
            </div>
        )
    }
}

export default PostSmallItem