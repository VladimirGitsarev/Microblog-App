import React,  {Component, Fragment} from 'react'
import PostsList from '../components/PostsList'
import Loader from '../Loader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAt, faBirthdayCake, faCalendar, faEnvelope, faLink, faMapMarker, faMapMarkerAlt, faUserAlt } from '@fortawesome/free-solid-svg-icons'
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import axiosInstance from '../axios'
import { NavLink } from 'react-router-dom';
import Recommend from '../components/Recommend'

class EditProfile extends Component{
    constructor(props) {
      super(props);
      this.state = {
            account:'',
            loading: true
      };
    }

    componentDidMount(){       
        axiosInstance.get('http://localhost:8000/api/current_user/')
        .then(res => {
            this.setState({
                account: res.data,
                loading: false,
                username: res.data.user.username,
                first_name: res.data.user.first_name,
                last_name: res.data.user.last_name,
                email: res.data.user.email,
                status: res.data.status,
                location: res.data.location,
                link: res.data.link,
                birthdate: res.data.birthdate
            });
        })
    }

    handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState(prevstate => {
            const newState = { ...prevstate };
            newState[name] = value;
            return newState;
        })   
    }

    handleSubmit = (e) => {
        e.preventDefault();
        axiosInstance
			.post(`http://localhost:8000/api/user/edit/${this.state.account.user.id}`, {
				username: this.state.username,
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email,
                status: this.state.status,
                location: this.state.location,
                link: this.state.link,
                birthdate: this.state.birthdate
            })
            .then(res =>{
                this.setState({
                    account: res.data,
                    username: res.data.user.username,
                    first_name: res.data.user.first_name,
                    last_name: res.data.user.last_name,
                    email: res.data.user.email,
                    status: res.data.status,
                    location: res.data.location,
                    link: res.data.link,
                    birthdate: res.data.birthdate
                })
            })
            .catch(err =>{
                this.setState({
                    error: "Invalid data! Check all the fields."
                })
            })   
    }     

    formatDate(str){
        let date = new Date(str);
        return date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();
    }

    render(){
        let status = this.state.account.status ? <p className="mt-1 mb-1">{this.state.account.status}</p> : '';
        let location = this.state.account.location ? <span><FontAwesomeIcon size="sm" icon={faMapMarkerAlt}/> {this.state.account.location}</span> : '';
        let link = this.state.account.link ? <span> | <FontAwesomeIcon size="sm" icon={faLink}/> {this.state.account.link}</span> : '';
        let birthdate = this.state.account.birthdate ? <span> | <FontAwesomeIcon size="sm" icon={faBirthdayCake}/> {this.formatDate(this.state.account.birthdate)}</span> : '';

        let body = this.state.loading ? <Loader /> :
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-10 col-lg-7">
                            <h5 className="header">{this.state.account.user.first_name} {this.state.account.user.last_name} 
                                <br />
                                <span style={{color:"gray", fontSize:"12pt", fontWeight: "normal"}}>
                                    Profile 
                                </span>
                            </h5>
                            <div className="pt-1 pb-1 home-container">
                                <div className="d-flex align-items-center justify-content-sm-start justify-content-center flex-wrap">
                                    <div > 
                                            <img className="p-2 align-self-center rounded-circle" src={this.state.account.img} width="150"></img>
                                    </div>
                                    <div className="user-info">
                                        <p><FontAwesomeIcon size="sm" style={{color:'#4ea4ff'}} icon={faUserAlt}/> <b>{this.state.account.user.first_name} {this.state.account.user.last_name} </b></p>
                                        <p><FontAwesomeIcon size="sm" style={{color:'#4ea4ff'}} icon={faAt}/> {this.state.account.user.username} </p>
                                        <p><FontAwesomeIcon size="sm" style={{color:'#4ea4ff'}} icon={faEnvelope}/> {this.state.account.user.email} </p>
                                        <p><FontAwesomeIcon size="sm" style={{color:'#4ea4ff'}} icon={faCalendar}/> {this.formatDate(this.state.account.user.date_joined)} </p>
                                    </div>
                                    {/* <div className="align-self-start ml-auto">
                                            <NavLink to='/profile/edit'> <p><FontAwesomeIcon size="sm" style={{color:'gray'}} icon={faEdit}/></p> </NavLink>
                                    </div> */}
                                </div>
                                <div style={{padding: "0px 15px"}}>
                                        {status}
                                        <p style={{color:'#5b7083', fontSize: '11pt'}}>
                                            {location}
                                            {link}
                                            {birthdate}
                                        </p>
                                        <p style={{color: "gray"}}> 
                                            <span><b style={{color: "#212529"}}>{this.state.account.followers.length}</b> followers</span> 
                                            &nbsp;|&nbsp;
                                            <span><b style={{color: "#212529"}}>{this.state.account.following.length}</b> following</span>
                                        </p>
                                </div>
                            </div>
                            <div style={{borderTop: "1px solid #e6ecf0"}} className="home-container p-3">
                                <h5 ><b>Edit profile</b></h5>
                                <form onSubmit={this.handleSubmit}> 
                                    <hr />
                                    <h6><span style={{color: "#5b7083"}}>Account</span></h6>
                                    <div className="form-group row">
                                        <label for="inputUsername" className="col-sm-2 col-form-label">Username</label>
                                        <div className="col-sm-10">
                                            <input onChange={this.handleChange} type="text" value={this.state.username} name="username" className="form-control" id="inputUsername" placeholder="Username" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label for="inputFirstname" className="col-sm-2 col-form-label">Firstname</label>
                                        <div className="col-sm-10">
                                            <input onChange={this.handleChange}type="text" value={this.state.first_name} name="first_name" className="form-control" id="inputFirstname" placeholder="Firstname" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label for="inputLastname" className="col-sm-2 col-form-label">Lastname</label>
                                        <div className="col-sm-10">
                                            <input onChange={this.handleChange} type="text" value={this.state.last_name} name="last_name" className="form-control" id="inputLastname" placeholder="Lastname" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label for="inputEmail" className="col-sm-2 col-form-label">Email</label>
                                        <div className="col-sm-10">
                                            <input onChange={this.handleChange} type="email" value={this.state.email} name="email" className="form-control" id="inputEmail" placeholder="Email" />
                                        </div>
                                    </div>
                                    <div className="form-group row justify-content-end">
                                        <div className="col-sm-0 pr-3">
                                            <button type="submit" className="def-btn btn-normal">Save</button>
                                        </div>
                                    </div>
                                </form>
                                <hr/>
                                <form onSubmit={this.handleSubmit}>
                                    <h6><span style={{color: "#5b7083"}}>About you</span></h6>
                                    <div className="form-group row">
                                        <label for="inputStatus" className="col-sm-2 col-form-label">Status</label>
                                        <div className="col-sm-10">
                                            <input onChange={this.handleChange} type="text" value={this.state.status} name="status" className="form-control" id="inputStatus" placeholder="Status" />
                                            <small id="statusHelp" className="form-text text-muted">Short description of you</small>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label for="inputLocation" className="col-sm-2 col-form-label">Location</label>
                                        <div className="col-sm-10">
                                            <input onChange={this.handleChange} type="text" value={this.state.location} name="location" className="form-control" id="inputLocation" placeholder="Location" />
                                            <small id="locationHelp" className="form-text text-muted">Where are you now?</small>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label for="inputLink" className="col-sm-2 col-form-label">Link</label>
                                        <div className="col-sm-10">
                                            <input onChange={this.handleChange} type="text" value={this.state.link} name="link" className="form-control" id="inputLink" placeholder="Link" />
                                            <small id="linkHelp" className="form-text text-muted">Other social networks or your website</small>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label for="inputBirthdate" className="col-sm-2 col-form-label">Birthdate</label>
                                        <div className="col-sm-10">
                                            <input onChange={this.handleChange} type="date" value={this.state.birthdate} name="birthdate" className="form-control" id="inputBirthdate" placeholder="Birthdate" />
                                            <small id="birthdateHelp" className="form-text text-muted">When were you born?</small>

                                        </div>
                                    </div>
                                    <div className="form-group row justify-content-end">
                                        <div className="col-sm-0 pr-3">
                                            <button type="submit" className="def-btn btn-normal">Save</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="ml-0 mb-4 d-none d-xl-block d-lg-block d-md-none col-lg-4">
                            <div className=" side-container sticky-top">
                                <Recommend content={"profile"}/>
                            </div>
                        </div>
                    </div>
                </div>
        return(
            <Fragment>
                {body}
            </Fragment>
        )
    }
}

export default EditProfile