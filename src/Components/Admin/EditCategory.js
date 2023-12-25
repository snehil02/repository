import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';

import './Admin.scss';
import AdminNav from './AdminNav';

class EditCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editTitle: '',
            editDescription: '',
            editImage:'',
            categoryId:'',
            formErrors: {},
            show: false,
            apiMessage:'',
            alertStatus:'',
        }
    };

    componentDidMount() {
        const {title, desc, categoryId} = (this.props.location && this.props.location.state) || {};
        this.setState({editTitle : title, editDescription : desc, categoryId : categoryId});

    };

    /* Function calling for handling input changes  */
    handleChange (event) {
        var index = event.target.selectedIndex;
        var optionElement = event.target.childNodes[index]
        var option =  optionElement.getAttribute('data-id');
        this.setState({status : event.target.value, requestId : option});
    };

    /* Form validation */
    editCatFormValidation() {    
        const { editImage, editTitle, editDescription, categoryId } = this.state;    
        let formErrors = {};    
        let formIsValid = true;    
    
        if (!editTitle) {    
            formIsValid = false;    
            formErrors["editTitleErr"] = "Field is required.";    
        }

        if (!editDescription) {    
            formIsValid = false;    
            formErrors["editDescriptionErr"] = "Field is required.";    
        }    

        if (!categoryId) {    
            formIsValid = false;    
            formErrors["categoryIdErr"] = "Field is required.";    
        }
        this.setState({ formErrors: formErrors });    
        return formIsValid;
    }

    /* Below functions call to handle different input fields when filled by admin when creating service category */
    categoryId = (event) => {
        this.setState({categoryId :event.target.value});
    };

    editTitleChange = (event) => {
        this.setState({editTitle :event.target.value});
    };

    editDescriptionChange = (event) => {
        this.setState({editDescription :event.target.value});
    };

    editImageChange = (event) => {
        this.setState({editImage :event.target.files[0]});
        console.log('image',this.state.editImage)
    };

    /* Calling Api to update selected category */
    EditSubmit = (e) => {
        e.preventDefault();
        if (this.editCatFormValidation()) {
            // this.spinner(true);
            const formData = new FormData(); 
            
            formData.append('image',  this.state.editImage);
            formData.append('title', this.state.editTitle);
            formData.append('description', this.state.editDescription);
            formData.append('categoryId', this.state.categoryId);
            fetch('/api/api/v1/editCategory ', {
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
                    // this.spinner(false);
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
                });
        }
    }

    render() {
        const { editDescriptionErr, editTitleErr, categoryIdErr, editImageErr } = this.state.formErrors;
        return (
                <div className="container-fluid user-requests">
                    <div className="container">
                        <AdminNav />
                        <div className="back">
                        <Link to="/category">
                            <i className="fas fa-angle-left" aria-hidden="true"></i>
                            Back
                        </Link>
                        </div>
                        <label className="bold">Edit Category</label>
                        <div className="container card">
                            <div className="form-row">
                            </div>
                            <div className="form-row">
                                <div className="form-group col-sm-12">
                                <label htmlFor="category" className="required">Add New Category Name</label>
                                <input type="text" id={editTitleErr ? ' showError' : ''} value={this.state.editTitle} className="form-control" id="category" name="category" onChange={this.editTitleChange.bind(this)}/>
                                {editTitleErr && <div style={{ color: "red", paddingBottom: 10 }}>{editTitleErr}</div> }
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-sm-12">
                                <label htmlFor="description" className="required">Add New Description</label>
                                <textarea type="text"  id={editDescriptionErr ? ' showError' : ''} value={this.state.editDescription} className="form-control" id="description" name="description" onChange={this.editDescriptionChange.bind(this)}></textarea>
                                {editDescriptionErr && <div style={{ color: "red", paddingBottom: 10 }}>{editDescriptionErr}</div> }
                                </div>
                            </div>
                            <input type="file" id={editImageErr ? ' showError' : ''} className="form-control" accept=".png, .jpeg, .jpg" onChange={this.editImageChange.bind(this)} />
                            {/* {editImageErr && <div style={{ color: "red", paddingBottom: 10 }}>{editImageErr}</div> }  */}
                            <div className="text-right mt-3">
                                <button type="button" className="btn btn-primary" onClick={this.EditSubmit.bind(this)}>
                                Save Changes</button>
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
export default EditCategory;