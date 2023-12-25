import React, { Component } from 'react';
import { Link } from "react-router-dom";
import FormBuilder from './FormBuilder';
import Alert from 'react-bootstrap/Alert';

import './Admin.scss';
import AdminNav from './AdminNav';

class EditSubCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryId:'',
            subCategoryId:'',
            editsubCategoryTitle:'',
            editsubDescription:'',
            editsubMessage:'',
            editsubImage:'',
            editsubPrice:'',
            editformBuilderData:'',
            show: false,
            apiMessage:'',
            alertStatus:'',
            formErrors: {}
        }
    };

    /* Below functions call to handle data getting from SubCategory page */
    componentDidMount() {
        const {title, desc, message, price, subCategoryId, categoryId, form} = (this.props.location && this.props.location.state) || {};
        this.setState({editsubCategoryTitle : title,
                        editsubDescription : desc,
                        editsubMessage: message,
                        editsubPrice: price,
                        subCategoryId: subCategoryId,
                        categoryId : categoryId,
                        editformBuilderData : form});
    };

    /* Form validation */
    edithandleFormValidation() {    
        const { editsubImage, editsubCategoryTitle, editsubDescription, editsubMessage, editsubPrice } = this.state;    
        let formErrors = {};    
        let formIsValid = true;    
    
        if (!editsubMessage) {    
            formIsValid = false;    
            formErrors["editsubMessageErr"] = "Field is required.";    
        }

        if (!editsubDescription) {    
            formIsValid = false;    
            formErrors["editsubDescriptionErr"] = "Field is required.";    
        }    

        if (!editsubPrice) {    
            formIsValid = false;    
            formErrors["editsubPriceErr"] = "Field is required.";    
        }
        
        if (!editsubCategoryTitle) {    
            formIsValid = false;    
            formErrors["editsubCategoryTitleErr"] = "Field is required.";    
        }
        this.setState({ formErrors: formErrors });    
        return formIsValid;
    }
    /* Below functions call to handle input fields when filled by admin when editing service sub-category */
    editsubCategoryTitle = (event) => {
        this.setState({editsubCategoryTitle :event.target.value});
    }
    editsubDescription = (event) => {
        this.setState({editsubDescription :event.target.value});
    }
    editsubMessage = (event) => {
        this.setState({editsubMessage :event.target.value});
    }
    editsubPrice = (event) => {
        this.setState({editsubPrice :event.target.value});
    }
    editimageSubChange = (event) => {
        this.setState({editsubImage :event.target.files[0]});
    }

    /* Function for building custom form for sub-category */
    formBuilderData = () => {
        setTimeout(() => {
            var form = window.sessionStorage.getItem('formData')
            var formBuilder = JSON.stringify(form);
            console.log(formBuilder);
            this.setState({editformBuilderData : formBuilder});
            window.sessionStorage.removeItem('formData');
        }, 500);
    }

    /* Calling Api to update selected sub-category */
    editsubmitSubCategory = (e) => {
        e.preventDefault();
        if (this.edithandleFormValidation()) {
            const formData = new FormData(); 
            
            formData.append('image', this.state.editsubImage);
            formData.append('categoryId', this.state.categoryId);
            formData.append('subCategoryId', this.state.subCategoryId);
            formData.append('title', this.state.editsubCategoryTitle);
            formData.append('description', this.state.editsubDescription);
            formData.append('message', this.state.editsubMessage);
            formData.append('price', this.state.editsubPrice);
            formData.append('jsonForm', this.state.editformBuilderData);
            
            fetch('/api/api/v1/editSubCategory ', {
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
                
            })
        }
    }

    render() {
        const { editsubImageErr, editsubPriceErr, editsubMessageErr, editsubDescriptionErr, editsubCategoryTitleErr } = this.state.formErrors;
        return (
                <div className="container-fluid user-requests">
                    <div className="container">
                        <AdminNav />
                        <div className="back">
                        <Link to="/subcategory">
                            <i className="fas fa-angle-left" aria-hidden="true"></i>
                            Back
                        </Link>
                        </div>
                        <section>
                            <label className="header">Edit Sub Category</label>
                            
                            <div className="form-row">
                                <div className="form-group col-sm-12">
                                    <label htmlFor="category" className="required">Add New Sub Category</label>
                                    <input type="text" id={editsubCategoryTitleErr ? ' showError' : ''} className="form-control" id="category" name="category" value={this.state.editsubCategoryTitle} disabled="" required="" onChange={this.editsubCategoryTitle.bind(this)}/>
                                    {editsubCategoryTitleErr && <div style={{ color: "red", paddingBottom: 10 }}>{editsubCategoryTitleErr}</div> }
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-sm-12">
                                    <label htmlFor="description" className="required">Add New Description</label>
                                    <textarea type="text" id={editsubDescriptionErr ? ' showError' : ''} className="form-control" id="description" name="description" value={this.state.editsubDescription} required="" onChange={this.editsubDescription.bind(this)}></textarea>
                                    {editsubDescriptionErr && <div style={{ color: "red", paddingBottom: 10 }}>{editsubDescriptionErr}</div> }
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-sm-12">
                                    <label htmlFor="description" className="required">Add New Message</label>
                                    <textarea type="text" id={editsubMessageErr ? ' showError' : ''} className="form-control" id="description" name="description" value={this.state.editsubMessage} required="" onChange={this.editsubMessage.bind(this)}></textarea>
                                    {editsubMessageErr && <div style={{ color: "red", paddingBottom: 10 }}>{editsubMessageErr}</div> }
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-sm-12">
                                    <label htmlFor="category" className="required">Add New Price</label>
                                    <input type="number" id={editsubPriceErr ? ' showError' : ''} className="form-control" value={this.state.editsubPrice} onChange={this.editsubPrice.bind(this)}/>
                                    {editsubPriceErr && <div style={{ color: "red", paddingBottom: 10 }}>{editsubPriceErr}</div> }
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-sm-12">
                                    <label htmlFor="category" className="required">Add New Image</label>
                                    <input type="file" id={editsubCategoryTitleErr ? ' showError' : ''} className="form-control" accept=".png, .jpeg, .jpg" onChange={this.editimageSubChange.bind(this)} />
                                </div>
                            </div>
                            <FormBuilder click={this.formBuilderData}/>
                            <div className="text-right mt-3">
                                <button type="button" className="btn btn-primary" onClick={this.editsubmitSubCategory.bind(this)}>
                                    Save changes
                                </button>
                            </div>
                        </section>
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
export default EditSubCategory;