import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import ReactDOM from 'react-dom'
import React, { Component, Fragment } from 'react';

class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render(){
        return(
            <div style={{display: "block"}} className="modal fade show" tabindex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Delete post</h5>
                        <button onClick={this.props.toggle} type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure you want to delete this post?</p>
                    </div>
                    <div className="modal-footer">
                        <button style={{backgroundColor: "#e0245e", border:"1px solid #c01e51"}} onClick={this.props.delete} type="button" className="def-btn btn-normal">Delete</button>
                        <button onClick={this.props.toggle} type="button" className="def-btn btn-outline" data-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Modal