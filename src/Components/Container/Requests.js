import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

import Navigation from "./Navigation";
import SideBar from "./SideBar";

class Requests extends Component {
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
        }
    };

    /* Calling Api for getting all user information filled at time of signing. */
    componentDidMount() {
        const { userIdNo } = (this.props.location && this.props.location.state) || {};
        // console.log(userIdNo);
        let session = this.context;
        let userId = session;
        console.log(userId);
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
                    // 'Authorization': '',
                    // 'x-api-key': '', 
                    'Content-Type': 'application/json'
                }
            })
                .then((res) => res.json())
                .then(data => {
                    console.log(data);
                    if (data.status_code === 200) {
                        this.setState({ loading: false, apiData: data.result, requests: data.result.requestdetails, userName: data.result.firstName, data: data.result.requestdetails });
                        // console.log(this.state.userName);
                        // console.log(this.state.requests);

                    }
                })
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
        if(status === 0 || status === 1 ) {
            return <span className="badge badge-primary" title="In Progress">In Progress</span>;
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

    /* Redirecting to orders(service) requested */
    subServices = (apiData, service) => {
        this.props.history.push({
            pathname: `/orders/${service.requestId}`,
            state: {
                data: apiData,
                boarding: apiData.boarding,
                requestid: service.requestId,
                title: service.title,
                createddate: service.createdDate
            }
        })
    };
    
    /* Filtering data according to status */
    filterTable = (num) => {
        let value = num;
        const data = this.state.requests;
        if (value === '') {
            // const data = request;
            return this.setState({data : data});
        }
        else {
            // const data = request;
            this.setState({
                data : data.filter(item => {
                    return item.status === num
                })
            })
        }
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
            </div>

        let sideClass = 'Container'
        if (this.state.sideMenuOpen) {
            sideClass = 'Container sidebar-open'
        }
        return(
            <div className={sideClass}>
                <SideBar />
                <div className="dashboard col">
                    <Navigation menuButton={this.sideBarToggle} />
                    <div className="content">
                        <div className="container">
                            <div className="header-container responsive">
                                <h1>Requests</h1>
                            </div>
                            <nav className="nav filter">
                                <button className={this.state.waiting} onClick={() => this.addClass(0)} >
                                    <a className="link" onClick={() => this.filterTable(0)}>Waiting for Details</a>
                                    
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
                                    {
                                        data.map(service =>
                                            <tbody key={service.id}>
                                                <tr>
                                                    <td>
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
                                            </tbody>
                                        )
                                    }
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Requests;