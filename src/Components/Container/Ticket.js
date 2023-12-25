import React, { Component } from "react";
import Cookies from "js-cookie";
import "trix/dist/trix";
import DOMPurify from 'dompurify';
import { Link } from "react-router-dom";
import NotificationsDataService from "../FirebaseService";

import Navigation from "./Navigation";
import SideBar from "./SideBar";

class Ticket extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            apiData: null,
            sideMenuOpen: false,
            userId: '',
            message: '',
            res:'',
            username:'',
            createdDate:'',
            subject:'',
            attachment :'',
            ticketId:'',
            status: 0,
            formErrors: {},
        }
        this.trixInput = React.createRef();
    }

    /* Calling Api for getting all messages of a particular ticket. */
    componentDidMount(){
        let userCookie =  Cookies.get("username");
        this.setState({username : userCookie});
        const {ticketId, createdDate, subject, status} = (this.props.location && this.props.location.state) || {};
        this.setState({createdDate : createdDate, subject : subject, ticketId : ticketId, status : status});
        let userIdCookie =  Cookies.get("session");
        this.setState({userId : userIdCookie});
        
        if (userIdCookie) {
        this.setState({ loading: true });
            const apiUrl = `/api/api/v1/getTicketMessage?userId=` + userIdCookie + `&ticketId=` + ticketId;
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
                }
            })
        }
        
        document.addEventListener("trix-change", event => {
            // console.log("trix change event fired");
            this.handleChange(event.target.value); //calling custom event
        });
        document.addEventListener("trix-attachment-add", event => {
            var attachment = event.attachment;
            var file = attachment.file;
            var type = file.type;
            var validExt = "png, pdf, jpeg, jpg, doc";
            var getFileExt = type.split("/").pop();
            var pos = validExt.indexOf(getFileExt);
            if(pos < 0) {
                alert("This file is not allowed, please upload valid file.");
                return;
            } else {
                this.setState({attachment : file});
                return true;
            };
          });
    }

    /* Adding validations for text editor */
    handleFormValidation() {    
        const { message } = this.state;    
        let formErrors = {};    
        let formIsValid = true; 

        if (!message) {    
            formIsValid = false;    
            formErrors["messageErr"] = "Field is required.";    
        }

        this.setState({ formErrors: formErrors });    
        return formIsValid;
    }

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

    handleChange = (msg) => {
        this.setState({message : msg});
        
    }

    handleEditorReady(editor) {
        // this is a reference back to the editor if you want to
        // do editing programatically
        editor.insertString("editor is ready");
    }

    /* Sending Notification to Admin on requeting any Service */
    saveNotifications = () => {
        let data = {
          userRole: 1,
          message: "New Ticket Message",
          user: this.state.userId,
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

    /* Calling Api for adding new query in Ticket */
    sendMessage = (e) => {
         e.preventDefault();
         
        if (this.handleFormValidation()) {  

            const formData = new FormData();

            formData.append('document', this.state.attachment);
            formData.append('ticketId', this.state.ticketId);
            formData.append('message', this.state.message);
            formData.append('userId', this.state.userId);

            fetch('/api/api/v1/addTicketMessage', {
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
                // console.log(res.result);
                if (res.status_code === 200){
                    this.setState({ message : '', apiData: res.result });
                    this.saveNotifications();
                }
            })   
        }
        
    }

    /* Formatting Date */
    createdDate = (createdDate) => {
        const d = new Date(createdDate);
        const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
        const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
        return (`${mo} ${da}`);
    };

    
    createMarkup = (html) => {
        return  {
          __html: DOMPurify.sanitize(html)
        }
    };

    firstAlpha = () => {
        let stringName = this.state.username;
        let letter = stringName.charAt(0);
        return letter;
    };

    /* Filtering out the message form User and Admin */
    messageView = (item) => {
        if(item.userId === this.state.userId) {
            return (
                <div className="message">
                    <div className="message-header">
                        <div className="message-avatar">
                        <div className="avatar css-avatar">{this.firstAlpha()}</div>
                        </div>
                        <div className="flex-fill">
                        <div className="name">
                            {this.state.username}                            
                        </div>
                        <div className="date">
                            {item.createdDate}                            
                        </div>
                        </div>
                    </div>
                    <div className="message-body">
                        <div className="user-content">
                        <div className="preview" dangerouslySetInnerHTML={this.createMarkup(item.message)}></div>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="message" style={{display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'flex-end',
                                                alignItems: 'flex-end'
                                            }}>
                    <div className="message-header">
                        <div className="message-avatar">
                        <div className="avatar css-avatar">A</div>
                        </div>
                        <div className="flex-fill">
                        <div className="name">
                            Admin                            
                        </div>
                        <div className="date">
                            {item.createdDate}                            
                        </div>
                        </div>
                    </div>
                    <div className="message-body">
                        <div className="user-content">
                        <div className="preview" dangerouslySetInnerHTML={this.createMarkup(item.message)}></div>
                        </div>
                    </div>
                </div>
            )
        }
    };

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

    render() {
        
        const { messageErr } = this.state.formErrors;
        const { loading, apiData } = this.state;
        if ( loading || apiData === null ) 
        return  <div className="spinner-section">
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
        };
           
        return  (
            <div className={sideClass}>
                <SideBar />
                <div className="services col">
                    <Navigation menuButton={this.sideBarToggle}/>
                    <div className="content">
                        <div className="back">
                            <Link to="/tickets">
                                <i className="fas fa-angle-left" aria-hidden="true"></i>
                                Tickets
                            </Link>
                        </div>
                        <div className="container responsive tickets details-single">
                            <div className="ticket-subject header-container ">
                                <h1>{this.state.subject}</h1>
                                <div className="status">{this.statusCheck(this.state.status)}</div>
                            </div>
                            <section>
                                <table className="details">
                                    <tbody>
                                        <tr>
                                            <th>Date</th>
                                            <td>{this.createdDate(this.state.createdDate)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </section>
                            <div className="header-container">
                                <h2>Messages</h2>
                            </div>
                            {
                                apiData.map(item => 
                                <div key={item.id} className="card">
                                    <div className="messages">
                                        {this.messageView(item)}
                                    </div>
                                </div>
                                )
                            }
                            <div className="header-container">
                                <h2>Partner Messages</h2>
                            </div>
                            <form >
                            <div className="editor">
                                    <input id="x" type="hidden" name="content" value={this.state.message}/>
                                    <trix-editor input="x" 
                                        placeholder="write here..."
                                        onEditorReady={this.handleEditorReady}
                                        ref={this.trixInput} id={messageErr ? ' showError' : ''}
                                        value={this.state.message}/>
                                        {messageErr && <div style={{ color: "red", paddingBottom: 10 }}>{messageErr}</div> }
                                        <span className="caption">File attachment: png, jpeg, jpg, pdf, doc</span>
                                    <div className="editor-footer">
                                        <button type="button" className="btn btn-primary btn-send" onClick={this.sendMessage.bind(this)}>
                                            Send message
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Ticket;