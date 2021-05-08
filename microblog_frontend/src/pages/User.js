import React,  {Component, Fragment} from 'react'
import PostsList from '../components/PostsList'
import Loader from '../Loader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAt, faCalendar, faEnvelope, faMapMarkerAlt, faLink, faBirthdayCake, faPlusCircle, faMinusCircle, faUserAlt, faCoins } from '@fortawesome/free-solid-svg-icons'
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import axiosInstance from '../axios'
import Recommend from '../components/Recommend'

class Profile extends Component{
    constructor(props) {
      super(props);
      this.state = {
       user: '',
       account: '',
       posts: [],
       followed: false,
       loading: true,
       loading_accout: true
      };
      this.followClick = this.followClick.bind(this);
      this.getUser = this.getUser.bind(this)
    }

    
    componentDidMount(){    
        this.getCurrentUser();    
    }

    getCurrentUser(){
        const name = this.props.match.params.name;
        axiosInstance
            .get('http://localhost:8000/api/current_user/')
            .then(res => {
                this.setState({
                    current_account: res.data,
                    loading_accout: false
                });
                this.getUser(name);
            });   
        }

    getUser(name){
        axiosInstance.get(`http://localhost:8000/api/user/${name}`)
        .then(res => {
            if (this.state.current_account.user.id == res.data.user.id){
                this.props.history.push('/profile')
            }
            else{
                this.setState({
                    user: res.data.user,
                    account: res.data
                });
                this.getPosts();
                this.checkFollowing();
            }
            
        })
    }

    getPosts(){
        axiosInstance.get(`http://localhost:8000/api/posts/user/${this.state.user.id}/all`)
        .then(res => {
            this.setState({
                posts: res.data,
                loading: false
            });
        })
    }

    formateDate(str){
        let date = new Date(str);
        return date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();
        
    }

    getLength(obj){
        if (obj != null)
            return obj.length;
    }

    checkFollowing(){
        this.state.account.followers.forEach(follower => {
            if (this.state.current_account.user.id == follower){
                console.log('User', this.state.current_account.user.username, 'follows', this.state.user.username);
                this.setState({ followed: true })
            }   
        })
    }

    followClick(){
        axiosInstance.post(`http://localhost:8000/api/user/follow/${this.state.user.id}`, {
            user: this.state.current_account.user.id,
            followed: this.state.followed
          })
          .then(res =>{
            console.log(res);
            this.setState({
                followed: !this.state.followed,
                user: res.data.user,
                account: res.data
            })
          })
    }

    render(){
        let status = this.state.account.status ? <p className="mt-1 mb-1">{this.state.account.status}</p> : '';
        let location = this.state.account.location ? <span><FontAwesomeIcon size="sm" icon={faMapMarkerAlt}/> {this.state.account.location}</span> : '';
        let link = this.state.account.link ? <span> | <FontAwesomeIcon size="sm" icon={faLink}/> {this.state.account.link}</span> : '';
        let birthdate = this.state.account.birthdate ? <span> | <FontAwesomeIcon size="sm" icon={faBirthdayCake}/> {this.formateDate(this.state.account.birthdate)}</span> : '';
        let follow_btn = this.state.followed ? 
            <p className="def-btn btn-normal" onClick={this.followClick}><FontAwesomeIcon size="sm" icon={faMinusCircle}/> Unfollow</p> :
            <p className="def-btn btn-outline" onClick={this.followClick}><FontAwesomeIcon size="sm" icon={faPlusCircle}/> Follow</p>

        let body = this.state.loading_accout ? <Loader /> : 
        <div className="row justify-content-center">
                        <div className="col-md-10 col-lg-7">
                            <h5 className="header">{this.state.user.first_name} {this.state.user.last_name} 
                                <br /><span style={{color:"gray", fontSize:"12pt", fontWeight: "normal"}}>{this.state.posts.length} posts </span>
                            </h5>
                            <div className="pt-1 pb-1 home-container">
                           <div className="d-flex align-items-center justify-content-sm-start justify-content-center flex-wrap">
                               <div > 
                                    <img className="p-2 rounded-circle align-self-center" src={this.state.account.img} width="150"></img>
                               </div>
                               <div className="user-info">
                                   <p><FontAwesomeIcon size="sm" style={{color:'#4ea4ff'}} icon={faUserAlt}/> <b>{this.state.user.first_name} {this.state.user.last_name} </b></p>
                                   <p><FontAwesomeIcon size="sm" style={{color:'#4ea4ff'}} icon={faAt}/> {this.state.user.username} </p>
                                   <p><FontAwesomeIcon size="sm" style={{color:'#4ea4ff'}} icon={faEnvelope}/> {this.state.user.email} </p>
                                   <p><FontAwesomeIcon size="sm" style={{color:'#4ea4ff'}} icon={faCalendar}/> {this.formateDate(this.state.user.date_joined)} </p>
                                    {follow_btn}
                               </div>
                               <div className="align-self-start ml-auto">
                                    
                               </div>
                           </div>
                           <div style={{padding: "0px 15px"}}>
                                {status}
                                <p style={{color:'#5b7083', fontSize: '11pt'}}>
                                    {location}
                                    {link}
                                    {birthdate}
                                </p>
                                <p  style={{color: "gray"}}> 
                                    <span><b style={{color: "#212529"}}>{this.getLength(this.state.account.followers)}</b> followers</span> 
                                    &nbsp;|&nbsp;
                                    <span><b style={{color: "#212529"}}>{this.getLength(this.state.account.following)}</b> following</span>
                                </p>
                                
                           </div>
                            <h6 style={{padding: "0px 15px"}}>
                                Posts by&nbsp;
                                <b>{this.state.user.first_name} {this.state.user.last_name}</b>&nbsp;
                                <span style={{color: "gray"}}>@{this.state.user.username}</span>
                            </h6>
                            </div>
                            
                            <PostsList account={this.props.account} posts={this.state.posts}></PostsList>
                            {this.state.loading && <Loader />}
                        </div>
                        <div className="ml-0 mb-4 d-none d-xl-block d-lg-block d-md-none col-lg-4">
                            <div className=" side-container sticky-top">
                                <Recommend getUser={this.getUser} content={'users'}/>
                            </div>
                        </div>
                    </div>
        return(
            <Fragment>
                <div className="container">
                    {body}
                </div>
            </Fragment>
        )
        }
    }
    
export default Profile;