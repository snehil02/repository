import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Alert from 'react-bootstrap/Alert';

import './Login.scss'

class Signup extends Component {

    constructor() {
        super();
        this.state = {
            Firstname: '',
            Lastname: '',
            Email: '',
            Password: '',
            ConfirmPassword:'',
            checkedPassword:'',
            isCheckedTos: false,
            isCheckedOption: false,
            formErrors: {},
            show: false,
            apiMessage:'',
            alertStatus:'',
            checkboxMessage:''
        };
        this.initialState = this.state;    
    }    
    
    /* Adding validations for text editor */
    handleFormValidation() {    
        const { Firstname, Lastname, Email, Password, ConfirmPassword } = this.state;    
        let formErrors = {};    
        let formIsValid = true;    
    
        //First name     
        if (!Firstname) {    
            formIsValid = false;    
            formErrors["firstNameErr"] = "Field is required.";    
        }

        if (!Lastname) {    
            formIsValid = false;    
            formErrors["lastNameErr"] = "Field is required.";    
        }

        if (!Email) {    
            formIsValid = false;    
            formErrors["emailErr"] = "Field is required.";    
        }
        else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(Email))) {    
    
            formIsValid = false;    
            formErrors["emailErr"] = "Invalid email id.";    
        }    

        if (!Password) {    
            formIsValid = false;    
            formErrors["passwordErr"] = "Field is required.";    
        }
        else if (Password.length < 6) {
            formIsValid = false;    
            formErrors["passwordErr"] = "Enter more than 6 letters.";
        }
        if (!ConfirmPassword) {    
            formIsValid = false;    
            formErrors["confirmPasswordErr"] = "Field is required.";    
        }
        else if (ConfirmPassword.length < 6) {
            formIsValid = false;    
            formErrors["confirmPasswordErr"] = "Enter more than 6 letters.";
        }
        else if (ConfirmPassword != Password) {
            formIsValid = false;    
            formErrors["confirmPasswordErr"] = "Please enter same Passwords.";
        }

        this.setState({ formErrors: formErrors });    
        return formIsValid;
    }

    firstname(e) {
        this.setState ({Firstname : e.target.value});
    }
    lastname(e) {
        this.setState ({Lastname : e.target.value});
    }
    email(e) {
        this.setState ({Email : e.target.value});
    }
    password(e) {
        this.setState ({Password : e.target.value});
    }
    ConfirmPassword(e) {
        this.setState ({ConfirmPassword : e.target.value});
    }
    handleChangeTos() {
        this.setState((prevState) => {
            return {isCheckedTos : !prevState.isCheckedTos};
        });
        console.log(this.state.isCheckedTos)
    }
    handleChangeOption() {
        this.setState((prevState) => {
            return {isCheckedOption : !prevState.isCheckedOption};
        });
        console.log(this.state.isCheckedOption)

    }

    /* Calling Api for posting the user filled sign up info. */
    signup(e) {

        if (this.handleFormValidation()) {  
            // if(this.state.password === this.state.ConfirmPassword) {
            //     this.setState({checkedPassword : this.state.ConfirmPassword});
            // }  
            // if (this.state.isCheckedTos === true && this.state.isCheckedOption === true) {
                this.setState({ checkboxMessage : ''});
                return fetch('/api/api/v1/signUp', {
                                method: 'POST',
                                headers: {
                                // 'Accept': 'application/json',
                                'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    firstName: this.state.Firstname,
                                    lastName: this.state.Lastname,
                                    email: this.state.Email,
                                    password: this.state.Password
                                })
                            })
                                .then((Response) => Response.json())
                                .then((result) => {
                                console.log(result);
                                if (result.status_code == 200 ) {
                                    // alert('Account Created Successfully');
                                    this.setState({show : true, apiMessage : result.message, alertStatus : 'success'},()=>{
                                        window.setTimeout(()=>{
                                          this.setState({show : false})
                                        },3000)
                                      });
                                    this.props.history.push({
                                        pathname: `/login`,
                                        state: {
                                            messageReg: result.message,
                                            show: this.state.show
                                        }
                                    });
                                    this.setState(this.initialState);
                                }
                                else{
                                    this.setState({apiMessage : result.message});
                                    // this.setState({show : true, apiMessage : result.message, alertStatus : 'danger'},()=>{
                                    //     window.setTimeout(()=>{
                                    //       this.setState({show : false})
                                    //     },3000)
                                    //   });
                                }
                            }
                        )
                // }   
                // else {
                //     this.setState({ checkboxMessage : 'Please tick the checkboxes before Sign In.'});
                // }
        }    
        
    }

    render() {
        const { firstNameErr, lastNameErr, emailErr, passwordErr, confirmPasswordErr } = this.state.formErrors;
        const checkboxMessage = this.state.checkboxMessage;
        const serverMessage = this.state.apiMessage;
        return (
            <div className='container-fluid login'>
                <div className='container'>
                    <div className='row'>
                        <div className="col-md-6 d-flex align-items-center justify-content-center login-fields">
                            <div className="container container-xs">
                                <div className="logo"><img src="../../images/Embassy_Logo_png_NMDS_1_square_Blue_1.png"  alt="Company Logo"  /></div>
                                <h2 className="text">Lorem ipsum dolor sit amet, invidunt inciderint cu nam</h2>
                                <p style={{color : "red", textAlign: "center"}}>{serverMessage}</p>
                                <div className="form-row">
                                    <div className="col-md-6">
                                        <input type="text" className="form-field" id={firstNameErr ? ' showError' : ''} name="name_f" placeholder="First Name" required="" onChange={this.firstname.bind(this)} />
                                        {firstNameErr && <div style={{ color: "red", paddingBottom: 10 }}>{firstNameErr}</div> }
                                    </div>

                                    <div className="col-md-6">
                                        <input type="text" className="form-field" id={lastNameErr ? ' showError' : ''} name="name_l" placeholder="Last Name" required="" onChange={this.lastname.bind(this)} />
                                        {lastNameErr && <div style={{ color: "red", paddingBottom: 10 }}>{lastNameErr}</div> }
                                    </div>
                                </div>
                                <input className='form-field' type='email' id={emailErr ? ' showError' : ''} name='email' placeholder='Email' onChange={this.email.bind(this)} />
                                {emailErr && <div style={{ color: "red", paddingBottom: 10 }}>{emailErr}</div> }

                                <input className='form-field' type='password' id={passwordErr ? ' showError' : ''} name='password' placeholder='Password' onChange={this.password.bind(this)} />
                                {passwordErr && <div style={{ color: "red", paddingBottom: 10 }}>{passwordErr}</div> }

                                <input className='form-field' type='password' id={confirmPasswordErr ? ' showError' : ''} name='password' placeholder='Confirm Password' onChange={this.ConfirmPassword.bind(this)} />
                                {confirmPasswordErr && <div style={{ color: "red", paddingBottom: 10 }}>{confirmPasswordErr}</div> }

                                <div className="form-group">
                                    <div className="custom-control custom-checkbox">
                                        <input type="checkbox" name="tos" id="tos" className="custom-control-input" onChange={this.handleChangeTos.bind(this)} />
                                        <label className="custom-control-label" htmlFor="tos">I confirm I have read and accepted the <a target="_blank" href="">Terms of Service</a></label>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="custom-control custom-checkbox">
                                        <input type="checkbox" name="option" id="option" className="custom-control-input" onChange={this.handleChangeOption.bind(this)} />
                                        <label className="custom-control-label" htmlFor="option">Join thousands of global citizens with our monthly newsletter full of inspiring stories. View <a target="_blank" href="">Privacy Policy</a></label>
                                    </div>
                                </div>
                                <p style={{color : "red", textAlign: "center"}}>{checkboxMessage}</p>
                                <button className='form-button' onClick={this.signup.bind(this)}>Get Started</button>
                                <div className="sign-in">Already have an account? <Link to="/login">Sign in</Link></div>
                            </div>
                        </div>
                        <div className='col-6 align-items-center justify-content-center d-none d-md-flex'>
                            <ul className="checklist">
                                <li><FontAwesomeIcon icon="check-circle" /><h2>Lorem ipsum dolor sit amet</h2><p>Lorem ipsum dolor sit amet, invidunt inciderint cu nam.</p></li>
                                <li><FontAwesomeIcon icon="check-circle" /><h2>Lorem ipsum dolor sit amet</h2><p>Lorem ipsum dolor sit amet, invidunt inciderint cu nam.</p></li>
                                <li><FontAwesomeIcon icon="check-circle" /><h2>Lorem ipsum dolor sit amet</h2><p>Lorem ipsum dolor sit amet, invidunt inciderint cu nam.</p></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <Alert style={{
                                position: 'fixed',
                                top: 0,
                                right: 0,
                                }}  variant={this.state.alertStatus}
                        onClose={() => this.setState({show : false})} show={this.state.show} dismissible>
                        <Alert.Heading style={{fontSize: "15px"}}>{this.state.apiMessage}</Alert.Heading>
                        {/* <p></p> */}
                </Alert>
            </div>
        )
    }
}
export default Signup;