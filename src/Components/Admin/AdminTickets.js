import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NotificationsDataService from "../FirebaseService";

import '../Login/Login.scss';
import AdminNav from './AdminNav';

class AdminTickets extends React.Component {
    constructor() {
        super();
        this.state = {
            userTickets: [],
            select:'',
            status: '',
            ticketId: '',
            option:'',
            userId:''
        };
    }

    /* Calling Api to get all User Ticket messages */
    componentDidMount () {
        
        this.setState({ loading: true });
        const apiUrl = `/api/api/v1/getAllTicketWithMessage`;
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
                this.setState({ loading : false,
                    userTickets : data.result
                 });
            }
        });
    };

    /* Function call to handle dropdown(status) */
    status = (status, reqId) => {
        if(status === 0 || (this.state.respStatus === 1 && reqId === this.state.respRequestId )) {
           return 'Open';
        }
        else if (status === 1 || (this.state.respStatus === 2 && reqId === this.state.respRequestId )) {
            return 'Closed';
        }
        // else if (status === 3 || (this.state.respStatus === 3 && reqId === this.state.respRequestId )) {
        //     return 'Completed';
        // }
        else {
            return 'Please Select';
        }
    };

    /* Function calling for handling dropdown(status) */
    handleChange (event) {
        var index = event.target.selectedIndex;
        var optionElement = event.target.childNodes[index]
        var option =  optionElement.getAttribute('data-id');
        var userId =  optionElement.getAttribute('user-id');
        this.setState({status : event.target.value, ticketId : option, userId : userId});
    };

    /* redirecting to User ticket query page */
    userTicket = (ticketId, ticketMessage, subject, userId) => {
        this.props.history.push({
            pathname: `/single-user-ticket/${ticketId}`,
            state: {
                messages: ticketMessage,
                subject: subject,
                ticketId: ticketId,
                userId: userId
            }
        })
    };

    /* Sending Notifications to User */
    saveNotifications = () => {
        let data = {
          userRole: 0,
          message: "Admin posted a messeage regarding Ticket",
          user: this.state.userId,
          requestId: this.state.ticketId,
          status: this.state.status
        };
    
        NotificationsDataService.create(data)
          .then(() => {
            console.log("Created new item successfully!");
            this.setState({
              submitted: true,
            });
        })
        .catch((e) => {
            console.log(e);
        });
    };

    /* Function calling for updating status for ticket */
    SaveChanges (e) {
        e.preventDefault();
            
        const formData = new FormData(); 
            
        formData.append('ticketId', this.state.ticketId);
        formData.append('status', this.state.status);
        
        fetch('/api/api/v1/updateTicketStatus ', {
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
                this.setState({apiMessage : res.message, alertStatus : 'success', show : true },()=>{
                    window.setTimeout(()=>{
                      this.setState({show : false})
                    },3000)
                  });
                this.saveNotifications();
            }
            else{
                this.setState({show : true, apiMessage : res.message, alertStatus : 'danger'},()=>{
                    window.setTimeout(()=>{
                      this.setState({show : false})
                    },3000)
                  });
            }
            window.setTimeout(()=>{
                this.setState({show : false})
              },3000)
            window.location.reload();
        })
      
    };
    
    render (){
        const { loading, userTickets } = this.state;
        if ( loading || userTickets.length === 0 ) 
        return  <div className="spinner-section">
                    <div className="overlay">
                        <div className="overlay__inner">
                            <div className="overlay__content">
                                <span className="spinner"></span>
                            </div>
                        </div>
                    </div>
                </div>
        const sortDate = userTickets.sort((a,b) => {
            return new Date(a.createdDate).getTime() - 
                new Date(b.createdDate).getTime()
        }).reverse();

        const search = sortDate.filter((row) => 
                                                row.firstName.toLowerCase().indexOf(this.state.select.toLowerCase()) > -1 ||
                                                row.lastName.toLowerCase().indexOf(this.state.select.toLowerCase()) > -1 ||
                                                row.subject.toLowerCase().indexOf(this.state.select.toLowerCase()) > -1 ||
                                                row.ticketId.toLowerCase().indexOf(this.state.select.toLowerCase()) > -1 
                                                //  row.status.toString().indexOf(this.state.option) > -1
                                        );
        return (
            <div className='container-fluid admin-tickets'>
                <div className='container'>
                    <AdminNav />
                    <div className=''>
                    <div className='row'>
                        <label className="bold">User's Tickets</label>
                        <div className="col-12 mb-5 services">
                            <div className="search-box">
                                Search: <input type="text" value={this.state.select} onChange={(e) => this.setState({select : e.target.value})} />
                            </div>
                        {/* <select value={this.state.option} onChange={(e) => this.setState({option : e.target.value})}>
                                <option value="" >All</option>
                                <option value="0" >Open</option>
                                <option value="1" >Closed</option>
                        </select> */}
                            <div className="card">
                                <table className="table portal-table">
                                    <thead>
                                        <tr>
                                            <th>
                                                Username
                                            </th>
                                            <th>
                                                Subject
                                            </th>
                                            <th>
                                                Created Date
                                            </th>
                                            <th>
                                                Ticket Id
                                            </th>
                                            <th>
                                                Status
                                            </th>
                                            <th>
                                                Select Status
                                            </th>
                                            <th>
                                                Change Status
                                            </th>
                                            <th>
                                                View Ticket
                                            </th>
                                        </tr>
                                    </thead>
                                    {
                                        search.map(list =>
                                            <tbody key={list.id}>
                                                <tr>
                                                    <td>
                                                        {list.firstName} {list.lastName}
                                                    </td>
                                                    <td>
                                                        {list.subject}
                                                    </td>
                                                    <td className="">
                                                        {list.createdDate}
                                                    </td>
                                                    <td className="">
                                                        {list.ticketId}
                                                    </td>
                                                    <td className="">
                                                        {this.status(list.status, list.ticketId)}
                                                    </td>
                                                    <td>
                                                        <select name="status" className="form-control" onChange={this.handleChange.bind(this)}>
                                                            <option value="default">Select</option>
                                                            <option key="1" data-id={list.ticketId} user-id={list.userId} value="0" >Open</option>
                                                            {/* <option key="2" data-id={list.ticketId} value="2" >Ongoing</option> */}
                                                            <option key="3" data-id={list.ticketId} user-id={list.userId} value="1" >Closed</option>
                                                        </select>
                                                    </td>
                                                    <td className="save-button">
                                                        <button type="button" className="btn btn-primary" onClick={this.SaveChanges.bind(this)}>
                                                        Save changes</button>
                                                    </td>
                                                    <td className="save-button">
                                                        <button type="button" className="btn btn-primary" onClick={() => this.userTicket(list.ticketId, list.ticketMessage, list.subject, list.userId)}>
                                                        View</button>
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
            </div>
        )
    }
}
export default AdminTickets;