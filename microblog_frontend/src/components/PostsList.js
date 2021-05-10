import React, { Component} from 'react';
import PostItem from './PostItem'
import PropTypes from 'prop-types'
import PostSmallItem from '../components/PostSmallItem'

class PostsList extends Component{
    constructor(props) {
      super(props);
      this.state = {
  
      };
    }

    render(){
        let content;
        if (this.props.small){
            content = 
            <div>
                { this.props.posts.map( (post) => {
                    return <PostSmallItem post={post} key={post.id}/>
                })}
            </div>
        }
        else{
            content = 
            <div className="posts-container">
                { this.props.posts.map( (post) => {
                    return <PostItem account={this.props.account} post={post} key={post.id}/>
                })}
            </div>
        }
        return(
            <div>
                {content}
            </div>
        )    
    }   
}

export default PostsList