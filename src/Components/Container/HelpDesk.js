import React, { Component } from "react";
import Cookies from "js-cookie";
import "trix/dist/trix";
import DOMPurify from 'dompurify';
import { Link } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import NotificationsDataService from "../FirebaseService";

import Navigation from "./Navigation";
import SideBar from "./SideBar";

class HelpDesk extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sideMenuOpen: false,
            userId: '',
            subject: '',
            message: '',
            attachment :'',
            res:'',
            ticketId:'',
            createdDate:'',
            formErrors: {},
            show: false,
            apiMessage:'',
            alertStatus:'',
            submitted: false,
        }
        this.trixInput = React.createRef();
    }

    /* Adding validation for Form */
    handleFormValidation() {    
        const { subject, message } = this.state;    
        let formErrors = {};    
        let formIsValid = true; 

        if (!subject) {    
            formIsValid = false;    
            formErrors["subjectErr"] = "Field is required.";    
        }    

        if (!message) {    
            formIsValid = false;    
            formErrors["messageErr"] = "Field is required.";    
        }

        this.setState({ formErrors: formErrors });    
        return formIsValid;
    }

    componentDidMount(){
        let userIdCookie =  Cookies.get("session");
        this.setState({userId : userIdCookie});
        
        /* Trix text editor instantiating */
        this.trixInput.current.addEventListener("trix-change", event => {
            // console.log("trix change event fired");
            this.handleChange(event.target.value);
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

    subjectChange = (event) => {
        this.setState({subject : event.target.value});
    }

    handleEditorReady(editor) {
        // this is a reference back to the editor if you want to
        // do editing programatically
        editor.insertString("editor is ready");
    };

    /* Sending Notification to Admin on posting any query */
    saveNotifications = () => {
        let data = {
          userRole: 1,
          message: "New Ticket",
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

    /* Calling Api for creating new Ticket for any query by user */
    sendMessage = (e) => {

        e.preventDefault();
        if (this.handleFormValidation()) {   
            
        const formData = new FormData();

        formData.append('document', this.state.attachment);
        formData.append('subject', this.state.subject);
        formData.append('message', this.state.message);
        formData.append('userId', this.state.userId);

            fetch('/api/api/v1/addTicket', {
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
                // console.log(res.result.ticketId);
                if (res.status_code === 200){
                    this.setState({ticketId: res.result.ticketId, createdDate : res.result.createdDate});
                this.props.history.push({
                    pathname: `/ticket/${this.state.ticketId}`,
                    state: { ticketId : this.state.ticketId,
                        createdDate: this.state.createdDate,
                        subject: this.state.subject }
                });
                this.saveNotifications();
                } else {
                    this.setState({show : true, apiMessage : res.message, alertStatus : 'danger'},()=>{
                        window.setTimeout(()=>{
                          this.setState({show : false})
                        },3000)
                      });
                }
            })   
        }
    }
    
    render() {
        
        const { subjectErr, messageErr } = this.state.formErrors;
        let sideClass = 'Container'
        if (this.state.sideMenuOpen) {
            sideClass = 'Container sidebar-open'
        };
        const createMarkup = (html) => {
            return  {
              __html: DOMPurify.sanitize(html)
            }
          }
           
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
                        <div className="container responsive tickets">
                            <h1>New ticket</h1>
                            <form >
                                <div className="form-group">
                                    <label className="control-label" >Subject</label>
                                    <input className="form-control" id={subjectErr ? ' showError' : ''} type="text" name="subject" onChange={this.subjectChange.bind(this)} />
                                    {subjectErr && <div style={{ color: "red", paddingBottom: 10 }}>{subjectErr}</div> }
                                </div>
                                <label className="control-label">Message</label>
                                <div className="editor">
                                    <input id="x" type="hidden" name="content"/>
                                    <trix-editor input="x" 
                                        placeholder="write here..."
                                        onEditorReady={this.handleEditorReady}
                                        ref={this.trixInput} 
                                        id={messageErr ? ' showError' : ''}/>
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
export default HelpDesk;