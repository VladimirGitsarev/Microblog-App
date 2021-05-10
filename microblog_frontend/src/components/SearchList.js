import React,  {Component, Fragment} from 'react'
import PostSmallItem from '../components/PostSmallItem'
import UserSmallItem from '../components/UserSmallItem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSadTear } from '@fortawesome/free-regular-svg-icons'
import { } from '@fortawesome/free-solid-svg-icons'



class SearchList extends Component{
    constructor(props) {
      super(props);
      this.state = {
        list: [],
        object: ''
      };
    }

    render(){
        let list;
        let empty;

        empty = 
            <div style={{color:"gray", textAlign:"center", borderTop:"1px solid #e6ecf0"}} className="p-3">
                <p className="m-0"> Matches for {this.state.object} not found </p>
                <FontAwesomeIcon icon={faSadTear} size="5x" />
            </div>

        if (this.props.posts){
            this.state.list = this.props.posts; 
            this.state.object = 'posts'
            list =
                <div>
                    { this.props.posts.map( (post) => {
                    return <PostSmallItem post={post} key={post.id}/>
                })}
                </div>
        }
        else if (this.props.users){
            this.state.list = this.props.users; 
            this.state.object = 'users'
            list = 
            <div>
                { this.props.users.map( (user) => {
                return <UserSmallItem user={user} key={user.id}/>
            })}
            </div>
        }

        return(
            <div>
                {this.state.list.length > 0 ? list : empty}
            </div>
        )
    }

}

export default SearchList