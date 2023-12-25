import InputMoment from "input-moment";
import moment from 'moment';
import React, { Component } from "react";
import 'input-moment/dist/input-moment.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Cookies from "js-cookie";

import Navigation from "./Navigation";
import SideBar from "./SideBar";
import { contains } from "jquery";

class Consultation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sideMenuOpen: false,
            m : moment(),
            saved: false,
            userId: '',
            firstname:'',
            lastname:'',
            date: '',
            time: '',
            name: '',
            email: '',
            phone: '',
            question: '',
            startDateTime: '',
            endDateTime: '',
            createdDate: '',
            currentDate:''
        }
    }

    /* Calling Api for for getting all information required for filling consultation form */
    componentDidMount(){
        let userIdCookie =  Cookies.get("session");
        this.setState({userId : userIdCookie, createdDate : this.state.m.format("YYYY-MM-DD hh:mm:ss")});
        const apiUrl = `/api/api/v1/getUserSetting?userId=`+ userIdCookie;
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
                console.log(data.result)
                this.setState({ loading : true,
                    apiData : data.result,
                    name : data.result.firstName +' '+ data.result.lastName,
                    lastname: data.result.lastName,
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
        this.minDate();
    };

    /* Setting start Date */
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
    
    handleNameChange = event => {
        this.setState({name :event.target.value});
    };
    handleEmailChange = event => {
        this.setState({email :event.target.value});
    };
    handlePhoneChange = event => {
        this.setState({phone :event.target.value});
    };
    handleTextChange = event => {
        this.setState({question :event.target.value});
    };

    /* Sidebar Toggeling for mobile view */
    sideBarToggle = (event) => {
        event.preventDefault();
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

    handleChange = m => {
        this.setState({ m });
    };
    
    /* Formatting Date */
    confirmDate = () => {
        this.setState((prevState) => {
            return {saved : !prevState.saved};
        });

        const minutes = this.state.m.format('mm');
        const hour = this.state.m.format('hh');
        const onlyDate = this.state.m.format('YYYY-MM-DD');
        const addTime = parseInt(minutes) + 15;
        this.setState({endDateTime : onlyDate +' '+ hour +':'+ addTime +':00' })
        this.setState({date : this.state.m.format('llll')})
        this.setState({time : this.state.m.format('LT')})
        this.setState({startDateTime : this.state.m.format("YYYY-MM-DD hh:mm:ss")})
    };

    /* Calling Api for scheduling event for Consultaion */
    scheduleEvent = (e) => {
        e.preventDefault();

        fetch('/api/api/v1/addConsultation', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            //   'Authorization': '',
            // 'x-api-key': '9y$B&E)H@McQfTjWnZr4u7x!z%C*F-Ja',
            },
            body: JSON.stringify({
                userId: this.state.userId,
                startDateTime: this.state.startDateTime,
                endDateTime: this.state.endDateTime,
                name: this.state.name,
                email: this.state.email,
                phone: this.state.phone,
                question: this.state.question,
            })
        })
        .then((response) => response.json())
        .then(data => {
            if (data.status_code === 200 ) {
                // alert('Account Created Successfully');
                this.setState({show : true, apiMessage : data.message, alertStatus : 'success'},()=>{
                    window.setTimeout(()=>{
                      this.setState({show : false})
                    },3000)
                  });
                  this.props.history.push({ pathname:"/dashboard"});
            }
            else{
                this.setState({show : true, apiMessage : data.message, alertStatus : 'danger'},()=>{
                    window.setTimeout(()=>{
                      this.setState({show : false})
                    },3000)
                  });
            }
        })
    };

    render() {    
        
    let sideClass = 'Container'
    if (this.state.sideMenuOpen) {
        sideClass = 'Container sidebar-open'
    };  
    const date = this.state.date.substring(0,17);
    const minutes = this.state.m.format('mm');
    const hours = this.state.m.format('h');
    const hour = this.state.m.format('hh');
    const onlyDate = this.state.m.format('YYYY-MM-DD');
    const addTime = parseInt(minutes) + 15;
    const ampm = this.state.time.slice(-2);
    // console.log(this.state.m.format("YYYY-MM-DD hh:mm:ss"))



    const details = this.state.saved ?  <div className="row container mx-5">
                                            <div className="col-4" style={{borderRight: '1px solid #4d50551a'}}>
                                                <div className="row"  style={{borderBottom: '1px solid #4d50551a'}}>
                                                    <div className="col-12 display-details">
                                                        <button aria-label="Go to previous page" className="btn-back" type="button" onClick={this.confirmDate}><FontAwesomeIcon icon="arrow-left" /></button>
                                                        <div className="header-area">
                                                            <div className="logo-img"><img  src="../../images/Embassy_Logo_png_NMDS_1_square_Blue_1.png"  alt="Company logo" className=""/></div>
                                                        </div>
                                                    </div>  
                                                </div>
                                                <div className="row">
                                                    <div className="col-12 display-details">
                                                        <h4 className="">Company Name</h4>
                                                        <h1 className="">Consultation</h1>
                                                        <div className="details">
                                                            <div className="row-details"><FontAwesomeIcon icon="clock" /><span>15&nbsp;min</span></div>
                                                            <div className="row-details"><FontAwesomeIcon icon="video" /><span>Web conferencing details provided upon confirmation.</span></div>
                                                            <div className="row-details time"><FontAwesomeIcon icon="calendar-week" /><span>{this.state.time} - {hours}:{addTime} {ampm}, {date}</span></div>
                                                            <div className="row-details"><FontAwesomeIcon icon="globe-asia" /><span>India Standard Time</span></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-8 form">
                                                <h2>Enter Details</h2>
                                                <form className="form-details">
                                                    <div className="field-set">
                                                        <label className="label-name" >Name</label>
                                                        <input className="" type="text" name="name" value={this.state.name} onChange={this.handleNameChange.bind(this)} />
                                                    </div>
                                                    <div className="field-set">
                                                        <label className="label-name">Email</label>
                                                        <input className="" type="email" name="email" value={this.state.email} onChange={this.handleEmailChange.bind(this)} />
                                                    </div>
                                                    <div className="field-set">
                                                        <label className="label-name">Phone</label>
                                                        <input className="" type="tel" name="phone" value={this.state.phone} onChange={this.handlePhoneChange.bind(this)} />
                                                    </div>
                                                    <div className="field-set">
                                                        <label className="label-name">Please list your main questions you wish to discuss for your consultation. </label>
                                                        <textarea className="" type="text" name="textarea" onChange={this.handleTextChange.bind(this)} />
                                                    </div>
                                                    <button className="btn-schedule" onClick={this.scheduleEvent.bind(this)}>Schedule Event</button>
                                                </form>
                                            </div>
                                        </div>
                                        : <div className="row">
                                            <div className="col-12">
                                                <InputMoment
                                                    moment={this.state.m}
                                                    min={this.state.currentDate}
                                                    onChange={this.handleChange.bind(this)}
                                                    onSave={this.confirmDate.bind(this)}
                                                    options={true}
                                                    minStep={30} // default
                                                    hourStep={1} // default
                                                    prevMonthIcon='fas fa-arrow-left' // default
                                                    nextMonthIcon='fas fa-arrow-right' // default
                                                />
                                            </div>
                                        </div>;
        return  (
            <div className={sideClass}>
                <SideBar />
                <div className="services col">
                    <Navigation menuButton={this.sideBarToggle}/>
                    <div className="content">
                        <div className="row header-container responsive calendar">
                            {details}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Consultation;