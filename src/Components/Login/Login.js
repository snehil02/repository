import React from 'react';
import { Redirect, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Alert from 'react-bootstrap/Alert';

import './Login.scss';
import setSessionCookie from '../Auth/Cookies';

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            loggedIn: false,
            formErrors: {},
            userId: '',
            firstname: '',
            show: false
        };
        this.initialState = this.state;
    };

    componentWillMount() {
        const {show} = (this.props.location && this.props.location.state) || {};
        this.setState({show: show},()=>{
            window.setTimeout(()=>{
              this.setState({show : false})
            },2000)
          });
    };

    /* Adding validations for text editor */
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
    };

    /* Handling the input data */
    onChangeField = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    };

    /* Calling Api for posting the user filled login info. */
    onSubmit() {

        if (this.handleFormValidation()) {    
            fetch('/api/api/v1/login', {
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
                // console.log(res);
                if (res.status_code === 200){
                    this.setState({userId: res.result.userId, firstname: res.result.firstName});
                    if ( res.result.firstLogin === 1 ) {
                        setSessionCookie(this.state.userId, this.state.firstname);
                        this.props.history.push({
                            pathname: '/select-portal',
                            userid: { newUserId: this.state.userId }
                        });
                        this.setState(this.initialState);
                    }
                    else if (res.result.firstLogin === 0 ) {
                        setSessionCookie(this.state.userId, this.state.firstname);
                        // console.log(this.state.userId);
                        // console.log("name", this.state.firstname);
                        this.props.history.push({
                            pathname: '/dashboard',
                            state: { userIdNo: this.state.userId }
                        });
                    }
                }
                else {
                    this.setState({ invalidCredendials : 'Invalid Username or Password!'});
                }
                    
            })    
        }    
    };

    render (){
        const { emailErr, passwordErr } = this.state.formErrors;
        const invalidCredendials = this.state.invalidCredendials;
        const {messageReg} = (this.props.location && this.props.location.state) || {};
        return (
            <div className='container-fluid login'>
                <div className='container'>
                    <div className='row'>
                        <div className="col-md-6 d-flex align-items-center justify-content-center login-fields">
                            <div className="container container-xs">
                                <div className="logo"><img src="../../images/Embassy_Logo_png_NMDS_1_square_Blue_1.png" alt="Company Logo" /></div>
                                <h2 className="text">Login</h2>
                                <p style={{color : "red", textAlign: "center"}}>{invalidCredendials}</p>
                                <input className='form-field' type='email' id={emailErr ? ' showError' : ''} name='email' placeholder='Email' onChange={this.onChangeField.bind(this)} />
                                {emailErr && <div style={{ color: "red", paddingBottom: 10 }}>{emailErr}</div> }
                                <input className='form-field' id={passwordErr ? ' showError' : ''} type='password' name='password' placeholder='Password' onChange={this.onChangeField.bind(this)} />
                                {passwordErr && <div style={{ color: "red", paddingBottom: 10 }}>{passwordErr}</div> }
                                <button className='form-button' onClick={this.onSubmit.bind(this)}>Login</button>
                                <div className='frgt-pwd'>
                                    <Link to='/forgot'>Forgot password?</Link>
                                </div>
                                <div className='create-account'>
                                    <Link to='/signup'>Don't have an account? Get started here.</Link>
                                </div>
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
                                }}  variant="success"
                        onClose={() => this.setState({show : false})} show={this.state.show} dismissible>
                        <Alert.Heading style={{fontSize: "15px"}}>{messageReg}</Alert.Heading>
                        {/* <p></p> */}
                </Alert>
            </div>
        )
    }
}
export default Login;