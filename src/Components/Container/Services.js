import React, { useState, useEffect, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import { CartContext } from "./CartContext";

import Navigation from "./Navigation";
import SideBar from "./SideBar";

const Services = () => {

    const [cart, setCart] = useContext(CartContext);

    const [side, setSide] = useState({
        sideMenuOpen: false
    });
    const [state, setState] = useState({
        loading: false,
        data: null,
    });
      
    /* Calling Api for getting all Service Categories */
    useEffect(() => {
        setState({ loading: true });
        const apiUrl = `/api/api/v1/getCategory`;
        fetch(apiUrl, {
            method: 'GET',
            // mode: 'cors',
            // credentials: 'include',
            // crossDomain : true,
            headers: {
                // 'Access-Control-Allow-Origin': '*',
                // "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                // 'Authorization': '',
                // 'x-api-key': '', 
                'Content-Type': 'application/json'
            }
        })
          .then((res) => res.json())
          .then(data => {
          setState({ loading: false, data: data.result });
          });
      }, []);

    /* Sidebar Toggeling for mobile view */
    const sideBarToggle = (event) => {
        event.preventDefault();
        setSide((prevState) => {
            return {sideMenuOpen : !prevState.sideMenuOpen};
        });
        if (side.sideMenuOpen){
            document.body.classList.remove('scroll-stop');
        }
        else {
            document.body.classList.add('scroll-stop');
        }
    };
    let history = useHistory();
    const subServices = (list) => {
        history.push({
            pathname:'/subservices',
            state:{subCategory : list.subCatgory}
        })
    };
    
    let sideClass = 'Container'
    if (side.sideMenuOpen) {
        sideClass = 'Container sidebar-open'
    };

    if (!state.data || state.data.length === 0) 
    return <div className="spinner-section">
                <div className="overlay">
                    <div className="overlay__inner">
                        <div className="overlay__content">
                            <span className="spinner"></span>
                        </div>
                    </div>
                </div>
            </div>;
                    
    return  (
        <div className={sideClass}>
            <SideBar />
            <div className="services col">
                <Navigation menuButton={sideBarToggle}/>
                <div className="content">
                    <div className="header-container responsive">
                        <h1>Services</h1>
                        <Link to="/cart" className="btn btn-primary" >
                            View Cart | 
                            <span id="cart-count">{cart.length}</span>
                        </Link>
                    </div>
                    <div className="grid-wrapper mb-5 services">
                    {
                        state.data.map(list =>
                            <button key={list.id} className="card" onClick={() => subServices(list)}>
                                <img className="card-img-top" src={list.image}/>
                                <div className="card-body">
                                    <h2 className="card-title">{list.title}</h2>
                                    <div className="card-text">{list.description}</div>
                                </div>
                            </button>
                        )
                    }  
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Services;