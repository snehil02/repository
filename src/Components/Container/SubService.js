import React, { Component, createRef, useContext } from 'react';
import { useState } from 'react';
import { Link } from "react-router-dom";

import { CartContext } from './CartContext'
import Navigation from "./Navigation";
import SideBar from "./SideBar";

const SubService = props => {

  const [state, setState] = useState({
    sideMenuOpen: false,
    quantity: ''
  });

  const [cart, setCart] = useContext(CartContext); 

  /* Calculating the total price of Cart */
  const totalCartPrice = cart.reduce((acc, cur) =>  acc + cur.price * (cur.quantity || 1), 0);
   
  function modalId(id) {  
    const value = "#" + id;
    return value;
  }

  /* Adding new Service into Cart */
  const addToCart = (id, title, price) => {
    // console.log('working', id);
    const newObj = {id : id, title : title, price : price, quantity : 1 }
    const productInCart = cart.find(item => item.id == id);
    if(!productInCart) return  setCart((prevsetData) =>  [...prevsetData, newObj ]);
    return setCart(cart.map(item => {
      if (item.id === id) {
        return item.quantity ? { ...item, quantity: item.quantity + 1 } : { ...item, quantity: 2};
      }
      return item;
    })
    );
  }

  /* Removing Service from Cart */
  const removeRequest = (id) => {
    return[
      setCart(prevsetData => [...prevsetData.slice(0, id), ...prevsetData.slice(id + 1)])
    ]
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
  }
  // console.log('working', cart);
  
  let sideClass = 'Container'
        if (state.sideMenuOpen) {
            sideClass = 'Container sidebar-open'
  };

  // const quantityChange = (event) => {
  //   setState({quantity : event.target.value});
  //   console.log(state.quantity);
  // };

  const {subCategory} = (props.location && props.location.state) || {};
    return (
      <div className={sideClass}>
        <SideBar />
        <div className="services col">
          <Navigation menuButton={sideBarToggle}/>
          <div className="content">
                <div className="header-container responsive">
                  <div className="back">
                      <Link to="/services">
                          <i className="fas fa-angle-left" aria-hidden="true"></i>
                          Services
                      </Link>
                  </div>
                    <Link to="/cart" className="btn btn-primary" >
                      View Cart | 
                      <span id="cart-count">{cart.length}</span>
                    </Link>
                </div>
                <div className="grid-wrapper mb-5 services">
                {
                  subCategory.map(item =>
                    <div key={item.id}>
                      <div className="card" data-toggle="modal" data-target={modalId(item.subCategory_id)}>
                          <img className="card-img-top" src={item.image}/>
                          <div className="card-body">
                              <h2 className="card-title">{item.title}</h2>
                              <div className="card-text">{item.description}</div>
                          </div>
                      </div>
                      <div className="modal service-modal fade" id={item.subCategory_id}>
                        <div className="modal-dialog modal-lg">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title">{item.title}</h5>
                              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                            <div className="modal-body">
                              {item.message}
                            </div>
                            <div className="modal-footer">
                              <button type="button" className="btn btn-primary" data-toggle="modal" data-dismiss="modal" data-target="#cart" onClick={()=> addToCart(item.id, item.title, item.price)}>Select</button>
                              
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }  
              </div>
             
              <div className="modal requests-modal fade" id="cart">
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                  <form role="form" className="cart" >
                    <input type="hidden" name="spp_token" id="spp_token"/>
                    <section>
                        {/* <!-- Cart items --> */}
                        <h1>Make a Request</h1>
                        <p> Your free personal moving assistant will get started on your request once you submit your service request cart.</p>
                        <br/>
                        {
                          cart.map((item, i) =>
                            <div key={i} className="form-row form-group display-item">
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
                                    <span type="text" className="" name="quantity" id="quantity">{item.quantity}</span>
                                    {/* <input type="text" className="form-control" name="quantity" onChange={quantityChange} id="quantity" value={item.quantity}/> */}
                                    <span className="btn btn-link btn-sm ml-4 d-none d-sm-block" data-pjax="" onClick={() => removeRequest(i)}>
                                    Remove
                                    </span>
                                    {/* <a href="/cart/remove/0" className="btn btn-link btn-sm ml-4 d-none d-sm-block" data-pjax="">
                                    Remove
                                    </a> */}
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
                              <p>€{totalCartPrice}</p>
                              <p>0</p>
                              <div className="strong">€{totalCartPrice}</div>
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
                        <input type="hidden" name="pay" />
                        <div className="form-row mt-5">
                          {/* <!-- Checkout button --> */}
                          <div className="col-sm-4 col-xl-3">
                              <button type="submit" className="btn btn-primary btn-lg btn-block" data-dismiss="modal" onClick={() => props.history.push("/cart")}>
                              Submit Requests
                              </button>
                          </div>
                          {/* <!-- Return button --> */}
                          <div className="col-sm-8 col-xl-9 order-sm-first">
                              <Link to="/services" className="btn btn-link pl-0" data-dismiss="modal">
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
        </div>
      </div>
    )
}
export default SubService;