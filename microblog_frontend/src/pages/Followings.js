import React, {Component, Fragment} from "react";
import axiosInstance from "../axios";
import Recommend from "../components/Recommend";
import UsersList from "../components/UsersList";

class Followings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            followers: [],
            following: [],
            loadingFollowers: true,
            loadingFollowing: true,
            followingList: false
        };
        this.clickBar = this.clickBar.bind(this)

    }

    componentDidMount(){
       this.getCurrentUser();
       this.getFollowing();
       this.getFollowers();
       if (this.props.match.params.current === 'following'){
           document.querySelector('#following').classList = "switch-btn switch-btn-active"
           this.setState({followingList: true})
       }
       else
           document.querySelector('#followers').classList = "switch-btn switch-btn-active"

    }

    getFollowers(){
        axiosInstance.get("http://0.0.0.0:8000/auth/users/followers/")
            .then(res => {
                this.setState({followers: res.data})
            })
    }

    getFollowing(){
        axiosInstance.get("http://0.0.0.0:8000/auth/users/following/")
            .then(res => {
                this.setState({following: res.data})
            })
    }

    getCurrentUser(){
         axiosInstance.get('http://localhost:8000/auth/user/')
        .then(res => {
            this.setState({
                user: res.data,
            });
        })
    }

    clickBar(event){
        document.querySelector('#following').classList = "switch-btn"
        document.querySelector('#followers').classList = "switch-btn"
        event.target.classList = "switch-btn switch-btn-active"
        let followingList = event.target.id === 'following'
        this.setState({followingList: followingList})
    }

    render() {
        return(
            <Fragment>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-10 col-lg-7 p-0 ml-3 mr-3" style={{backgroundColor:"rgba(255, 255, 255, 0.9)"}}>
                            <h5 className="header">{this.state.user.first_name} {this.state.user.last_name}
                                <br /><span style={{color:"gray", fontSize:"12pt", fontWeight: "normal"}}>@{this.state.user.username} </span>
                            </h5>
                            <div className="p-0 m-0 home-container">
                                <div className="d-flex">
                                    <div id="followers" className="switch-btn" onClick={this.clickBar}>Followers</div>
                                    <div id="following" className="switch-btn" onClick={this.clickBar}>Following</div>
                                </div>
                                {this.state.followingList ?
                                    <UsersList user={this.state.user} users={this.state.following} full={true}/> :
                                    <UsersList user={this.state.user} users={this.state.followers} full={true}/>
                                }
                            </div>
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

export default Followings;