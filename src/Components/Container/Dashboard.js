import React, { useContext, useState, useEffect, Component } from 'react';
import { Link, Redirect } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Cookies from "js-cookie";
import Alert from 'react-bootstrap/Alert';

import './Container.scss';
import SideBar from './SideBar';
import Navigation from './Navigation';
import AuthApi from '../Auth/Auth';
import RequestPage from './RequestPage';


class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            apiData: {},
            requests: [],
            userName: [],
            sideMenuOpen: false,
            data:[],
            waiting:"nav-link",
            ongoing:"nav-link",
            progress:"nav-link",
            completed:"nav-link",
            all:"nav-link active",
            show: false,
            apiMessage:'',
            alertStatus:'',
        }
    }
    /* Calling Api for getting all user information filled at time of signing. */
    componentDidMount() {
        const { userIdNo } = (this.props.location && this.props.location.state) || {};
        // console.log(userIdNo);
        let session = this.context;
        let userId = session;
        // console.log(userId);
        let cookie = Cookies.get("session");

        if (cookie) {
            // console.log(cookie);
            this.setState({ loading: true });
            const apiUrl = `/api/api/v1/getRoadmap?userId=` + cookie;
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
                    // console.log(data);
                    if (data.status_code === 200) {
                        this.setState({ loading: false, apiData: data.result, requests: data.result.requestdetails, userName: data.result.firstName, data: data.result.requestdetails });
                        // console.log(this.state.userName);
                        // console.log(this.state.requests);

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
        window.history.pushState(null, document.title, window.location.href);
        window.addEventListener('popstate', function (event){
        window.history.pushState(null, document.title,  window.location.href);
        });
    }

    /* Sidebar Toggeling for mobile view */
    sideBarToggle = () => {
        this.setState((prevState) => {
            return { sideMenuOpen: !prevState.sideMenuOpen };
        });
        if (this.state.sideMenuOpen) {
            document.body.classList.remove('scroll-stop');
        }
        else {
            document.body.classList.add('scroll-stop');
        }
    };

    /* Checking for Status and category Form */
    statusCheck = (service, form, status) => {
        let result = form === null ? this.status(status)
                                :   <div className="form-btn">
                                        <button className="btn btn-primary btn-form" onClick={() => this.openForm(form, service.requestId, service.title)}>Submit Details Here</button>
                                    </div>
            return result;
    };

    checkCompleted = (check) => {
        let status = check === 3 ? <span className="badge badge-completed" title="Completed">Completed</span> : '--';
        return status;
    };

    /* Showing Status as per the information getting from Admin */
    status = (status) => {
        if(status === 0 ) {
            return <span className="badge badge-primary" title="Waiting-for-Review">Waiting for Review</span>;
         }
         else if (status === 1) {
            return <span className="badge badge-primary" title="In-Progress">In Progress</span>;
         }
         else if (status === 2) {
            return <span className="badge badge-success" title="Ongoing">Ongoing</span>;
         }
         else if (status === 3) {
            return <span className="badge badge-completed" title="Completed">Completed</span>;
         }
         else {
             return '--';
         }
    };

    /* Redirecting to Form(service) requested */
    openForm = (form, requestId, title) => {
        this.props.history.push({
            pathname: `/form`,
            state: {
                    dataForm: form,
                    requestId: requestId,
                    title: title
            }
        })
    };

    /* Filtering data according to status */
    filterTable = (num) => {
        let value = num;
        const data = this.state.requests;
        if (value === '') {
            return this.setState({data : data});
        }
        else {
            this.setState({
                data : data.filter(item => {
                    return item.status === num
                })
            })
        }
    };
    
    /* Redirecting to orders(service) requested */
    subServices = (apiData, service) => {
        this.props.history.push({
            pathname: `/orders/${service.requestId}`,
            state: {
                data: apiData,
                boarding: apiData.boarding,
                requestid: service.requestId,
                title: service.title,
                createddate: service.createdDate,
                status: service.status
            }
        })
    };

    addClass = (num) => {
        if(num === 0) {
            this.setState({waiting : 'nav-link active',
            ongoing : 'nav-link',
            progress : 'nav-link',
            completed : 'nav-link',
            all : 'nav-link'});
        }
        else if(num === 1) {
            this.setState({waiting : 'nav-link',
            ongoing : 'nav-link active',
            progress : 'nav-link',
            completed : 'nav-link',
            all : 'nav-link'});
        }
        else if(num === 2) {
            this.setState({waiting : 'nav-link',
            ongoing : 'nav-link',
            progress : 'nav-link active',
            completed : 'nav-link',
            all : 'nav-link'});
        }
        else if(num === 3) {
            this.setState({waiting : 'nav-link',
            ongoing : 'nav-link',
            progress : 'nav-link',
            completed : 'nav-link active',
            all : 'nav-link'});
        }
        else {
            this.setState({waiting : 'nav-link',
            ongoing : 'nav-link',
            progress : 'nav-link',
            completed : 'nav-link',
            all : 'nav-link active'});
        }
    };

    render() {
        const { loading, apiData, requests, data } = this.state;
        if (loading || apiData.length === 0)
            return <div className="spinner-section">
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
        };

        return (
            <div className={sideClass}>
                <SideBar />
                <div className="dashboard col">
                    <Navigation menuButton={this.sideBarToggle} />
                    <div className="content">
                        <div className="onboarding-wrapper">
                            <div className="onboarding-flags">
                                <div className="country-from">
                                    <img src={apiData.countryFromFlag} alt={apiData.countryFrom} />
                                </div>
                                <div className="roadmap">
                                    <div className="pointer"><FontAwesomeIcon icon="map-marker-alt" /></div>
                                    <div className="start"><span>•</span></div>
                                    <div className="dashes">– – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – – –</div>
                                    <div className="solid"></div>
                                </div>
                                <div className="country-to">
                                    <img src={apiData.countryToFlag} alt={apiData.countryTo} />
                                </div>
                            </div>
                            <div className="container hidden"><div className="row"></div></div>
                            <div className="onboarding-icons">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-3">
                                            <FontAwesomeIcon icon="plane-departure" size="3x" color="#03d6fee6" />
                                        </div>
                                        <div className="col-3">
                                            <FontAwesomeIcon icon="plane-arrival" size="3x" color="#3e3fede6" />
                                        </div>
                                        <div className="col-3">
                                            <FontAwesomeIcon icon="ticket-alt" size="3x" color="#3e3fede6" />
                                        </div>
                                        <div className="col-3">
                                            <FontAwesomeIcon icon="hourglass-half" size="3x" color="#c22dfee6" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="onboarding-info">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-6 col-sm-3">
                                            <div className="text-style1">Departure</div>
                                            <div className="text-style2">
                                                {apiData.countryFrom}
                                            </div>
                                        </div>
                                        <div className="col-6 col-sm-3">
                                            <div className="text-style1">Arrival</div>
                                            <div className="text-style2">
                                                {apiData.countryTo}
                                            </div>
                                        </div>
                                        <div style={{ height: '20px' }} className="col-12 d-block d-sm-none"></div>
                                        <div className="col-6 col-sm-3">
                                            <div className="text-style1">Boarding</div>
                                            <div className="text-style2" data-boarding_date="January 5, 2021">
                                                {apiData.boarding}
                                            </div>
                                        </div>
                                        <div className="col-6 col-sm-3">
                                            <div className="text-style1">Days Left</div>
                                            <div className="text-style2"><span className="days-left">{apiData.daysLeft}</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="container hidden"><div className="row"></div></div>
                        </div>
                        <div className="container welcome-content">
                            <h1>Welcome,
                                         {apiData.firstName}
                            </h1>
                            <p>Lorem ipsum dolor sit amet, invidunt inciderint cu nam, simul habemus complectitur cu his, paulo doctus euismod sed ea. An est diceret sententiae definiebas, debet repudiandae definitiones ut has.</p>
                            <p> <FontAwesomeIcon icon="check-circle" /> <b>Step 1:</b> Lorem ipsum dolor sit amet, invidunt inciderint cu nam, simul habemus complectitur cu his</p>
                            <p> <FontAwesomeIcon icon="check-circle" /> <b>Step 2:</b> Lorem ipsum <Link to="/consultation">free 15-minute consultation </Link>Lorem ipsum dolor sit amet, invidunt inciderint cu nam, simul habemus complectitur cu his</p>
                            <p> <FontAwesomeIcon icon="check-circle" /> <b>Step 3:</b> Lorem ipsum dolor sit amet, invidunt inciderint cu nam, simul habemus complectitur cu his</p>
                            <p><i>Lorem ipsum dolor sit amet, invidunt inciderint cu nam, simul habemus complectitur cu his, paulo doctus euismod sed ea. An est diceret sententiae definiebas, debet repudiandae definitiones ut has.</i></p>
                        </div>
                        <h2>Recent Requests</h2>


                        <div>
                            <nav className="nav filter">
                                <button className={this.state.waiting} onClick={() => this.addClass(0)} >
                                    <a className="link" onClick={() => this.filterTable(0)}>Waiting for Review</a>
                                </button>
                                <button className={this.state.ongoing} onClick={() => this.addClass(1)} >
                                    <a className="link" onClick={() => this.filterTable(1)}>In Progress</a>
                                </button>
                                <button className={this.state.progress} onClick={() => this.addClass(2)}>
                                    <a className="link" onClick={() => this.filterTable(2)}>Ongoing</a>
                                </button>
                                <button className={this.state.completed} onClick={() => this.addClass(3)}>
                                    <a className="link" onClick={() => this.filterTable(3)}>Completed</a>
                                </button>
                                <button className={this.state.all} onClick={() => this.addClass()}>
                                    <a className="link" onClick={() => this.filterTable('')}>All</a>
                                </button>
                            </nav>
                            <div className="card">
                                <table className="table portal-table">
                                    <thead>
                                        <tr>
                                            <th>
                                                Request
                                            </th>
                                            <th>
                                                Title
                                            </th>
                                            <th className="d-none d-sm-table-cell">
                                                Paid
                                            </th>
                                            <th className="d-none d-sm-table-cell">
                                                Completed
                                            </th>
                                            <th>
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        data.map(service =>
                                            <tr key={service.id}>
                                                <td>
                                                    {/* <Link onClick={this.clickEvent.bind(this)} onMouseDown={this.handleMouseDown} to={{
                                                        pathname: `/orders/${service.requestId}`,
                                                        state: {
                                                            data: apiData,
                                                            boarding: apiData.boarding,
                                                            requestid: service.requestId,
                                                            title: service.title,
                                                            createddate: service.createdDate
                                                        }
                                                    }} data-pjax="">
                                                        {service.requestId}
                                                    </Link> */}
                                                    <div className="req-link">
                                                        <button id="b1" onClick={() => this.subServices(apiData, service)}>{service.requestId}</button>
                                                    </div>
                                                </td>
                                                <td>
                                                    {service.title}
                                                </td>
                                                <td className="d-none d-sm-table-cell">
                                                    {service.createdDate}
                                                </td>
                                                <td className="d-none d-sm-table-cell">
                                                    <span className="data-empty">{this.checkCompleted(service.status)}</span>
                                                </td>
                                                <td className="status">
                                                    {this.statusCheck(service, service.jsonForm, service.status)}
                                                </td>
                                            </tr>
                                        )
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* <button onClick={() => updateCount(1)} >+</button>
                        <button onClick={() => updateCount(-1)} >-</button> */}

                    {/* <button id="filldetails" onClick={addFields}>Fill Details</button> */}
                    <div id="container" style={{ paddingBottom: "50px" }}></div>
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
Dashboard.contextType = AuthApi;
export default Dashboard;