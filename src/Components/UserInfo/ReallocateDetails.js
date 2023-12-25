import React, { Component, useContext, useEffect, useState } from 'react';
import { Redirect, Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Cookies from "js-cookie";
import Alert from 'react-bootstrap/Alert';

import './UserInfo.scss';
import AuthApi from '../Auth/Auth';


class ReallocateDetails extends Component {

    constructor(props){
        super(props);
        this.state = {
            countries: '',
            firstName : '',
            lastName : '',
            countryFrom: '',
            countryTo: '',
            date: '',
            formErrors: {},
            subCategory: null,
            newUserId: '',
            currentDate:'',
            show: false,
            apiMessage:'',
            alertStatus:'',
        }
    }
    
    /* Calling Api for getting all Countries list and User's info(firstname and lastname) */
    componentDidMount () {
        const {checkedValue, newUserId} = (this.props.location && this.props.location.state) || {};
        let userId = Cookies.get("session");
        const apiUrlCountries = `/api/api/v1/getCountry`;
        fetch(apiUrlCountries, {
            method: 'GET',
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
                if (data.status_code === 200){
                    this.setState({ countries: data.result });
                    console.log(this.state.countries)
                }
            });

        const apiUrl = `/api/api/v1/getFirstNameLastName?userId=` + userId;
        fetch(apiUrl, {
            method: 'GET',
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
                if (data.status_code === 200){
                    console.log(data.result.firstName)
                    this.setState({ firstName: data.result.firstName,
                                lastName: data.result.lastName });
                    console.log(this.state.firstName)
                    console.log(this.state.lastName)
                }
            });

            // console.log("user",userId);
            // const history = useHistory();
            // console.log('newuser', newUserId)
            var filterArray = checkedValue.filter(function (el) {
                return el != null;
            })
            
            var intFilterArray = filterArray.map((i) => Number(i));
            
            // let subCategory = filterArray.map(val => {
            //     let properties = {
            //         "subCategoryId" : val
            //     };
            //     return properties;
            // });
            // let newArr = subCategory.push
            // const newcat = JSON.stringify(subCategory);

            var subCategory = [];   
            
            filterArray.map(val => {
            var obj = {};
            obj["subCategoryId"] = val;
            subCategory.push(obj);
            });
            this.setState({subCategory : subCategory, newUserId: userId});

            this.minDate();
    }
    
    /* Adding validations for form */
    handleFormValidation = () => {    
        const { firstName, lastName, countryFrom, countryTo, date } = this.state;    
        let formErrors = {};    
        let formIsValid = true;    
    
        //First name     
        if (!firstName) {    
            formIsValid = false;    
            formErrors["firstNameErr"] = "Field is required.";    
        }

        if (!lastName) {    
            formIsValid = false;    
            formErrors["lastNameErr"] = "Field is required.";    
        }

        if (!countryFrom) {    
            formIsValid = false;    
            formErrors["countryFromErr"] = "Field is required.";    
        }

        if (!countryTo) {    
            formIsValid = false;    
            formErrors["countryToErr"] = "Field is required.";    
        }

        if (!date) {    
            formIsValid = false;    
            formErrors["dateErr"] = "Field is required.";    
        }

        this.setState({ formErrors: formErrors });    
        return formIsValid;
    }
    handleFirstNameChange = event => {
        this.setState({firstName :event.target.value});
    };
    handleLastNameChange = event => {
        this.setState({lastName :event.target.value});
    };
    handleMovingFromChange = event => {
        this.setState({countryFrom :event.target.value});
    };
    handleMovingToChange = event => {
        this.setState({countryTo :event.target.value});
    };
    handleDateChange = event => {
        this.setState({date :event.target.value});
    };
    // handleInputChange = event => {
    //     const { name, value } = event.target;
    //     setState(prevState => ({
    //       ...prevState,
    //       [name]: value
    //     }));
    // };

    /* Setting minimum Date */
    minDate = () => {
        var dtToday = new Date();
        var month = dtToday.getMonth() + 1;
        var day = dtToday.getDate();
        var year = dtToday.getFullYear();
        if(month < 10)
            month = '0' + month.toString();
        if(day < 10)
            day = '0' + day.toString();
        var maxDate = year + '-' + month + '-' + day;
        // alert(maxDate);
        this.setState({currentDate : maxDate});
    };

    /* Calling Api for user filled info after first time signing up. */
    handleSubmit = () => {

        if (this.handleFormValidation()) {
            fetch('/api/api/v1/addRoadMap', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                //   'Authorization': '',
                // 'x-api-key': '9y$B&E)H@McQfTjWnZr4u7x!z%C*F-Ja',
                },
                body: JSON.stringify({
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    movingFrom: this.state.countryFrom,
                    movingTo: this.state.countryTo,
                    boarding: this.state.date,
                    userId: this.state.newUserId,
                    knowYet:"1",
                    requestdetails: this.state.subCategory
                })
            })
            .then((Response) => Response.json())
                .then((res) => {
                    // console.log(res);
                    if (res.status_code === 200){
                        this.props.history.push({
                            pathname: '/dashboard'
                        });
                    }
                    else{
                        this.setState({show : true, apiMessage : res.message, alertStatus : 'danger'},()=>{
                            window.setTimeout(()=>{
                              this.setState({show : false})
                            },3000)
                          });
                    }
                })
            
        }
    };

    render() {
    
        const { firstNameErr, lastNameErr, countryFromErr, countryToErr, dateErr } = this.state.formErrors;
        if (!this.state.countries || this.state.countries.length === 0 || !this.state.firstName || !this.state.lastName) 
            return <div className="spinner-section">
                        <div className="overlay">
                            <div className="overlay__inner">
                                <div className="overlay__content">
                                    <span className="spinner"></span>
                                </div>
                            </div>
                        </div>
                    </div>;
        return (
            <div className="content">
                <div className="logo"><img src="../../images/Embassy_Logo_png_NMDS_1_square_Blue_1.png" alt="Company Name" /></div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 offset-md-3">
                            <center>
                                <h2 style={{ marginTop: "30px"}}>Let's build your moving roadmap</h2>
                                <p>Your personal moving assistant will get started soon.</p>
                                <br/>
                            </center>
                            <div className="form-row">
                                <div className="form-group col-sm-6">
                                    <label className="required">First Name</label>
                                    <input type="text" className="form-control" id={firstNameErr ? ' showError' : ''} name="firstname" value={this.state.firstName} onChange={this.handleFirstNameChange.bind(this)}/>
                                    {firstNameErr && <div style={{ color: "red", paddingBottom: 10 }}>{firstNameErr}</div> }
                                </div>
                                <div className="form-group col-sm-6">
                                    <label className="required">Last Name</label>
                                    <input type="text" className="form-control" id={lastNameErr ? ' showError' : ''} name="lastname" value={this.state.lastName} onChange={this.handleLastNameChange.bind(this)}/>
                                    {lastNameErr && <div style={{ color: "red", paddingBottom: 10 }}>{lastNameErr}</div> }
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-sm-12">
                                    <label className="required">Where are you moving from?</label>
                                    <div className="" >
                                        <select className="list-dropdown" id={countryFromErr ? ' showError' : ''} name="countryFrom" onChange={this.handleMovingFromChange.bind(this)}>
                                            <option value="country 1">Select Country...</option>
                                            {
                                                this.state.countries.map(option =>
                                                <option key={option.id} value={option.id}>{option.countryName}</option>
                                                )
                                            }
                                        </select>
                                        {countryFromErr && <div style={{ color: "red", paddingBottom: 10 }}>{countryFromErr}</div> }
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-sm-12">
                                    <label className="required">Where are you moving to?</label>
                                    <div className="" >
                                        <select className="list-dropdown" id={countryToErr ? ' showError' : ''} name="countryTo" onChange={this.handleMovingToChange.bind(this)}>
                                        <option value="country 1">Select Country...</option>
                                            {
                                                this.state.countries.map(option =>
                                                <option key={option.id} value={option.id}>{option.countryName}</option>
                                                )
                                            }
                                        </select>
                                        {countryToErr && <div style={{ color: "red", paddingBottom: 10 }}>{countryToErr}</div> }
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-sm-12" data-field="6">
                                    <label>When are you moving?</label>
                                    <input type="date" className="form-control date-input" id={dateErr ? ' showError' : ''} name="date" id="" placeholder="" min={this.state.currentDate} data-date-format="MM d, yyyy" onChange={this.handleDateChange.bind(this)}/>
                                    {dateErr && <div style={{ color: "red", paddingBottom: 10 }}>{dateErr}</div> }
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="checkbox">
                                    <label>
                                        <input type="hidden" value="0" name="field_8" />
                                        <input type="checkbox" value="1" id="field_8" name="field_8" /> I don't know yet
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-actions">
                    <button type="button" className="next btn" onClick={this.handleSubmit.bind(this)}>Submit</button>
                </div>
                <button type="button" className="previous btn" onClick={() => { this.props.history.goBack(); }}><FontAwesomeIcon icon="arrow-left" /></button>
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
ReallocateDetails.contextType = AuthApi;
export default ReallocateDetails;