import React,  {Component, Fragment} from 'react'
import AddPost from '../components/AddPost'
import PostsList from '../components/PostsList'
import Loader from '../Loader'
import Recommend from '../components/Recommend'

import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axiosInstance from '../axios';

class Home extends Component{
    constructor(props) {
      super(props);
      this.state = {
        posts:[],
        loading: true
      };
      this.getPosts = this.getPosts.bind(this)
    }

    componentDidMount(){
        this.getPosts()
    }

    getPosts(){
        axiosInstance.get(`http://localhost:8000/blog/posts/`)
        .then(res => {
            this.setState({
                posts: res.data,
                loading: false
            })
        })
        
    }
    
    render(){
        return(
                <Fragment>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-10 col-lg-7">
                                <h5 className="header">Home page</h5>
                                <AddPost account={this.props.account} getPosts={this.getPosts}></AddPost>
                                <PostsList account={this.props.account} posts={this.state.posts}></PostsList>
                                {this.state.loading && <Loader />}
                            </div>
                            <div className="ml-0 mb-4 d-none d-xl-block d-lg-block d-md-none col-lg-4">
                                <div className=" side-container sticky-top">
                                    <Recommend content={'users'}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
        )
    }
}

export default Home;