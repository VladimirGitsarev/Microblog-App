import React,  {Component, Fragment} from 'react'
import Loader from '../Loader'
import axiosInstance from '../axios'
import UsersList from '../components/UsersList'
import PostsList from './PostsList';

class Recommend extends Component{
    constructor(props) {
      super(props);
      this.state = { 
          loading: true,
          users: [],
          posts: [],
          account: ''
      };
    }

    componentDidMount(){
        this.getCurrentUser();
        switch(this.props.content){
            case 'profile':
                this.getFollowers();
                break;
            case 'users':
                this.getUsers();
                break;
            case 'posts':
                this.getPosts();
                break;
        }
    }

    getCurrentUser(){
        axiosInstance
            .get('http://localhost:8000/api/current_user/')
            .then(res => {
                this.setState({
                    account: res.data
                });
            });   
        }

    getUsers(){
        axiosInstance.get(`http://localhost:8000/api/user/recommend/get`)
        .then(res => {
            this.setState({
                users: res.data,
                loading: false
            })
        })
    }
    
    getFollowers(){
        axiosInstance.get(`http://localhost:8000/api/user/followers/get`)
        .then(res => {
            this.setState({
                users: res.data,
                loading: false
            })
        })
    }

    getPosts(){
        axiosInstance.get(`http://localhost:8000/api/posts/user/${this.props.user}/5`)
        .then(res => {
            this.setState({
                posts: res.data,
                loading: false
            })
        })
    }

    render(){
        let content;
        switch(this.props.content){
            case 'users':  
                {
                    content = 
                    <div>
                        <h5 style={{textAlign: "center"}}>May be interesting</h5>
                        <UsersList getUser={this.props.getUser} users={this.state.users}/>
                    </div>
                }
                break;
            case 'profile':
                {
                    content = 
                    <div>
                        <h5 style={{textAlign: "center"}}>Your followers</h5>
                        <UsersList getUser={this.props.getUser} users={this.state.users}/>
                    </div>
                }
                break;
            case 'posts':
                {
                    content = 
                        <div>
                            <h5 style={{textAlign: "center"}}> Other posts </h5>
                            <PostsList posts={this.state.posts} small={true}/>
                        </div>
                }
        }
        return(
            <div>
                {content}
                <div style={{color: "gray", textAlign: "center"}}>
                    <p className="m-0">Microblog by </p>
                    <p className="m-0"> Uladzimir Hitsarau, </p>
                    <p className="m-0">2020.</p>
                </div>
                {this.state.loading && <Loader />}
            </div>
        )
    }
}

export default Recommend