import React, { Component } from 'react';
import { useEffect, useState } from 'react';
import { Redirect, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './UserInfo.scss';

class SelectPortal extends Component {

    constructor(props){
        super(props);
        this.state = {
            loading: false,
            data: null,
            checkedValue: [],
            userId: ''
        }
    }

    /* Calling Api for getting sub-categories and display on first time signing. */
    componentDidMount() {
        const {newUserId} = (this.props.location && this.props.location.userid) || {};
        this.setState({ loading: true });
        const apiUrl = `/api/api/v1/getSubCategory`;
        fetch(apiUrl, {
            method: 'GET',
            // headers: {
            //     // 'Access-Control-Allow-Origin': '*',
            //     // 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            //     // 'Authorization': '',
            //     // 'x-api-key': '', 
            //     // 'Content-Type': 'application/json'
            // }
        })
        .then((res) => res.json())
        .then(data => { 
            this.setState({ loading: false, data: data.result, userId: newUserId });
        });
    }

    handleChange = (e) => {
        const target = e.target;
        var value = target.value;
        
        if(target.checked){
            this.state.checkedValue[value] = value;   
        }else{
            this.state.checkedValue.splice(value, 1);
        }
    };

    /* Redirecting to reallocating page to fill further information */
    onSubmit = (checkedValue, userId) => {
        this.props.history.push({
            pathname:'/reallocateDetails',
            state:{checkedValue : checkedValue,
                    newUserId : userId}
        })
    };
    
    render () {
        if (!this.state.data || this.state.data.length === 0) 
        return <div className="spinner-section">
        <div className="overlay">
            <div className="overlay__inner">
                <div className="overlay__content">
                    <span className="spinner"></span>
                </div>
            </div>
            </div>
        </div>
    
        return (
            <div className="content">
                <div className="logo"><img src="../../images/Embassy_Logo_png_NMDS_1_square_Blue_1.png" alt="Company Logo" /></div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 offset-md-2">
                            <center>
                                <h2>What relocation assistance do you need?</h2>
                                <p>Select all that apply.</p>
                                <br/>
                            </center>
                            <div id="row-service">
                                {
                                    this.state.data.slice(0, 20).map(cat =>
                                        <div className="service-item" key={cat.id}>
                                            <div className="checkbox-item">
                                                <input type="hidden" value="0" name={cat.title} />
                                                <input type="checkbox" id={cat.id} name={cat.title} value={cat.id} onChange={this.handleChange.bind(this)} />
                                                <label htmlFor={cat.id}><FontAwesomeIcon className="icon" icon="passport" color="#15a1f8" />{cat.title}
                                                </label>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-actions">
                    <button className="next btn" onClick={() => this.onSubmit(this.state.checkedValue, this.state.userId)}>
                    Next
                        {/* <Link to={{
                            pathname:'/reallocateDetails',
                            state:{checkedValue : this.state.checkedValue,
                                    newUserId : this.state.userId}
                            }} >Next</Link> */}
                    </button>
                </div>
            </div>
        )
    }
}
export default SelectPortal;