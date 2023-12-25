import React, { useEffect, useState } from 'react';
import { useHistory, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import bootstrap from "bootstrap";
import Cookies from "js-cookie";
import NotificationsDataService from "../FirebaseService";
import Alert from 'react-bootstrap/Alert';
import Toast from 'react-bootstrap/Toast';

const AdminNav = ({menuButton, count}) => {
    let history = useHistory();
    const logOut = () => {
        Cookies.remove("session");
        Cookies.remove("username");
        history.push("/adminlogin");
    }
    let userId = Cookies.get('session');
    const [color, setColor] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [show, setShow] = useState(false);
    const [showNotifications, setshowNotifications] = useState({title: '', body: ''});
    const [alertShow, setAlertShow] = useState(false);
    const [state, setState] = useState({
        show: false,
        apiMessage:'',
        alertStatus:'',
        count: null
    });

    var firstCall = 0;

    /* Reading the notifications getting from Firebase */
    const onDataChange = (items) => {
        // let notifications = [];
    
        items.forEach((item) => {
          let key = item.key;
          let data = item.val();
            if(data.userRole != 0){
                updateNotification();
                if(firstCall == 1){
                    setShow(true);
                    setshowNotifications({title: data.message, body: data.requestId});
                }
                // notifications.push({
                //     key: key,
                //     user: data.user,
                // });
            }
            // else {
            //     return notifications = [];
            // }
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
        NotificationsDataService.getAll().on("value", onDataChange);
        updateNotification();

        return () => {
            NotificationsDataService.getAll().off("value", onDataChange);
        };
    }, []);

    /* Function calling from above useEffect() for getting all notifications */
    const updateNotification = () => {
        const apiUrl = `/api/api/v1/getNotificationDetails?userId=` + userId;
        fetch(apiUrl, {
        method: 'GET',
                headers: {
                // 'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
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
                console.log(result);
                if (result.status == 200 ) {
                    if(result.result.isRead == 1){
                        setState({count : state.count - 1});
                    }
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
            pathname: `/adminNotifications`,
            state: {
                allNotifications: notifications,
                userId: userId
            }
        });
    };

    /* Updating the notification count on Navigation bar */
    const viewCount = () => {
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

    return (
        <nav className="navbar navbar-light navbar-expand">
            <button id="sidebar-collapse" className="navbar-toggler d-block d-lg-none mr-2" type="button" onClick={menuButton}>
            <span className="navbar-toggler-icon"></span>
            </button>
            <ul className="navbar-nav ml-auto">
                <li className="nav-item d-flex align-items-center mr-3">
                </li>
                <li className="nav-item nav-item-custom d-none d-lg-block">
                    <Link to="/category" className="nav-link">
                    Category
                    </Link>
                </li>
                <li className="nav-item nav-item-custom d-none d-lg-block">
                    <Link to="/subcategory" className="nav-link">
                    Sub Category
                    </Link>
                </li>
                <li className="nav-item nav-item-custom d-none d-lg-block">
                    <Link to="/admin-requests" className="nav-link">
                    Requests
                    </Link>
                </li>
                <li className="nav-item nav-item-custom d-none d-lg-block">
                    <Link to="/admin-tickets" className="nav-link">
                    Tickets
                    </Link>
                </li>
                {/* <li className="nav-item nav-item-custom d-none d-lg-block">
                    <Link className="nav-link">
                    Settings
                    </Link>
                </li> */}
                <li className="nav-item dropdown notifications" id="notification-menu">
                    <a className="nav-link dropdown-toggle" data-toggle="dropdown">
                        <FontAwesomeIcon icon="bell" />
                        <span className="badge badge-xs">{viewCount()}</span>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                        {/* <div className="dropdown-item head">Notifications</div> */}
                        {/* <a className="dropdown-item"> */}
                            <ul className="list-group">
                                {notifications &&
                                notifications.slice(0, 5).map((notify, index) => (
                                    <li
                                    id={color[index]}
                                    className={"list-group-item dropdown-item " + (notify.isRead === 0 ? "" : "read")}
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
                <li className="nav-item nav-item-custom d-none d-lg-block" onClick={logOut}>
                    <span className="nav-link" style={{cursor: 'pointer'}}>Sign Out</span>
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
export default AdminNav;