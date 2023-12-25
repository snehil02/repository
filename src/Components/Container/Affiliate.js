import React, { Component } from "react";
import Cookies from "js-cookie";

import Navigation from "./Navigation";
import SideBar from "./SideBar";
import { Link } from "react-router-dom";

class Affiliate extends Component {

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
    

    sideBarToggle = (event) => {
        event.preventDefault();
        this.setState((prevState) => {
            return {sideMenuOpen : !prevState.sideMenuOpen};
        });
        if (this.state.sideMenuOpen){
            document.body.classList.remove('scroll-stop');
        }
        else {
            document.body.classList.add('scroll-stop');
        }
    }
    
    render() {
        
        let sideClass = 'Container'
        if (this.state.sideMenuOpen) {
            sideClass = 'Container sidebar-open'
        };
           
        return  (
            <div className={sideClass}>
                <SideBar />
                <div className="services col">
                    <Navigation menuButton={this.sideBarToggle}/>
                    <div className="content">
                        <div className="container responsive tickets">
                            <div className="header-container">
                                <h1>Refer a Friend</h1>
                            </div>
                            <section>
                                <p>Lorem ipsum dolor sit amet, invidunt inciderint cu nam, simul habemus complectitur cu his, paulo doctus euismod sed ea. An est diceret sententiae definiebas, debet Lorem ipsum dolor sit amet, invidunt inciderint cu nam, simul habemus complectitur cu his, paulo doctus euismod sed ea. An est diceret sententiae definiebas, debet </p>

                                <div class="input-group mt-4">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">
                                            Your link is:
                                        </span>
                                    </div>
                                    <input type="text" class="form-control click-select" value="https://ipsum.com/r/XNV8EL" readonly=""/>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Affiliate;