import React, {Component} from "react";
import PostItem from "./PostItem";


class Slider extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render(){
        return <div>
        <div className="modal fade bd-example-modal-lg" id={"exampleModal" + this.props.post.id}  tabIndex="-1" role="dialog"
                    aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Attached images</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                         <div id={"carouselExampleControls" + this.props.post.id} className="carousel slide" data-ride="carousel">
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <img className="d-block w-100" src={this.props.post.images[0]} alt="Second slide"/>
                                </div>
                                 { this.props.post.images.slice(1).map( (image) => {
                                    return <div className="carousel-item">
                                    <img className="d-block w-100" src={image} alt="First slide"/>
                                </div>
                                })}
                            </div>
                            <a className="carousel-control-prev" href={"#carouselExampleControls" + this.props.post.id} role="button" data-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="sr-only">Previous</span>
                            </a>
                            <a className="carousel-control-next" href={"#carouselExampleControls" + this.props.post.id} role="button" data-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="sr-only">Next</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

            </div>


    }
}

export default Slider
