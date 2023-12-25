import React, { Component, createRef, useRef, useState } from 'react';
import { Link, useHistory } from "react-router-dom";
import TrixEditor from '../editor/Editor';

import Navigation from './Navigation';
import SideBar from './SideBar';

const RequestPage = (props) => {

    // const { params: {requestId}} = match;
    const history = useHistory();
    const {data, requestid, title, createddate, status} = (props.location && props.location.state) || {};

    const d = new Date(data.boarding);
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    let boardingDate = (`${mo} ${da}, ${ye}`);

    const date = new Date(createddate);
    const yr = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    const m = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    let createdDate = (`${mo} ${da}`);

    const[attachment, setAttachment] = useState(null);
    const[state, setState] = useState({
        message:'',
        formErrors: {},
        loading: false,
        sideMenuOpen: false,
    })
    const trixInput = useRef();
    
    document.addEventListener("trix-change", event => {
        // console.log("trix change event fired");
        handleChange(event.target.value);
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
            setAttachment({attachment : file});
            return true;
        };
       
    });

    // useEffect(() => {
    //     setState({ loading: true });
    //         const apiUrl = `/api/api/v1/getTicketMessage?userId=` + userIdCookie + `&ticketId=` + ticketId;
    //         fetch(apiUrl, {
    //             method: 'GET',
    //             headers: {
    //                 // 'Access-Control-Allow-Origin': '*',
    //                 // "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
    //                 // 'Authorization': '',
    //                 // 'x-api-key': '', 
    //                 'Content-Type': 'application/json'
    //             }
    //         })
    //         .then((res) => res.json())
    //         .then(data => {
    //             // console.log(data);
    //             if (data.status_code === 200){
    //                 this.setState({ loading : false, apiData : data.result });
    //             }
    //         })

    //     return () => {
    //         cleanup
    //     }
    // }, [])


    /* Sidebar Toggeling for mobile view */
    const sideBarToggle = (event) => {
        event.preventDefault();
        setState((prevState) => {
            return {sideMenuOpen : !prevState.sideMenuOpen};
        });
        if (state.sideMenuOpen){
            document.body.classList.remove('scroll-stop');
        }
        else {
            document.body.classList.add('scroll-stop');
        }
    }

    const handleChange = (msg) => {
        setState({message : msg});
        console.log(state.message);
    }
    const handleEditorReady = (editor) => {
        // this is a reference back to the editor if you want to
        // do editing programatically
        editor.insertString("editor is ready");
    }

    /* Sending Notification to Admin on querying about any Service */
    // const saveNotifications = () => {
    //     let data = {
    //       userRole: 1,
    //       message: "New Ticket Message",
    //       user: this.state.userId,
    //       requestId: this.state.ticketId,
    //     };
    
    //     NotificationsDataService.create(data)
    //       .then(() => {
    //         console.log("Created new item successfully!");
    //         this.setState({
    //           submitted: true,
    //         });
    //     })
    //     .catch((e) => {
    //         console.log(e);
    //     });
    // };

     const sendMessage = (e) => {
    //     e.preventDefault();
         
    //     if (handleFormValidation()) {  

    //         const formData = new FormData();

    //         formData.append('document', this.state.attachment);
    //         formData.append('ticketId', this.state.ticketId);
    //         formData.append('message', this.state.message);
    //         formData.append('userId', this.state.userId);

    //         fetch('/api/api/v1/addTicketMessageNew', {
    //             method: 'POST',
    //             body: formData
    //         })
    //         .then((Response) => Response.json())
    //         .then((res) => {
    //             // console.log(res.result);
    //             if (res.status_code === 200){
    //                 setState({ message : '', apiData: res.result });
    //                 saveNotifications();
    //             }
    //         })   
    //     }
     }

    // const createMarkup = (html) => {
    //     return  {
    //       __html: DOMPurify.sanitize(html)
    //     }
    // };

    // const firstAlpha = () => {
    //     let stringName = this.state.username;
    //     let letter = stringName.charAt(0);
    //     return letter;
    // };

    // /* Filtering out the message form User and Admin */
    // const messageView = (item) => {
    //     if(item.userId === this.state.userId) {
    //         return (
    //             <div className="message">
    //                 <div className="message-header">
    //                     <div className="message-avatar">
    //                     <div className="avatar css-avatar">{firstAlpha()}</div>
    //                     </div>
    //                     <div className="flex-fill">
    //                     <div className="name">
    //                         {this.state.username}                            
    //                     </div>
    //                     <div className="date">
    //                         {item.createdDate}                            
    //                     </div>
    //                     </div>
    //                 </div>
    //                 <div className="message-body">
    //                     <div className="user-content">
    //                     <div className="preview" dangerouslySetInnerHTML={createMarkup(item.message)}></div>
    //                     </div>
    //                 </div>
    //             </div>
    //         )
    //     }
    //     else {
    //         return (
    //             <div className="message" style={{display: 'flex',
    //                                             flexDirection: 'column',
    //                                             justifyContent: 'flex-end',
    //                                             alignItems: 'flex-end'
    //                                         }}>
    //                 <div className="message-header">
    //                     <div className="message-avatar">
    //                     <div className="avatar css-avatar">A</div>
    //                     </div>
    //                     <div className="flex-fill">
    //                     <div className="name">
    //                         Admin                            
    //                     </div>
    //                     <div className="date">
    //                         {item.createdDate}                            
    //                     </div>
    //                     </div>
    //                 </div>
    //                 <div className="message-body">
    //                     <div className="user-content">
    //                     <div className="preview" dangerouslySetInnerHTML={this.createMarkup(item.message)}></div>
    //                     </div>
    //                 </div>
    //             </div>
    //         )
    //     }
    // };

    const statusCheck = (status) => {
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

    let sideClass = 'Container'
        if (state.sideMenuOpen) {
            sideClass = 'Container sidebar-open'
        };

    return(
        <div className={sideClass}>
            <SideBar />
            <div className="services col">
                <Navigation menuButton={sideBarToggle} />
                <div className="content">
                    <div className="back">
                        <span onClick={() => { history.push('/requests'); }}>
                            <i className="fas fa-angle-left" aria-hidden="true"></i>
                            Requests
                        </span>
                    </div>
                    <div className="container details">
                        <div className="header-container responsive">
                            <h1>{title}</h1>
                            <div className="request-status">
                                {statusCheck(status)}
                            </div>
                        </div>
                        <section>
                            <table className="details">
                                <tbody>
                                    <tr>
                                        <th>Request ID</th>
                                        <td>#{requestid}</td>
                                    </tr>
                                    <tr>
                                        <th>Service</th>
                                        <td>{title}</td>
                                    </tr>
                                    <tr>
                                        <th>Payment</th>
                                        <td>Account Balance</td>
                                    </tr>
                                    <tr>
                                        <th>Date</th>
                                        <td>{createdDate}</td>
                                    </tr>
                                    <tr>
                                        <th>Moving from</th>
                                        <td>{data.countryFrom}</td>
                                    </tr>
                                    <tr>
                                        <th>Moving to</th>
                                        <td>{data.countryTo}</td>
                                    </tr>
                                    <tr>
                                        <th>Moving date</th>
                                        <td>{boardingDate}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>
                        <div className="header-container">
                            <h2>Messages</h2>
                        </div>
                        <div className="card">
                            <div className="messages">
                                <div className="message
                                    staff-message                    ">
                                    <div className="message-header">
                                        <div className="message-avatar">
                                            <div  className="avatar"></div>
                                        </div>
                                        <div className="flex-fill">
                                        <div className="name">
                                            Admin                            
                                        </div>
                                        <div className="date">
                                            21 hours ago                            
                                        </div>
                                        </div>
                                    </div>
                                    <div className="message-body">
                                        <div className="user-content">
                                        Hey {data.firstName},<br/><br/>
                                        I'm Admin, Lorem ipsum dolor sit amet, invidunt inciderint cu nam, simul habemus complectitur cu his, paulo doctus euismod sed ea. An est diceret sententiae definiebas, debet <br/><br/>
                                        -- Admin
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="header-container">
                            <h2>Partner Messages</h2>
                        </div>
                        <form >
                            <div className="editor">
                                <input id="x" type="hidden" name="content"/>
                                <trix-editor input="x" 
                                        placeholder="write here..."
                                        onEditorReady={handleEditorReady}
                                        ref={trixInput} 
                                        // id={messageErr ? ' showError' : ''}
                                        />
                                        {/* {messageErr && <div style={{ color: "red", paddingBottom: 10 }}>{messageErr}</div> } */}
                                <span className="caption">File attachment: png, jpeg, jpg, pdf, doc</span>
                                <div className="editor-footer">
                                        <button type="button" className="btn btn-primary btn-send" onClick={sendMessage}>
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
};
export default RequestPage;