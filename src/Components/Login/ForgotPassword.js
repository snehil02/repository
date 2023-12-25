import React, { Component } from 'react';
import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import { Link } from "react-router-dom";

import './Login.scss'

class ForgetPassword extends Component  {

    constructor(props) {
        super(props);
        this.state = {
            email:'',
            show:'',
            show: false,
            apiMessage:'',
            alertStatus:'',
        }
    }

    /* function for handling user filled data */
    changeEmail = (e) => {
        this.setState({email : e.target.value});
    }
    
    /* Calling Api for changing Password by sending Email */
    sendEmail = () => {
        fetch('/api/api/v1/forgotPassword', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            // 'Authorization': '',
            // 'x-api-key': '',
            },
            body: JSON.stringify({
                email: this.state.email
            })
        })
        .then((Response) => Response.json())
                                .then((result) => {
                                console.log(result);
                                if (result.status_code == 200 ) {
                                    this.setState({email :'', show : true, apiMessage : result.message, alertStatus : 'success'},()=>{
                                        window.setTimeout(()=>{
                                            this.setState({show : false})
                                        },3000)
                                      });
                                }
                                else{
                                    this.setState({show : true, apiMessage : result.message, alertStatus : 'danger'},()=>{
                                        window.setTimeout(()=>{
                                            this.setState({ show : false})
                                        },3000)
                                      });
                                }
                            }
                        )
    };
    render() {
        return (
            <div className='container-fluid reset-pwd'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-12 login-fields'>
                            <div className="container container-xs">
                                <div className="logo"><img src="../../images/Embassy_Logo_png_NMDS_1_square_Blue_1.png"  alt="Company Logo" /></div>
                                <h2 className="text">Reset Password</h2>
                                <input className='form-field' type='email' name='email' placeholder='Email' value={this.state.email} onChange={this.changeEmail.bind(this)}/>
                                <button className='form-button' onClick={this.sendEmail.bind(this)}>Send recovery link</button>
                                <div className="sign-in">Back to Login? <Link to="/login">Sign in</Link></div>
                            </div>
                        </div>
                    </div>
                </div>
                <Alert style={{
                                position: 'fixed',
                                top: 0,
                                right: 0,
                                }}  variant={this.state.alertStatus}
                            onClose={() => this.setState({show : false})} show={this.state.show} dismissible>
                            <Alert.Heading style={{fontSize : "15px"}}>{this.state.apiMessage}</Alert.Heading>
                            {/* <p></p> */}
                </Alert>
            </div>
        )
    }
}
export default ForgetPassword;