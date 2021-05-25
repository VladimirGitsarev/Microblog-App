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
      this.getRecommendedPosts = this.getRecommendedPosts.bind(this)
        this.clickBar = this.clickBar.bind(this)
    }

    componentDidMount(){
        this.getCurrentUser();
    }

    getCurrentUser(){
        axiosInstance
            .get('http://localhost:8000/auth/user/')
            .then(res => {
                this.setState({
                    account: res.data
                });
                this.getPosts();
            });
        }

    getPosts(){
        this.setState({loading: true, posts: []})
        axiosInstance.get(`http://localhost:8000/blog/posts/`)
        .then(res => {
            if (res.data.length === 0) {
                this.getRecommendedPosts()
                document.querySelector('#recommended').classList = "switch-btn switch-btn-active"
                document.querySelector('#followings').classList = "switch-btn"
            }
            else {
                this.setState({
                    posts: res.data,
                    loading: false
                })
                document.querySelector('#followings').classList = "switch-btn switch-btn-active"
            }
        })
    }

    getRecommendedPosts(){
        this.setState({loading: true, posts: []})
        axiosInstance.get(`http://localhost:8000/blog/posts/recommend`)
        .then(res => {
            this.setState({
                posts: res.data,
                loading: false
            })
        })
    }

    clickBar(event){
        document.querySelector('#followings').classList = "switch-btn"
        document.querySelector('#recommended').classList = "switch-btn"
        event.target.classList = "switch-btn switch-btn-active"
        switch (event.target.id){
            case 'followings': this.getPosts(); break;
            case 'recommended': this.getRecommendedPosts(); break;
        }
    }
    
    render(){
        return(
                <Fragment>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-10 col-lg-7 p-0 ml-3 mr-3" style={{backgroundColor:"rgba(255, 255, 255, 0.9)"}}>
                                <h5 className="header">Home page</h5>
                                <AddPost account={this.props.account} getPosts={this.getPosts}/>
                                <div style={{border: "1px solid #e6ecf0", borderBottom: 0}} className="d-flex">
                                    <div id="followings" className="switch-btn" onClick={this.clickBar}>Followings</div>
                                    <div id="recommended" className="switch-btn" onClick={this.clickBar}>Recommended</div>
                                </div>
                                <PostsList history={this.props.history} account={this.state.account} posts={this.state.posts}/>
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