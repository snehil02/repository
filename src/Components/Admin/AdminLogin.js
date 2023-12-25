import React from 'react';
import { Redirect, Link } from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faArrowLeft, faSpinner, faHome, faConciergeBell, faShoppingCart, faStar, faHandshake, faCreditCard, faFileWord,
            faBell, faCheck } from '@fortawesome/free-solid-svg-icons';

import '../Login/Login.scss';
import setSessionCookie from '../Auth/Cookies';

library.add( faCheckCircle, faArrowLeft, faSpinner, faHome, faConciergeBell, faShoppingCart, faStar, faHandshake, faCreditCard, faFileWord,
    faBell, faCheck )

class AdminLogin extends React.Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            loggedIn: false,
            formErrors: {},
            userId: '',
            firstname: ''
        };
        this.initialState = this.state;
    }
    
    /* Adding validation for Login Form */
    handleFormValidation() {    
        const { email, password } = this.state;    
        let formErrors = {};    
        let formIsValid = true; 

        if (!email) {    
            formIsValid = false;    
            formErrors["emailErr"] = "Field is required.";    
        }
        else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {    
    
            formIsValid = false;    
            formErrors["emailErr"] = "Invalid email id.";    
        }    

        if (!password) {    
            formIsValid = false;    
            formErrors["passwordErr"] = "Field is required.";    
        }

        this.setState({ formErrors: formErrors });    
        return formIsValid;
    }

    /* Getting value when admin enters from input field */
    onChangeField = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    /* Calling admin login Api */
    onSubmit() {

        if (this.handleFormValidation()) {
            fetch('/api/api/v1/adminLogin', {
                method: 'POST',
                headers: {
                 // 'Accept': 'application/json',
                 'Content-Type': 'application/json'
                },
                 body: JSON.stringify({
                     email: this.state.email,
                     password: this.state.password
                 })
            })
            .then((Response) => Response.json())
            .then((res) => {
                console.log(res);
                if (res.status_code === 200){
                    this.setState({userId: res.result.userId, firstname: res.result.firstName});
                    setSessionCookie(this.state.userId, this.state.firstname);
                    this.props.history.push({
                        pathname: '/category',
                        userid: { newUserId: this.state.userId }
                    });
                    this.setState(this.initialState);
                    
                }
                else {
                    this.setState({ invalidCredendials : 'Invalid Username or Password!'});
                }
            })
        }
    }

    render (){
        const { emailErr, passwordErr } = this.state.formErrors;
        const invalidCredendials = this.state.invalidCredendials;
        return (
            <div className='container-fluid login'>
                <div className='container'>
                    <div className='row'>
                        <div className="col-md-12 d-flex align-items-center justify-content-center login-fields">
                            <div className="container container-xs">
                                <div className="logo"><img src="../../images/Embassy_Logo_png_NMDS_1_square_Blue_1.png" alt="Company Name"/></div>
                                <h2 className="text">Admin Login</h2>
                                <p style={{color : "red", textAlign: "center"}}>{invalidCredendials}</p>
                                <input className='form-field' type='email' id={emailErr ? ' showError' : ''} name='email' placeholder='Email' onChange={this.onChangeField.bind(this)} />
                                {emailErr && <div style={{ color: "red", paddingBottom: 10 }}>{emailErr}</div> }
                                <input className='form-field' id={passwordErr ? ' showError' : ''} type='password' name='password' placeholder='Password' onChange={this.onChangeField.bind(this)} />
                                {passwordErr && <div style={{ color: "red", paddingBottom: 10 }}>{passwordErr}</div> }
                                <button className='form-button' onClick={this.onSubmit.bind(this)}>Login</button>
                                <div className='frgt-pwd'>
                                    <Link to='/forgotpassword'>Forgot password?</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default AdminLogin;