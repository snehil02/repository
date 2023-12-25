import React, { Component } from 'react';
import bootstrap from "bootstrap";
import Cookies from "js-cookie";
import Toast from 'react-bootstrap/Toast';
import ToastHeader from 'react-bootstrap/ToastHeader';
import ToastBody from 'react-bootstrap/ToastBody';
import Alert from 'react-bootstrap/Alert';

import './Admin.scss';
import AdminNav from './AdminNav';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            apiData: [],
            title: '',
            description: '',
            image: null,
            categories: [],
            categoryId:'',
            editTitle:'',
            editDescription:'',
            editImage: null,
            show: false,
            apiMessage:'',
            alertStatus:'',
            formErrors: {},
            select:'',
            toastMessage: false,
            deleteCatId: ''
        }
        this.initialState = this.state;
    }

    /* validations for category forms */
    handleFormValidation() {    
        const { title, description, image } = this.state;    
        let formErrors = {};    
        let formIsValid = true;    
        
        if (!title) {    
            formIsValid = false;    
            formErrors["titleErr"] = "Field is required.";    
        }

        if (!description) {    
            formIsValid = false;    
            formErrors["descriptionErr"] = "Field is required.";    
        }    

        if (!image) {    
            formIsValid = false;    
            formErrors["imageErr"] = "Field is required.";    
        }
        this.setState({ formErrors: formErrors });    
        return formIsValid;
    }
    
    /* Function calling Api for getting all Service Category */
    componentDidMount () {
        this.setState({ loading: true });
        const apiUrl = `/api/api/v1/getAdminCategory`;
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
                    categories : data.result,
                    title: data.result.title,
                    description: data.result.description,
                 });
            }
        });
    }

    /* Below functions call to handle input fields when filled by admin when creating service category */
    titleChange = (event) => {
        this.setState({title :event.target.value});
    }
    descriptionChange = (event) => {
        this.setState({description :event.target.value});
    }
    imageChange = (event) => {
        this.setState({image :event.target.files[0]});
    }

    /* Function calling for adding new Service Category */
    submitChanges = (e) => {
        e.preventDefault();
        if (this.handleFormValidation()) { 
            const formData = new FormData(); 
        
            formData.append('image', 
            this.state.image, 
            //   this.state.image.name 
            );
            formData.append('title', this.state.title);
            formData.append('description', this.state.description);
            fetch('/api/api/v1/addCategory ', {
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
                        // this.setState(this.initialState);
                        this.setState({show : true, apiMessage : res.message, alertStatus : 'success'},()=>{
                            window.setTimeout(()=>{
                              this.setState({show : false})
                            },3000)
                          });
                    }
                    else{
                        this.setState({show : true, apiMessage : res.message, alertStatus : 'danger'},()=>{
                            window.setTimeout(()=>{
                              this.setState({show : false})
                            },3000)
                          });
                    }
                    this.setState(this.initialState);
                    window.location.reload();
                });
        } 
        
    }

    /* Below functions call to handle input fields when filled by admin when creating service category */
    categoryId = (event) => {
        this.setState({categoryId :event.target.value});
    }
    editTitleChange = (event) => {
        this.setState({editTitle :event.target.value});
    }
    editDescriptionChange = (event) => {
        this.setState({editDescription :event.target.value});
    }
    editImageChange = (event) => {
        this.setState({editImage :event.target.files[0]});
    }

    /* Removing selected category */
    deleteSubmit = (e) => {
        e.preventDefault();
        this.setState({toastMessage : false});
            fetch('/api/api/v1/deleteCategory ', {
                method: 'POST',
                headers: {
                    // 'Access-Control-Allow-Origin': '*',
                    // "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                    // 'Authorization': '',
                    // 'x-api-key': '', 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    categoryId: this.state.deleteCatId
                })
            })
            .then((Response) => Response.json())
                .then((res) => {
                    console.log(res);
                    if (res.status_code === 200){
                        // this.setState(this.initialState);
                        this.setState({show : true, apiMessage : res.message, alertStatus : 'success'},()=>{
                            window.setTimeout(()=>{
                              this.setState({show : false})
                            },3000)
                          });
                    }
                    else{
                        this.setState({show : true, apiMessage : res.message, alertStatus : 'danger'},()=>{
                            window.setTimeout(()=>{
                              this.setState({show : false})
                            },3000)
                          });
                    }
                })
    };

    modalId(id) {  
        const value = "#" + id;
        return value;
    };

    /* Redirecting to edit particular category */
    edit = (item) => {
        this.props.history.push({
            pathname: `/editCategory`,
            state: {
                title: item.title,
                desc: item.description,
                // image: item.image,
                categoryId: item.id
            }
        })
    };

    render() {
        const { titleErr, descriptionErr, imageErr, editDescriptionErr, editTitleErr, categoryIdErr, editImageErr } = this.state.formErrors; 
        const { loading, categories } = this.state;
        if ( loading || categories.length === 0 ) 
        return  <div className="spinner-section">
                    <div className="overlay">
                        <div className="overlay__inner">
                            <div className="overlay__content">
                                <span className="spinner"></span>
                            </div>
                        </div>
                    </div>
                </div>;
        const search = categories.filter((row) => row.title.toLowerCase().indexOf(this.state.select.toLowerCase()) > -1 
        );
        return(
            <div className="container create-category">
                <div className="content">
                    <AdminNav />
                    <div className="modal-btn"><span className="btn btn-primary" data-toggle="modal" data-target="#AddCategory">Add New Category</span></div>
                    <form className="">
                        <div className="modal category-modal fade" id="AddCategory">
                            <div className="modal-dialog modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Add New Category</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <label className="header">Category</label>
                                        <div className="form-row">
                                            <div className="form-group col-sm-12">
                                                <label htmlFor="category" className="required">Add Category</label>
                                                <input type="text" id={titleErr ? ' showError' : ''} className="form-control" id="category" name="category" value={this.state.title} disabled="" required="" onChange={this.titleChange.bind(this)}/>
                                                {titleErr && <div style={{ color: "red", paddingBottom: 10 }}>{titleErr}</div> }
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-sm-12">
                                                <label htmlFor="description" className="required">Add Description</label>
                                                <textarea type="text" id={descriptionErr ? ' showError' : ''} className="form-control" id="description" name="description" value={this.state.description} required="" onChange={this.descriptionChange.bind(this)}></textarea>
                                                {descriptionErr && <div style={{ color: "red", paddingBottom: 10 }}>{descriptionErr}</div> }
                                            </div>
                                        </div>
                                        <input type="file" id={imageErr ? ' showError' : ''} className="form-control" accept=".png, .jpeg, .jpg" onChange={this.imageChange.bind(this)} />
                                        {imageErr && <div style={{ color: "red", paddingBottom: 10 }}>{imageErr}</div> }
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-primary" data-toggle="modal" onClick={this.submitChanges.bind(this)}>
                                            Save changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <label className="header">Category</label>
                        <div className="search-box">
                            Search: <input type="text" value={this.state.select} onChange={(e) => this.setState({select : e.target.value})} />
                        </div>
                        <div className="card">
                            <table className="table portal-table">
                                <thead>
                                    <tr>
                                        <th>
                                            Category Name
                                        </th>
                                        <th>
                                            Description
                                        </th>
                                        <th>
                                            Image
                                        </th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        search.map(item => 
                                        <tr key={item.id}  className="cat">
                                            <td className="">
                                                {item.title}
                                            </td>
                                            <td className="">
                                                {item.description}
                                            </td>
                                            <td className="cat-img">
                                                <img src={item.image} alt={item.title} />
                                            </td>
                                            <td className="save-button">
                                                <button type="button" className="btn btn-primary edit" onClick={() => this.edit(item)}>
                                                    <FontAwesomeIcon icon="edit" color="#000"/>
                                               </button>
                                            </td>
                                            <td>
                                                <button type="button" className="btn btn-primary delete" onClick={() => this.setState({deleteCatId : item.id , toastMessage : true})} >
                                                    <FontAwesomeIcon icon="trash-alt" color="#000"/>
                                                </button>
                                            </td>
                                           
                                        </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </form>
                </div>
                <Alert style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            }}  variant={this.state.alertStatus}
                    onClose={() => this.setState({show : false})} show={this.state.show} dismissible>
                    <Alert.Heading style={{fontSize: "15px"}}>{this.state.apiMessage}</Alert.Heading>
                </Alert>
                <div aria-live="polite" aria-atomic="true" style={{ minHeight: '200px', }} >
                    <div style={{ position: 'fixed', top: '50%', right: '50%' }} >
                        <Toast onClose={() => this.setState({toastMessage : false})} show={this.state.toastMessage}>
                            <Toast.Header>
                                <strong className="mr-auto">Are you Sure?</strong>
                            </Toast.Header>
                            <Toast.Body>
                                <button className="btn btn-primary" onClick={() => this.setState({toastMessage : false})}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary" onClick={this.deleteSubmit.bind(this)}>Yes</button>
                            </Toast.Body>
                        </Toast>
                    </div>
                </div>
            </div>
        )
    }
}
export default Category;