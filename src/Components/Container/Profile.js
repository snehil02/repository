import React, { Component } from 'react';
import Cookies from "js-cookie";
import Alert from 'react-bootstrap/Alert'

import Navigation from "./Navigation";
import SideBar from "./SideBar";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            apiData: [],
            countries: '',
            userId: '',
            firstname: '',
            lastname: '',
            countryFrom: '',
            countryTo: '',
            date: '',
            currentDate:'',
            image: "../../images/avatar-placeholder.png",
            uploadImage: '',
            sideMenuOpen: false,
            firstAlpha: '',
            show: false,
            apiMessage:'',
            alertStatus:'',
        }
    }

    /* Calling Api for getting all information regarding User */
    componentDidMount () {
        let userIdCookie =  Cookies.get("session");
        this.setState({ loading: true, userId : userIdCookie });
        const apiUrl = `/api/api/v1/getUserAndRoadmapDetails?userId=`+ userIdCookie;
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
                this.setState({ loading : true,
                     apiData : data.result[0],
                    firstname: data.result[0].firstName,
                    lastname: data.result[0].lastName,
                    countryFrom: data.result[0].movingFrom,
                    countryTo: data.result[0].movingTo,
                    date: data.result[0].boarding,
                    image: data.result[0].image
                 });
                let firstAlpha = this.state.firstname.charAt(0);
                this.setState({firstAlpha : firstAlpha});
                if (this.state.image === null) {
                    this.setState({image : "../../images/avatar-placeholder.png"})
                }
            }
        });

        /* Calling Api for getting all Countries list */
        const apiCountries = `/api/api/v1/getCountry`;
        fetch(apiCountries, {
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
                this.setState({ loading : true, countries: data.result });
            }
        });

        this.minDate();
    };

    /* Date Formatting */
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
    handleFirstnameChange = event => {
        this.setState({firstname :event.target.value});
    };
    handleLastnameChange = event => {
        this.setState({lastname :event.target.value});
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
    imageChange = (event) => {
        this.setState({image : URL.createObjectURL(event.target.files[0]), uploadImage : event.target.files[0]});
        // console.log(this.state.image)
    }
    deleteImage = () => {
        this.setState({image : '../../images/avatar-placeholder.png',
                        uploadImage : null})
    }

    /* Calling Api for posting updated info */
    submitChanges = () => {

        const formData = new FormData();

        formData.append('image', 
          this.state.uploadImage, 
        //   this.state.image.URL 
        );
        formData.append('firstName', this.state.firstname);
        formData.append('lastName', this.state.lastname);
        formData.append('movingFrom', this.state.countryFrom);
        formData.append('movingTo', this.state.countryTo);
        formData.append('boarding', this.state.date);
        formData.append('isSendEmail', 0);
        formData.append('userId', this.state.userId);

        fetch('/api/api/v1/updateUserAndRoadmapDetails ', {
            method: 'POST',
            headers: {
                // 'Content-Type': 'application/json',
                // 'Authorization': '',
                // 'x-api-key': '',
                },
            body: formData
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
                    Cookies.set("username", this.state.firstname );
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
    }

    render() {
        const { loading, apiData, countries } = this.state;
        if ( !loading || apiData === [] || countries.length === 0 ) 
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
        return (
            <div className={sideClass}>
                <SideBar />
                <div className="services col">
                    <Navigation menuButton={this.sideBarToggle}/>
                    <div className="content">
                        <div className="container container-sm">
                            <h1>Edit Profile</h1>
                            <div className="profile-pic mb-4 text-center"><img src={this.state.image} id="userImage" alt="userImage"/></div>
                            <form role="form" method="post" action="/portal/profile" data-pjax="">
                                <input type="hidden" name="spp_token" value="d703da0864686836b2c8481cb025542b" id="spp_token"/>
                                <section>
                                    {/* <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <a href="/portal/profile/email" className="btn btn-outline-secondary btn-block text-left" data-toggle="modal" data-target="#spp-modal">
                                        dream8user@gmail.com            </a>
                                    </div> */}
                                    <div className="form-group">
                                        <label>Password</label>
                                        <span className="btn btn-outline-secondary btn-block text-left" data-toggle="modal" data-target="#spp-modal">••••••••</span>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-sm-6">
                                            <label htmlFor="name_f">First Name</label>
                                            <input type="text" className="form-control" id="name_f" name="name_f" value={this.state.firstname} required="" onChange={this.handleFirstnameChange.bind(this)}/>
                                        </div>
                                        <div className="form-group col-sm-6">
                                            <label htmlFor="name_l">Last Name</label>
                                            <input type="text" className="form-control" id="name_l" name="name_l" value={this.state.lastname} onChange={this.handleLastnameChange.bind(this)}/>
                                        </div>
                                    </div>
                                    <div className="form-row mt-3">
                                        <div className="form-group col-md-6 d-flex align-items-center">
                                            <div className="avatar css-avatar">{this.state.firstAlpha}</div>
                                            <div className="ml-2 nowrap">
                                            <div className="btn btn-secondary" data-toggle="file" data-target="#avatar" data-status=".upload-status">
                                                <input type="file" accept="image/*" onChange={this.imageChange.bind(this)} />
                                                Upload photo                        
                                            </div>
                                            <button type="button" className="btn btn-secondary ml-2" data-remove="#avatar" disabled="" onClick={this.deleteImage.bind(this)}>
                                                Delete photo
                                            </button>
                                            <input type="hidden" name="avatar" id="avatar"/>
                                            </div>
                                        </div>
                                        <div className="form-group col-md-6">
                                            <div className="upload-status flex-fill ml-md-3"></div>
                                        </div>
                                    </div>
                                </section> 

                                <section className="custom-section-1">
                                    <div className="form-row">
                                        <div className="form-group form-group-lg col-sm-12">
                                            <label htmlFor="field_3" className="optional">Where are you moving from?</label>
                                            <select name="address_country" value={this.state.countryFrom} className="form-control" id="address_country" data-live-search="true" autoComplete="billing country" data-live-search-style="startsWith"  onChange={this.handleMovingFromChange.bind(this)}>
                                                <option value="default">Select Country...</option>
                                                {
                                                    countries.map(option =>
                                                    <option key={option.id} value={option.id}>{option.countryName}</option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group form-group-lg col-sm-12">
                                            <label htmlFor="field_3" className="optional">Where are you moving to?</label>
                                            <select name="address_country" value={this.state.countryTo} className="form-control" id="address_country" data-live-search="true" autoComplete="billing country" data-live-search-style="startsWith" onChange={this.handleMovingToChange.bind(this)}>
                                                <option value="default">Select Country...</option>
                                                {
                                                    countries.map(option =>
                                                    <option key={option.id} value={option.id}>{option.countryName}</option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group form-group-lg col-sm-12">
                                            <label htmlFor="field_6" className="optional">When are you moving?</label>
                                            <input type="date" className="form-control data-input" name="field_6" id="field_6" placeholder="" min={this.state.currentDate} value={this.state.date} onChange={this.handleDateChange.bind(this)}/>
                                        </div>
                                    </div>
                                </section>
                                
                                <section className="custom-section-2">
                                    <div className="custom-control custom-checkbox mt-3">
                                        <input type="checkbox" name="email_notifications" value="1" id="email_notifications" className="custom-control-input" />
                                        <label className="custom-control-label" htmlFor="email_notifications">Email me when my requests or help desk tickets are updated.</label>
                                        <div className="help-block">If you disable email updates you'll need to log in to read our replies.</div>
                                    </div>
                                    <div className="mt-4 hide-js" id="request-notifications" style={{display: 'block'}}>
                                        <button type="button" className="btn btn-secondary">
                                            <i className="fas fa-bell mr-1" aria-hidden="true"></i>
                                            Allow desktop notifications
                                        </button>
                                    </div>
                                </section>
                                <div className="text-right mt-3">
                                    <button type="button" className="btn btn-primary" onClick={this.submitChanges.bind(this)}>Save changes</button>
                                </div>
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
export default Profile;