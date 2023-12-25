import React, { Component } from "react";
import Cookies from "js-cookie";

import Navigation from "./Navigation";
import SideBar from "./SideBar";
import { Link } from "react-router-dom";

class AllTickets extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            apiData: [],
            sideMenuOpen: false,
            userId: '',
            ticketId:'',
            createdDate:''
        }
    }

    /* Calling Api to get all query Tickets created by users */
    componentDidMount(){
        let userIdCookie =  Cookies.get("session");
        this.setState({userId : userIdCookie});
        
        if (userIdCookie) {
        this.setState({ loading: true });
            const apiUrl = `/api/api/v1/getTicket?userId=` + userIdCookie;
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
                // console.log(data);
                if (data.status_code === 200){
                    this.setState({ loading : false, apiData : data.result });
                console.log(this.state.apiData);
            }
            })
        }
    };    

    /* Sidebar Toggle */
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
    };

    /* Formatting Date */
    createdDate = (createdDate) => {
        const d = new Date(createdDate);
        const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
        const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
        return (`${mo} ${da}`);
    };

    /* Checking for change of status of Ticket */
    statusCheck = (status) => {
        if(status === 0) {
            return <span className="badge badge-warning" title="open">Open</span>;
         }
        //  else if (status === 2) {
        //     return <span className="badge badge-success" title="Ongoing">Ongoing</span>;
        //  }
         else {
            return <span className="badge badge-completed" title="closed">Closed</span>;
         }
    };

    /* Redirecting to Single Ticket Page */
    openTicket = (item) => {
        this.props.history.push({
            pathname:`/ticket/${item.ticketId}`,
            state: { ticketId : item.ticketId,
                createdDate: item.createdDate,
                subject: item.subject,
                status: item.status }
        })
    };

    render() {
        const { loading, apiData } = this.state;
        if ( loading ) 
        return  <div className="spinner-section">
                    <div className="overlay">
                        <div className="overlay__inner">
                            <div className="overlay__content">
                                <span className="spinner"></span>
                            </div>
                        </div>
                    </div>
                </div>
        const view = apiData.length === 0 ? <tbody>
                                            <tr>
                                                <td colSpan="5" className="empty">Experiencing any issues on our relocation platform? <Link to="/helpdesk"> Submit a ticket</Link> with your feedback.</td>
                                            </tr>
                                        </tbody>
                                    : <>
                                    {
                                        apiData.map(item =>
                                        <tbody key={item.id}>
                                            <tr>
                                                <td>
                                                    {/* <Link to={{
                                                        pathname:`/ticket/${item.ticketId}`,
                                                        state: { ticketId : item.ticketId,
                                                            createdDate: item.createdDate,
                                                            subject: item.subject }
                                                    }}>
                                                    {item.subject}
                                                    </Link> */}
                                                    <div className="req-link">
                                                        <button id="b1" onClick={() => this.openTicket(item)}>{item.subject}</button>
                                                    </div>
                                                </td>
                                                <td>
                                                    {this.createdDate(item.createdDate)}
                                                </td>
                                                <td>
                                                    <div className="status">{this.statusCheck(item.status)}</div>
                                                </td>
                                            </tr>
                                        </tbody>
                                        )
                                    }
                                    </>;

        let sideClass = 'Container'
        if (this.state.sideMenuOpen) {
            sideClass = 'Container sidebar-open'
        };
           
        return  (
            <div className={sideClass}>
                <SideBar />
                <div className="services col">
                    <Navigation menuButton={this.sideBarToggle}/>
                    <div className="content">
                        <div className="container responsive tickets">
                            <div className="header-container">
                                <h1>Tickets</h1>

                                <Link to="/helpdesk" className="btn btn-primary ml-2" data-pjax="">
                                    New ticket
                                </Link>
                            </div>
                            <div className="card">
                                <table className="table portal-table">
                                    <thead>
                                        <tr>
                                            <th>
                                            <a className="" data-pjax="">Subject</a>
                                            </th>
                                            <th>
                                            <a className="" data-pjax="">date</a>
                                            </th>
                                            <th>
                                            <a className="" data-pjax="">Status</a>
                                            </th>
                                        </tr>
                                    </thead>
                                    {view}
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default AllTickets;