import React, { Component } from 'react';
import DOMPurify from 'dompurify';
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import Alert from 'react-bootstrap/Alert';
import NotificationsDataService from "../FirebaseService";

import './Admin.scss';
import AdminNav from './AdminNav';

class SingleUserTicket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: null,
            ticketId: '',
            userId:'',
            message:'',
            show: false,
            apiMessage:'',
            alertStatus:'',
            submitted: false,
            notificationUserId: ''
        }
    }

    componentDidMount() {
        let cookie = Cookies.get("session");
        const {ticketId, userId} = (this.props.location && this.props.location.state) || {};
        this.setState({ userId : cookie, ticketId: ticketId, notificationUserId : userId});
    };

    status = (status, reqId) => {
        if(status === 1 || (this.state.respStatus === 1 && reqId === this.state.respRequestId )) {
           return 'In Progress';
        }
        else if (status === 2 || (this.state.respStatus === 2 && reqId === this.state.respRequestId )) {
            return 'On Going';
        }
        else if (status === 3 || (this.state.respStatus === 3 && reqId === this.state.respRequestId )) {
            return 'Completed';
        }
        else {
            return 'Please Select';
        }
    };

    /* Function calling to handle input message */
    handleMessage = (e) => {
        this.setState({message : e.target.value});
    };
    
    /* Sending Notifications to User */
    saveNotifications = () => {
        let data = {
          userRole: 0,
          message: "Admin posted a messeage regarding Ticket",
          user: this.state.notificationUserId,
          requestId: this.state.ticketId,
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

    /* Function for calling Post Api to reply on user's query */
    submitReply (e) {
        e.preventDefault();
                 
        fetch('/api/api/v1/ticketMessageReply', {
            method: 'POST',
            headers: {
                // 'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            body: JSON.stringify({
                userId: this.state.userId,
                ticketId: this.state.ticketId,
                message: this.state.message
            })
        })
        .then((Response) => Response.json())
        .then((res) => {
            console.log(res);
            if (res.status_code === 200){
                console.log(res.result)
                this.setState({message :'', show : true, apiMessage : res.message, alertStatus : 'success'},()=>{
                    window.setTimeout(()=>{
                      this.setState({show : false})
                    },3000)
                  });     
                  this.saveNotifications();
            } else{
                this.setState({show : true, apiMessage : res.message, alertStatus : 'danger'},()=>{
                    window.setTimeout(()=>{
                      this.setState({show : false})
                    },3000)
                  });
            }
        })
      
    };

    render() {
        const {messages, subject} = (this.props.location && this.props.location.state) || {};
        const createMarkup = (html) => {
            return  {
              __html: DOMPurify.sanitize(html)
            }
          }
        return (
                <div className="container-fluid user-tickets">
                    <div className="container">
                        <AdminNav />
                        <div className="back">
                            <Link to="/admin-tickets">
                                <i className="fas fa-angle-left" aria-hidden="true"></i>
                                Back
                            </Link>
                        </div>
                        <label className="bold">User's Requests</label>
                        <div className="container card">
                            <table className="table portal-table">
                                <thead>
                                    <tr>
                                        <th>
                                            <a className="" data-pjax="">Subject</a>
                                        </th>
                                        <th>
                                            <a className="" data-pjax="">Ticket Id</a>
                                        </th>
                                        <th className="d-none d-sm-table-cell">
                                            <a className="active sortable-desc" data-pjax="">Messages</a>
                                        </th>
                                        {/* <th>
                                            <a className="" data-pjax="">Status</a>
                                        </th> */}
                                    </tr>
                                </thead>
                                {
                                    messages.map((item, i) => 
                                    <tbody key={i} className="">
                                        <tr className="body">
                                            <td className="subject">{subject}</td>
                                            <td className="ticket-id">{item.ticketId}</td>
                                            <td className="message" dangerouslySetInnerHTML={createMarkup(item.message)}></td>
                                        </tr>
                                    </tbody>
                                    )
                                }
                            </table>   
                        </div>
                        <label className="bold mt-3">Reply</label>
                            <textarea type="text" className="form-control" name="message" value={this.state.message} onChange={this.handleMessage.bind(this)}></textarea>
                            <button type="button" className="btn btn-primary mt-3" onClick={this.submitReply.bind(this)}>Reply</button>
                    </div>
                    <Alert style={{
                                position: 'fixed',
                                top: 0,
                                right: 0,
                                }}  variant={this.state.alertStatus}
                        onClose={() => this.setState({show : false})} show={this.state.show} dismissible>
                        <Alert.Heading style={{fontSize: "15px"}}>{this.state.apiMessage}</Alert.Heading>
                    </Alert>
                </div>
        )
    }
}
export default SingleUserTicket;