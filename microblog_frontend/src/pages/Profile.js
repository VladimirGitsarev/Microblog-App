import React,  {Component, Fragment} from 'react'
import PostsList from '../components/PostsList'
import Loader from '../Loader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAt, faBirthdayCake, faCalendar, faEnvelope, faLink, faMapMarker, faMapMarkerAlt, faUserAlt } from '@fortawesome/free-solid-svg-icons'
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import axiosInstance from '../axios'
import { NavLink } from 'react-router-dom';
import Recommend from '../components/Recommend'

class Profile extends Component{
    constructor(props) {
      super(props);
      this.state = {
       user: '',
       account: '',
       posts: [],
       loading: true,
      };
    }

    componentDidMount(){       
        axiosInstance.get('http://localhost:8000/api/current_user/')
        .then(res => {
            this.setState({
                user: res.data.user,
                account: res.data
            });
            this.getPosts();
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

    formatDate(str){
        let date = new Date(str);
        return date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();
    }

    getLength(obj){
        if (obj != null)
            return obj.length;
    }

    render(){
        let status = this.state.account.status ? <p className="mt-1 mb-1">{this.state.account.status}</p> : '';
        let location = this.state.account.location ? <span><FontAwesomeIcon size="sm" icon={faMapMarkerAlt}/> {this.state.account.location}</span> : '';
        let link = this.state.account.link ? <span> | <FontAwesomeIcon size="sm" icon={faLink}/> {this.state.account.link}</span> : '';
        let birthdate = this.state.account.birthdate ? <span> | <FontAwesomeIcon size="sm" icon={faBirthdayCake}/> {this.formatDate(this.state.account.birthdate)}</span> : '';
        
        return(
            <Fragment>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-10 col-lg-7">
                            <h5 className="header">{this.state.user.first_name} {this.state.user.last_name} 
                                <br /><span style={{color:"gray", fontSize:"12pt", fontWeight: "normal"}}>{this.state.posts.length} posts </span>
                            </h5>
                            <div className="pt-1 pb-1 home-container">
                           <div className="d-flex align-items-center justify-content-sm-start justify-content-center flex-wrap">
                               <div > 
                                    <img className="p-2 align-self-center rounded-circle" src={this.state.account.img} width="150"></img>
                               </div>
                               <div className="user-info">
                                   <p><FontAwesomeIcon size="sm" style={{color:'#4ea4ff'}} icon={faUserAlt}/> <b>{this.state.user.first_name} {this.state.user.last_name} </b></p>
                                   <p><FontAwesomeIcon size="sm" style={{color:'#4ea4ff'}} icon={faAt}/> {this.state.user.username} </p>
                                   <p><FontAwesomeIcon size="sm" style={{color:'#4ea4ff'}} icon={faEnvelope}/> {this.state.user.email} </p>
                                   <p><FontAwesomeIcon size="sm" style={{color:'#4ea4ff'}} icon={faCalendar}/> {this.formatDate(this.state.user.date_joined)} </p>
                               </div>
                               <div className="align-self-start ml-auto">
                                    <NavLink to='/profile/edit'> <p><FontAwesomeIcon size="sm" style={{color:'gray'}} icon={faEdit}/></p> </NavLink>
                               </div>
                           </div>
                           <div style={{padding: "0px 15px"}}>
                                {status}
                                <p style={{color:'#5b7083', fontSize: '11pt'}}>
                                    {location}
                                    {link}
                                    {birthdate}
                                </p>
                                <p style={{color: "gray"}}> 
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
                                <Recommend content={"profile"}/>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
        }
    }
    
export default Profile;