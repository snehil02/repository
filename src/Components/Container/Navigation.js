import React, { useEffect, useState } from 'react';
import { useHistory, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import bootstrap from "bootstrap";
import Cookies from "js-cookie";
import Toast from 'react-bootstrap/Toast';
import Alert from 'react-bootstrap/Alert';

import NotificationsDataService from "../FirebaseService";

const Navigation = ({menuButton, count}) => {
    let userCookie =  Cookies.get("username");
    let userId = Cookies.get('session'); 
    let history = useHistory();
    const signOut = () => {
        Cookies.remove("session");
        Cookies.remove("username");
        history.push("/logout");
    }
    const [color, setColor] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [show, setShow] = useState(false);
    const [showNotifications, setshowNotifications] = useState({title: '', body: ''});
    const [alertShow, setAlertShow] = useState(false);
    const [state, setState] = useState({
        // show: false,
        apiMessage:'',
        alertStatus:'',
        count: null,
        changeBgColor:''
      });

    var firstCall = 0;

    /* Reading the notifications getting from Firebase */
    const onDataChange = (items) => {
        // let notifications = [];
    
        items.forEach((item) => {
          let key = item.key;
          let data = item.val();
            if(data.user === userId && data.userRole === 0){
                // debugger;
                updateNotification();
                if(firstCall == 1){
                    // debugger;
                    setShow(true);
                    setshowNotifications({title: data.message, body: data.requestId});
                }
                // notifications.push({
                //     key: key,
                //     user: data.user,
                //     requestId: data.requestId,
                //     status: data.status,
                //     message: data.message
                // });
            }
            else {
                // debugger;
                return notifications;
            }
        });
        firstCall = 1;
        deleteAllNotifications();
        // setNotifications(notifications);
        
    };

    /* Deleting notifications from Firebase */
    const deleteAllNotifications = () => {
        NotificationsDataService.deleteAll()
          .then(() => {
            // refreshList();
          })
          .catch((e) => {
            console.log(e);
          });
    };

    /* Calling notification service on loading the component */
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        NotificationsDataService.getAll().on("value", onDataChange);
        updateNotification(signal);
        
        return () => {
            NotificationsDataService.getAll().off("value", onDataChange);
            abortController.abort();
        };
    }, []);

    /* Function calling from above useEffect() for getting all notifications */
    const updateNotification = (signal) => {
        const apiUrl = `/api/api/v1/getNotificationDetails?userId=` + userId;
        fetch(apiUrl, {
            method: 'GET',
            headers: {
            // 'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            signal : signal
        })
        .then((Response) => Response.json())
        .then((result) => {
        // console.log(result.result.result);
        if (result.status == 200 ) {
            setNotifications(result.result.result);
            setState({count : result.result.count});
        }
        else{
            setAlertShow(true);
            setState({ apiMessage : result.message, alertStatus : 'danger'},()=>{
                window.setTimeout(()=>{
                    setState({show : false})
                },3000)
                });
            }
        })
        .catch((e) => {
            // only call dispatch when we know the fetch was not aborted
            // if (!signal.aborted) {
                console.log('Error: ', e.message );
            // }
        })
    };

    /* Changing background color on clicking notification */
    const changeBgColor = (index) => {
        console.log(index);
        const newObj = [...color];
        newObj[index] = {...newObj[index], [index] : "read"};
        setColor(newObj);
    };
    
    /* Marking notification as Read */
    const markAsRead = (notify, index) => {
        changeBgColor(index);
        if( notify.isRead === 0 ){
            const apiUrl = `/api/api/v1/updateNotificationDetails`;
            fetch(apiUrl, {
            method: 'POST',
                        headers: {
                        // 'Accept': 'application/json',
                        'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            userId: userId,
                            notificationId: notify.notificationId
                        })
            })
            .then((Response) => Response.json())
            .then((result) => {
                // console.log(result);
                if (result.status == 200 ) {
                    if(result.result.isRead == 1){
                        setState({count : state.count - 1});
                    }
                    // setState({show : true, apiMessage : result.message, alertStatus : 'success'},()=>{
                    //     window.setTimeout(()=>{
                    //         setState({show : false})
                    //     },4000)
                    //     });
                    // window.location.reload();
                }
                else{
                    setAlertShow(true);
                    setState({ apiMessage : result.message, alertStatus : 'danger'},()=>{
                        window.setTimeout(()=>{
                            setState({show : false})
                        },3000)
                        });
                }
            })
        }
    };  
    
    /* Redirecting to All Notification Page */
    const seeAllNotifications = () => {
        history.push({
            pathname: `/notifications`,
            state: {
                allNotifications: notifications,
                userId: userId
            }
        });
    };

    /* Updating the notification count on Navigation bar */
    const view = () => {
        // debugger
        if(count) {
        // debugger
        return state.count + count;
        }
        else {
        // debugger
        return state.count;
        }
    } 
    let stringName = userCookie;
    let firstAlpha = stringName.charAt(0);
    return (
        <nav className="navbar navbar-light navbar-expand">
            <button id="sidebar-collapse" className="navbar-toggler d-block d-lg-none mr-2" type="button" onClick={menuButton}>
            <span className="navbar-toggler-icon"></span>
            </button>
            <ul className="navbar-nav ml-auto">
                <li className="nav-item d-flex align-items-center mr-3">
                </li>
                <li className="nav-item nav-item-custom d-none d-lg-block">
                    <Link to="/consultation" className="nav-link">
                    Schedule a free consultation
                    </Link>
                </li>
                <li className="nav-item nav-item-custom d-none d-lg-block">
                    <Link to="/tickets" className="nav-link">
                    Help Desk
                    </Link>
                </li>
                <li className="nav-item dropdown notifications" id="notification-menu">
                    <a className="nav-link dropdown-toggle" data-toggle="dropdown">
                    <FontAwesomeIcon icon="bell" />
                    <span className="badge badge-xs">{view()}</span>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                        {/* <div className="dropdown-item head">Notifications</div> */}
                        {/* <a className="dropdown-item"> */}
                        <ul className="list-group">
                            {notifications &&
                            notifications.slice(0, 5).map((notify, index) => (
                                <li
                                id={color[index]}
                                className={"list-group-item dropdown-item " + (notify.isRead == 0 ? "" : "read")}
                                onClick={() => markAsRead(notify, index)}
                                key={index}
                                >
                                {/* {() => showNotifications(notify)} */}
                                {notify.title}
                                </li>
                            ))}
                        </ul>
                        {/* </a> */}
                        <div className="dropdown-item">
                        <div className="row">
                            <span className="col" data-pjax="" onClick={() => seeAllNotifications()} >See all</span>
                            {/* <a className="col text-right" data-read="">Mark as read</a> */}
                        </div>
                        </div>
                    </div>
                </li>
                <li className="nav-item">
                </li>
                <li className="nav-item dropdown">
                    <a href="#" className="nav-link dropdown-toggle d-flex align-items-center" data-toggle="dropdown">
                        <div className="avatar css-avatar">
                            {firstAlpha}
                        </div>
                        <span className="d-none d-lg-block ml-1">{userCookie}</span>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                        <label className="dropdown-item" data-pjax="">
                        <Link to="/profile" >Profile</Link>
                        </label>
                        <label className="dropdown-item" data-pjax=""><Link to="/settings" >Settings</Link></label>
                        <label className="dropdown-item" onClick={signOut}>
                        Sign Out
                        </label>
                    </div>
                </li>
                <li className="nav-item dropdown d-lg-none">
                    <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
                    <i className="fas fa-ellipsis-v" aria-hidden="true"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                        <Link to="/consultation" className="dropdown-item" data-pjax="">
                        Schedule a free consultation
                        </Link>
                        <Link to="/help-desk" className="dropdown-item" data-pjax="">
                        Help Desk
                        </Link>
                    </div>
                </li>
            </ul>
            <Toast onClose={() => setShow(false)} show={show} delay={4000} autohide animation style={{
                position: 'fixed',
                top: 0,
                right: 20,
                minWidth: 200,
                zIndex: 1
                }}>
                <Toast.Header>
                    <img
                    src="holder.js/20x20?text=%20"
                    className="rounded mr-2"
                    alt=""
                    />
                    <strong className="mr-auto">{showNotifications.title}</strong>
                    <small>just now</small>
                </Toast.Header>
                <Toast.Body>{showNotifications.body}</Toast.Body>
            </Toast>
            <Alert style={{position: 'fixed',
                            top: 0,
                            right: 0,
                            }}  variant={state.alertStatus}
                onClose={() => setAlertShow(false)} show={alertShow} dismissible>
                <Alert.Heading style={{fontSize: "15px"}}>{state.apiMessage}</Alert.Heading>
                
            </Alert>
        </nav>
    )
}
export default Navigation;