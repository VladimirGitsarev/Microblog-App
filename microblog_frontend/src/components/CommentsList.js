import React, { Component} from 'react';
import PostItem from './PostItem'
import PropTypes from 'prop-types'
import CommentItem from '../components/CommentItem'

class CommentsList extends Component{
    constructor(props) {
      super(props);
      this.state = {
  
      };
    }

    render(){
        return(
            <div className="posts-container">
                { this.props.comments.map( (comment) => {
                    return <CommentItem post={this.props.post} account={this.props.account} comment={comment} key={comment.id}/>
                })}
            </div>
        )    
    }   
}

export default CommentsList