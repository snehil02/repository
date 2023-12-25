import React, { Component } from "react";
import Cookies from "js-cookie";

import Navigation from "./Navigation";
import SideBar from "./SideBar";
import { Link } from "react-router-dom";

class Review extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            sideMenuOpen: false,
            userId: '',
        }
    }
    componentDidMount(){
        let userIdCookie =  Cookies.get("session");
        this.setState({userId : userIdCookie});
    }
        
    render() {
           
        return  (
            <div className="Container">
                <div className="services col">
                    <div className="content">
                        <div className="container responsive tickets">
                            <div className="header-container">
                                <h1>Rate your recent experience</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Review;