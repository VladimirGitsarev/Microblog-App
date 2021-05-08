import React,  {Component, Fragment} from 'react'
import Recommend from '../components/Recommend'
import Loader from '../Loader'
import axiosInstance from 'axios';
import PostsList from '../components/PostsList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import UsersList from '../components/UsersList';
import SearchList from '../components/SearchList';



class Search extends Component{
    constructor(props) {
      super(props);
      this.state = {
        loading: true, 
        query: '',
        posts: [],
        users: []
      };
    }

    componentDidMount(){
        let param = this.getParam();
        this.search(param);
    }

    getParam(){
        const params = new URLSearchParams(this.props.location.search);
        const param = params.get('query');
        this.setState({
            query: param
        })
        return param
    }

    search(param){
        console.log(this.state.query);
        axiosInstance.post(`http://localhost:8000/api/search/`, {
            query: param,
        })
        .then(response => {
            this.setState({
                loading: false,
                users: response.data.users,
                posts: response.data.posts
            })
            console.log(response)
        })
    }

    handleChange = e => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState(prevstate => {
          const newState = { ...prevstate };
          newState[name] = value;
          return newState;
        });
      };

    render(){
        return(
            <Fragment>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-10 col-lg-7">
                            <h5 className="header">Search</h5>
                            <div style={{borderBottom: "1px solid #e6ecf0"}} className="home-container">
                                <form className="p-3">
                                    <div className="form-row align-items-center justify-content-center">
                                        <div class="col-9 my-1">
                                            <input onChange={this.handleChange} type="text" value={this.state.query} className="form-control" id="query" name="query" placeholder="Enter search query" />
                                        </div>
                                        <div class="col-auto my-1">
                                            <button type="submit" className="def-btn btn-normal">Search</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div style={{borderBottom:"0px"}}  className="posts-container">
                                <h5 className="pl-3 pt-2 mb-0">Search results</h5>
                                <p className="pl-3 pb-2 mb-0 mt-0" style={{color:"gray"}}>
                                    <FontAwesomeIcon icon={faSearch} />
                                    &nbsp;
                                    {this.state.query}
                                </p>
                                <SearchList users={this.state.users} />
                            </div>
                            <div className="posts-container">
                                <SearchList posts={this.state.posts} />
                                
                            </div>
                            
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

export default Search