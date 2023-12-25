import React from 'react';
import { Component } from 'react';
import { all } from 'trix';
import AdminNav from './AdminNav';
import Cookies from "js-cookie";
import Alert from 'react-bootstrap/Alert';

let userId = Cookies.get('session');

class AdminNotifications extends Component {
    constructor(props){
        super(props);
        this.state = {
            allNotifications:[],
            count:null,
            userId:'',
            setBgColor: [],
            show: false,
            apiMessage:'',
            alertStatus:'',
        }
    }

    /* Method calling for getting all notifications */
    componentDidMount() {
        const { allNotifications, userId  } = (this.props.location && this.props.location.state) || {};
        // console.log(allNotifications)
        // this.setState({allNotifications : allNotifications});
        this.setState({userId : userId});

        const apiUrl = `/api/api/v1/getNotificationDetails?userId=` + userId;
        fetch(apiUrl, {
            method: 'GET',
            headers: {
            // 'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            // signal : signal
        })
        .then((Response) => Response.json())
        .then((result) => {
        console.log(result.result.result);
        if (result.status == 200 ) {
            this.setState({allNotifications : result.result.result});
        }
        else{
                this.setState({show : true, apiMessage : result.message, alertStatus : 'danger'},()=>{
                    window.setTimeout(()=>{
                    this.setState({show : false})
                    },3000)
                });
            }
        })
    };

     /* Changing background color on clicking notification */
    changeBgColor = (index) => {
        // console.log(index);
        const newObj = [...this.state.setBgColor];
        newObj[index] = {...newObj[index], [index] : "read"};
        this.setState({setBgColor : newObj});
    };
    
    /* Marking notification as Read */
    markAsRead = (notify, index) => {
        this.changeBgColor(index);
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
                        this.setState({count : this.state.count - 1});
                        // console.log(this.state.count)
                    }
                    // setState({show : true, apiMessage : result.message, alertStatus : 'success'},()=>{
                    //     window.setTimeout(()=>{
                    //         setState({show : false})
                    //     },4000)
                    //     });
                    // window.location.reload();
                }
                else{
                    this.setState({show : true, apiMessage : result.message, alertStatus : 'danger'},()=>{
                        window.setTimeout(()=>{
                          this.setState({show : false})
                        },3000)
                      });
                }
            })
        }
    };

    render(){
        return(
            <div className='container-fluid admin-notification'>
                <div className='container'>
                    <AdminNav count={this.state.count}/>
                    <div className="content">
                        <h2>Notifications</h2>
                        <ul className="list-group notifications">
                            {this.state.allNotifications &&
                            this.state.allNotifications.map((notify, index) => (
                                <li
                                id={this.state.setBgColor[index]}
                                className={"list-group-item dropdown-item " + (notify.isRead === 0 ? "" : "read")}
                                onClick={() => this.markAsRead(notify, index)}
                                key={index}
                                >
                                {notify.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <Alert style={{position: 'fixed',
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
export default AdminNotifications;