import React, { useContext, useEffect, useState } from 'react';
import { Link, useHistory } from "react-router-dom";
import { CartContext } from './CartContext';
import Cookies from "js-cookie";
import Alert from 'react-bootstrap/Alert';

import Navigation from "./Navigation";
import SideBar from "./SideBar";
import NotificationsDataService from "../FirebaseService";

const Cart = () => {
    const [state, setState] = useState({
        sideMenuOpen: false,
        requests:null,
        show: false,
        apiMessage:'',
        alertStatus:'',
        submitted: false,
        subCategoryId:''
      });
    
    let userId = Cookies.get('session');

    const [cart, setCart] = useContext(CartContext);

    /* Calculating the total price of Cart */
    const totalPrice = cart.reduce((acc, cur) => {
        return parseFloat(acc + cur.price * (cur.quantity || 1));
      }, 0);

    /* Removing cart Item */
    const removeRequest = (id) => {
        return[
            setCart(prevsetData => [...prevsetData.slice(0, id), ...prevsetData.slice(id + 1)])
            ]
    }

    /* Below function call to create Objects of products requested */
    useEffect(() => {
        var requests = [];   
        cart.map(item => {
            let isPayment = item.price === null ? 0 : 1;
            var obj = {};
            obj["subCategoryId"] = item.id;
            obj["userId"] = userId;
            obj["isPayment"] = isPayment;
            requests.push(obj);
            
            setState({subCategoryId : item.id});
            // console.log(state.subCategoryId);
        });
        setState({requests : requests});
    },[cart]);

    /* Sending Notification to Admin on requeting any Service */
    const saveNotifications = () => {
        let data = {
          userRole: 1,
          message: "New Request added",
          user: userId,
        //   requestId: state.subCategoryId
        };
    
        NotificationsDataService.create(data)
          .then(() => {
            console.log("Created new item successfully!");
            setState({
              submitted: true,
            });
        })
        .catch((e) => {
            console.log(e);
        });
    };

    /* Requesting for new Service */
    const addRequest = () => {

        const apiUrl = `/api/api/v1/addNewRequest`;
        fetch(apiUrl, {
        method: 'POST',
                    headers: {
                    // 'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        requestdetails: state.requests
                    })
                })
                .then((Response) => Response.json())
                .then((result) => {
                console.log(result);
                if (result.status_code == 200 ) {
                    setState({show : true, apiMessage : result.message, alertStatus : 'success'},()=>{
                        window.setTimeout(()=>{
                            setState({show : false})
                        },4000)
                        });
                    saveNotifications();
                }
                else{
                    setState({show : true, apiMessage : result.message, alertStatus : 'danger'},()=>{
                        window.setTimeout(()=>{
                            setState({show : false})
                        },4000)
                        });
                }
            })
            setCart([]);
    };

    /* Sidebar Toggeling for mobile view */
    const sideBarToggle = (event) => {
        event.preventDefault();
        setState((prevState) => {
            return {sideMenuOpen : !prevState.sideMenuOpen};
        });
        if (state.sideMenuOpen){
            document.body.classList.remove('scroll-stop');
        }
        else {
            document.body.classList.add('scroll-stop');
        }
    };
    
    let sideClass = 'Container'
        if (state.sideMenuOpen) {
            sideClass = 'Container sidebar-open'
    };

    return (
        <div className={sideClass}>
            <SideBar />
            <div className="requests col">
                <Navigation menuButton={sideBarToggle} />
                <div className="content">
                <div className="back">
                    <Link to="/services">
                        <i className="fas fa-angle-left" aria-hidden="true"></i>
                        Services
                    </Link>
                </div>
                    <div className="container">
                        <h1>Request Cart</h1>
                        <div className="requests-cart">
                            <form role="form" method="post" action="/cart" className="cart" id="cart">
                                <input type="hidden" name="spp_token" value="c0117df6499cb0731cddb57f89d99af3" id="spp_token"/>
                                <section>
                                    {/* <!-- Cart items --> */}
                                    <h1>Make a Request</h1>
                                    <p>Lorem ipsum dolor sit amet, invidunt inciderint cu nam, simul habemus complectitur cu his</p>
                                    <br/>
                                    {
                                        cart.map((item, i) =>
                                        <div key={i} className="form-row form-group">
                                            <div className="col-md-8 col-6">
                                                <strong>
                                                    {item.title}
                                                    </strong>
                                                <div className="help-block">
                                                €{item.price}
                                                </div>
                                            </div>
                                            <div className="col-md-4 col-6">
                                                <div className="form-inline">
                                                    <label className="ml-auto mr-2 text-muted">×</label>
                                                    <input type="text" className="form-control" name="quantity[0]" id="quantity" value={item.quantity}/>
                                                    {/* <a href="/cart/remove/0" className="btn btn-link btn-sm ml-4 d-none d-sm-block" data-pjax="">
                                                    Remove
                                                    </a> */}
                                                    <span className="btn btn-link btn-sm ml-4 d-none d-sm-block" data-pjax="" onClick={() => removeRequest(i)}>
                                                    Remove
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        )
                                    } 
                                    <hr/>
                                    <div className="form-row">
                                    {/* <!-- Subtotal and total --> */}
                                    <div className="col-lg-6 col-md-4 col-sm-8 col-6 text-right">
                                        <p className="text-muted">Subtotal</p>
                                        <p className="text-muted">
                                            <abbr title="You can change your billing country on the next page">Rest of the world</abbr>
                                            0%
                                        </p>
                                        <div className="strong">Total</div>
                                    </div>
                                    {/* <!-- Tax --> */}
                                    <div className="col-md-2 col-sm-4 col-6 text-right">
                                        <p>€{totalPrice}</p>
                                        <p>0</p>
                                        <div className="strong">€{totalPrice}</div>
                                    </div>
                                    {/* <!-- Coupon --> */}
                                    <div className="col-lg-4 col-md-6 order-md-first form-group">
                                        {/* <!-- Hide link if applied already --> */}
                                        <p className="">
                                            <a href="#cart-coupon" className="text-muted" id="coupon">
                                            Have a coupon?
                                            </a>
                                        </p>
                                        {/* <!-- Coupon input shown on click --> */}
                                        <div className="hide-js" id="cart-coupon">
                                            <div className="input-group">
                                                <input type="text" className="form-control " name="coupon" />
                                                <div className="input-group-append">
                                                <button type="button" className="btn btn-secondary">
                                                Apply
                                                </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                    <input type="hidden" name="pay" value="1"/>
                                    <div className="form-row mt-5">
                                    {/* <!-- Checkout button --> */}
                                    <div className="col-sm-4 col-xl-3">
                                        <button type="button" className="btn btn-primary btn-lg btn-block" onClick={()=> addRequest()}>
                                            Submit Requests
                                        </button>
                                    </div>
                                    {/* <!-- Return button --> */}
                                    <div className="col-sm-8 col-xl-9 order-sm-first">
                                        <Link to="/services" className="btn btn-link pl-0">
                                            Add more services
                                        </Link>
                                    </div>
                                    </div>
                                </section>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Alert style={{position: 'fixed',
                            top: 0,
                            right: 0,
                            }}  variant={state.alertStatus}
                onClose={() => setState({show : false})} show={state.show} dismissible>
                <Alert.Heading style={{fontSize: "15px"}}>{state.apiMessage}</Alert.Heading>
                {/* <p></p> */}
            </Alert>
        </div>
    )
}
export default Cart;