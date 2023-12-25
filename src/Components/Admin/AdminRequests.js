import React from 'react';
import Alert from 'react-bootstrap/Alert';
import NotificationsDataService from "../FirebaseService";

import '../Login/Login.scss';
import AdminNav from './AdminNav';

class AdminRequests extends React.Component {
    constructor() {
        super();
        this.state = {
            requests:[],
            option:'',
            status: null,
            requestId: null,
            userId:'',
            select:'',
            show:'',
            show: false,
            apiMessage:'',
            alertStatus:'',
            searchColumn:'',
            data:["status"],
            submitted: false,
        };
    }


    /* Fetching Data, all service requests by all Users */
    componentDidMount () {
        this.setState({ loading: true });
        const apiUrl = `/api/api/v1/getAllRequestByUser`;
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
                    requests : data.result,
                    // data : data.result
                 });
            }
        });
    };

    /* Function calling for handling dropdown(status) */
    handleChange (event) {
        var index = event.target.selectedIndex;
        var optionElement = event.target.childNodes[index]
        var option =  optionElement.getAttribute('data-id');
        var userId =  optionElement.getAttribute('user-id');
        this.setState({status : event.target.value, requestId : option, userId : userId});
    };

    /* checking for form */
    formHandle = (jsonForm, submitform, title) => {
        if (jsonForm === null && submitform === null) {
            return "--";
        }
        else if (jsonForm != null && submitform === null) {
            return (
                <button type="button" className="btn btn-primary" onClick={() => this.jsonForm(jsonForm, title)}>
                Form</button>
            )
        }
        else if (jsonForm != null && submitform != null) {
            return (
                <button type="button" className="btn btn-primary" onClick={() => this.submitform(submitform, title)}>
                Form</button>
            )
        }
    };

    /* redirecting to empty form page */
    jsonForm = (form, title) => {
        this.props.history.push({
            pathname: `/request-form`,
            state: {
                    emptyForm: form,
                    formTitle: title
            }
        })
    };

    /* redirecting to form page getting from user when filled */
    submitform = (form, title) => {
        this.props.history.push({
            pathname: `/request-form`,
            state: {
                userDetailform: form,
                formTitle: title
            }
        })
    };

    /* Updating status of Requests */
    status = (status, reqId) => {
        if(status === 1 || (this.state.respStatus === 1 && reqId === this.state.respRequestId )) {
           return 'In Progress';
        }
        else if (status === 2 || (this.state.respStatus === 2 && reqId === this.state.respRequestId )) {
            return 'Ongoing';
        }
        else if (status === 3 || (this.state.respStatus === 3 && reqId === this.state.respRequestId )) {
            return 'Completed';
        }
        else {
            return 'Please Select';
        }
    };

    /* Sending Notifications to User */
    saveNotifications = () => {
        let data = {
          userRole: 0,
          message: "Admin posted a messeage regarding Request",
          user: this.state.userId,
          requestId: this.state.requestId,
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

    /* Calling Api to update the status of each request */
    SaveChanges (e) {
        e.preventDefault();
            
        const formData = new FormData(); 
            
        formData.append('requestId', this.state.requestId);
        formData.append('userId', this.state.userId);
        formData.append('status', this.state.status);
        
        fetch('/api/api/v1/updatRequestStatus ', {
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
                this.setState({apiMessage : res.message, alertStatus : 'success', show : true},()=>{
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
              },4000)
            window.location.reload();
        });
      
    };

    render (){
        const { loading, requests, data } = this.state;
        if ( loading || requests.length === 0 ) 
        return  <div className="spinner-section">
                    <div className="overlay">
                        <div className="overlay__inner">
                            <div className="overlay__content">
                                <span className="spinner"></span>
                            </div>
                        </div>
                    </div>
                </div>;
        // const sortDate = requests.sort((a,b) => {
        //     return new Date(a.createdDate).getTime() - 
        //         new Date(b.createdDate).getTime()
        // }).reverse();

        const search = requests.filter((row) => 
        // data.some((col) =>
        // row[col].toString().toLowerCase().indexOf(this.state.select.toLowerCase()) > -1)
                                                    row.firstName.toLowerCase().indexOf(this.state.select.toLowerCase()) > -1 ||
                                                row.lastName.toLowerCase().indexOf(this.state.select.toLowerCase()) > -1 ||
                                                row.title.toLowerCase().indexOf(this.state.select.toLowerCase()) > -1 ||
                                                row.requestId.toLowerCase().indexOf(this.state.select.toLowerCase()) > -1 ||
                                                row.status.toString().toLowerCase().indexOf(this.state.select.toLowerCase()) > -1
                                                || row.status === this.state.option
                                        //  )        
                                        );
        // const filterstatus = search.filter(row => row.status.toString().indexOf(this.state.option) > -1);
        // const columns = requests[0] && Object.keys(requests[0]);
        return (
            <div className='container-fluid admin-requests'>
                <div className='container'>
                    <AdminNav />
                    <div className='row'>
                        <label className="header">User's Requests</label>
                        <div className="col-12 mb-5 services">
                            <div className="search-box">
                                Search: <input type="text" value={this.state.select} onChange={(e) => this.setState({select : e.target.value})} />
                            </div>
                            {/* <select value={this.state.option} onChange={(e) => this.setState({option : e.target.value})}>
                                <option value="" >select</option>
                                <option value="1" >In Progress</option>
                                <option value="2" >Ongoing</option>
                                <option value="3" >Completed</option>
                                <option value="0" >Please Wait</option>
                            </select> */}
                            <div className="card">
                                <table className="table portal-table">
                                    <thead>
                                        <tr>
                                            <th>
                                                Username
                                            </th>
                                            <th>
                                                Title
                                            </th>
                                            <th>
                                                Created Date
                                            </th>
                                            <th>
                                                Request Id
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
                                                View Form
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
                                                        {list.title}
                                                    </td>
                                                    <td className="">
                                                        {list.createdDate}
                                                    </td>
                                                    <td className="">
                                                        {list.requestId}
                                                    </td>
                                                    <td className="">
                                                        {this.status(list.status, list.requestId)}
                                                    </td>
                                                    <td>
                                                        <select name="status" className="form-control" onChange={this.handleChange.bind(this)}>
                                                            <option value="default">Select</option>
                                                            <option key="1" data-id={list.requestId} user-id={list.userId} value="1" >In Progress</option>
                                                            <option key="2" data-id={list.requestId} user-id={list.userId} value="2" >Ongoing</option>
                                                            <option key="3" data-id={list.requestId} user-id={list.userId} value="3" >Completed</option>
                                                        </select>
                                                    </td>
                                                    <td className="save-button">
                                                        <button type="button" className="btn btn-primary" onClick={this.SaveChanges.bind(this)}>
                                                        Save</button>
                                                    </td>
                                                    <td className="save-button">
                                                        {this.formHandle(list.jsonForm, list.submitform, list.title)}
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
export default AdminRequests;