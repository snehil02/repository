import React, { Component } from 'react';
import Cookies from "js-cookie";
import Alert from 'react-bootstrap/Alert'

import Navigation from "./Navigation";
import SideBar from "./SideBar";

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            apiData: [],
            countries: '',
            address: '',
            userId: '',
            city: '',
            state:'',
            country: 0,
            zipCode: '',
            email: '',
            phone: 0,
            purchasingForCompany: 0,
            sideMenuOpen: false,
            checked: false,
            show: false,
            apiMessage:'',
            alertStatus:'',
        }
    }

    /* Calling Api for getting all information regarding User */
    componentDidMount () {
        let userIdCookie =  Cookies.get("session");
        this.setState({ loading: true, userId : userIdCookie });
        const apiUrl = `/api/api/v1/getUserSetting?userId=`+ userIdCookie;
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                // 'Access-Control-Allow-Origin': '*',
                // "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                // 'Authorization': 'Basic ZmFjZUFwcDpmYWNlQXBwQDEyMzQ1',
                // 'x-api-key': '9y$B&E)H@McQfTjWnZr4u7x!z%C*F-Ja', 
                'Content-Type': 'application/json'
            }
        })
        .then((res) => res.json())
        .then(data => {
            if (data.status_code === 200){
                // console.log(data.result)
                this.setState({ loading : true,
                    apiData : data.result,
                    address: data.result.address,
                    city: data.result.city,
                    state: data.result.state,
                    zipCode: data.result.zipCode,
                    country: data.result.country,
                    phone: data.result.phone,
                    email: data.result.email,
                    purchasingForCompany: data.result.purchasingForCompany,
                 });
            }
        });

        /* Calling Api for getting all Countries list */
        const apiCountries = `/api/api/v1/getCountry`;
        fetch(apiCountries, {
            method: 'GET',
            headers: {
                // 'Access-Control-Allow-Origin': '*',
                // "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                // 'Authorization': 'Basic ZmFjZUFwcDpmYWNlQXBwQDEyMzQ1',
                // 'x-api-key': '9y$B&E)H@McQfTjWnZr4u7x!z%C*F-Ja', 
                'Content-Type': 'application/json'
            }
        })
        .then((res) => res.json())
        .then(data => {
            if (data.status_code === 200){
                this.setState({ loading : true, countries: data.result });
            }
        });
    };
    handleAddressChange = event => {
        this.setState({address :event.target.value});
    };
    handleCityChange = event => {
        this.setState({city :event.target.value});
    };
    handleCountryChange = event => {
        this.setState({country :event.target.value});
    };
    handleEmailChange = event => {
        this.setState({date :event.target.value});
    };
    handlePhoneChange = event => {
        this.setState({phone :event.target.value});
    };
    handleStateChange = event => {
        this.setState({state :event.target.value});
    };
    handleZipcodeChange = event => {
        this.setState({zipCode :event.target.value});
    };

    /* Calling Api for posting updated info */
    submitChanges = () => {

        fetch('/api/api/v1/updateUserSetting ', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            // 'Authorization': '',
            // 'x-api-key': '',
            },
            body: JSON.stringify({
                email: this.state.email,
                phone: this.state.phone,
                address: this.state.address,
                city: this.state.city,
                country: this.state.country,
                state: this.state.state,
                zipCode: this.state.zipCode,
                purchasingForCompany: 1,
                userId: this.state.userId
            })
        })
        .then((Response) => Response.json())
            .then((res) => {
                console.log(res);
                if (res.status_code === 200){
                    // this.setState(this.initialState);
                    this.setState({show : true, apiMessage : res.message, alertStatus : 'success'},()=>{
                        window.setTimeout(()=>{
                          this.setState({show : false})
                        },3000)
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

    /* Sidebar Toggeling for mobile view */
    sideBarToggle = () => {
        this.setState((prevState) => {
            return {sideMenuOpen : !prevState.sideMenuOpen};
        });
        if (this.state.sideMenuOpen){
            document.body.classList.remove('scroll-stop');
        }
        else {
            document.body.classList.add('scroll-stop');
        }
    };

    /* Checking the checkbox for opting Company */
    onChecked = () => {
        this.setState((prevState) => {
            return {checked : !prevState.checked};
        });
        this.setState({ purchasingForCompany : this.state.purchasingForCompany ? 0 : 1})
        console.log(this.state.purchasingForCompany);
    };

    render() {
        const { loading, countries } = this.state;
        if ( !loading || countries.length === 0 ) 
        return  <div className="spinner-section">
                    <div className="overlay">
                        <div className="overlay__inner">
                            <div className="overlay__content">
                                <span className="spinner"></span>
                            </div>
                        </div>
                    </div>
                </div>;

        let sideClass = 'Container'
        if (this.state.sideMenuOpen) {
            sideClass = 'Container sidebar-open'
        }
        const companyOptions = this.state.checked ? <div className="company-fields">
                                                        <div className="form-row">
                                                            <div className="form-group col-sm-6">
                                                            <input type="text" className="form-control" name="company_name" id="company_name" autoComplete="billing organization"/>
                                                            <div className="help-block">Company</div>
                                                            </div>
                                                            <div className="form-group col-sm-6">
                                                            <input type="text" className="form-control" id="tax_id" name="tax_id"/>
                                                            <div className="help-block optional">Tax ID</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    : null;
        return (
            <div className={sideClass}>
                <SideBar />
                <div className="services col">
                    <Navigation menuButton={this.sideBarToggle} />
                    <div className="content">
                        <div className="container container-sm">
                            <h1>Edit Settings</h1>
                            <form id="settingsForm">
                                <section>
                                    <div className="form-row">
                                        <div className="form-group col-sm-12">
                                        <label htmlFor="email" className="required">Email</label>
                                        <input type="email" className="form-control" id="email" name="email" value={this.state.email} disabled="" required="" onChange={this.handleEmailChange.bind(this)}/>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-sm-12">
                                        <label htmlFor="phone" className="required">Phone</label>
                                        <input type="tel" className="form-control" id="phone" name="phone" value={this.state.phone} required="" onChange={this.handlePhoneChange.bind(this)}/>
                                        </div>
                                    </div>
                                    <div className="form-group-lg address-input" id="address-fields">
                                        <input type="hidden" id="ip-country" />
                                        <label htmlFor="address" className="required">Billing Address</label>
                                        <div className="form-row">
                                        <div className="form-group col-sm-8">
                                            <input type="text" className="form-control" id="address_1" name="address_1" value={this.state.address} autoComplete="billing street-address" required="" onChange={this.handleAddressChange.bind(this)}/>
                                            <div className="help-block">Address</div>
                                        </div>
                                        <div className="form-group col-sm-4">
                                            <input type="text" className="form-control" id="address_city" name="address_city" value={this.state.city} autoComplete="billing address-level2" required="" onChange={this.handleCityChange.bind(this)}/>
                                            <div className="help-block">City</div>
                                        </div>
                                        </div>
                                        <div className="form-row">
                                        <div className="form-group col-sm-4">
                                            <select name="address_country" value={this.state.country} className="form-control" id="address_country" data-live-search="true" autoComplete="billing country" data-live-search-style="startsWith" onChange={this.handleCountryChange.bind(this)}>
                                                <option value="country 1">Select Country...</option>
                                                {
                                                    countries.map(option =>
                                                    <option key={option.id} value={option.id}>{option.countryName}</option>
                                                    )
                                                }
                                            </select>
                                            <div className="help-block">Country</div>
                                        </div>
                                        <div className="form-group col-sm-4">
                                            <input type="text" className="form-control" id="address_state" name="address_state" value={this.state.state} autoComplete="billing address-level1" required="" onChange={this.handleStateChange.bind(this)}/>
                                            
                                            <div className="help-block">State / Province / Region</div>
                                        </div>
                                        <div className="form-group col-sm-4">
                                            <input type="text" className="form-control" id="address_postcode" name="address_postcode" value={this.state.zipCode} autoComplete="billing postal-code" required="" onChange={this.handleZipcodeChange.bind(this)}/>
                                            <div className="help-block">Postal / Zip Code</div>
                                        </div>
                                        </div>
                                        <div className="mt-3 company-checkbox">
                                        <div className="custom-control custom-checkbox">
                                            <input type="checkbox" checked={this.state.checked} onChange={ this.onChecked.bind(this) } className="custom-control-input add-company" name="company" id="company" value="1"/>
                                            <label htmlFor="company" className="custom-control-label mb-3">I'm purchasing for a company</label>
                                            {companyOptions}
                                        </div>
                                        </div>
                                    </div>
                                    <input type="hidden" name="user_id" value="1028"/>
                                    <input type="hidden" name="action" value="settings"/>
                                    <div className="text-right mt-3">
                                        <button type="button" className="btn btn-primary" onClick={this.submitChanges.bind(this)}>
                                        Save changes</button>
                                    </div>
                                </section>
                            </form>
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
export default Settings;