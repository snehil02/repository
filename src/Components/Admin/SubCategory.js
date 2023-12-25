import React, { Component } from 'react';
import bootstrap from "bootstrap";
import FormBuilder from './FormBuilder';
import Navigation from '../Container/Navigation';
import Cookies from "js-cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Alert from 'react-bootstrap/Alert'
import Toast from 'react-bootstrap/Toast';
import ToastHeader from 'react-bootstrap/ToastHeader';
import ToastBody from 'react-bootstrap/ToastBody';

import './Admin.scss';
import AdminNav from './AdminNav';

class SubCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            categories: [],
            subCategories: [],
            categoryId:'',
            editcategoryId:'',
            subCategoryId:'',
            subCategoryTitle:'',
            subDescription:'',
            subMessage:'',
            subPrice:'',
            subImage:'',
            formBuilderData: '',
            formErrors: {},
            editsubCategoryTitle:'',
            editsubDescription:'',
            editsubMessage:'',
            editsubImage:'',
            editsubPrice:'',
            editformBuilderData:'',
            show: false,
            apiMessage:'',
            alertStatus:'',
            select:'',
            toastMessage: false,
            deleteSubCatId: ''
        }
        this.initialState = this.state;
    }

    /* Function calling Api for getting all Service Category and Sub-category */
    componentDidMount () {
        this.setState({ loading: true });
        const apiUrl = `/api/api/v1/getAdminCategory`;
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                // 'Access-Control-Allow-Origin': '*',
                // "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                // 'Authorization': 'Basic ZmFjZUFwcDpmYWNlQXBwQDEyMzQ1',
                // 'x-api-key': '9y$B&E)H@McQfTjWnZr4u7x!z%C*F-Ja', 
                'Content-Type': 'application/json'
            }
        })
        .then((res) => res.json())
        .then(data => {
            if (data.status_code === 200){
                console.log(data.result)
                this.setState({ loading : false,
                    categories : data.result
                 });
            }
        });

        const subCatApi = `/api/api/v1/getAdminSubCategory`;
        fetch(subCatApi, {
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
                    subCategories : data.result
                 });
            }
        });
    }

    /* validations for category forms */
    handleFormValidation() {    
        const { subCategoryTitle, subDescription, subMessage, subImage } = this.state;    
        let formErrors = {};    
        let formIsValid = true;    
        
        if (!subCategoryTitle) {    
            formIsValid = false;    
            formErrors["subCategoryTitleErr"] = "Field is required.";    
        }

        if (!subDescription) {    
            formIsValid = false;    
            formErrors["subDescriptionErr"] = "Field is required.";    
        }    

        if (!subMessage) {    
            formIsValid = false;    
            formErrors["subMessageErr"] = "Field is required.";    
        }
        if (!subImage) {    
            formIsValid = false;    
            formErrors["subImageErr"] = "Field is required.";    
        }
        this.setState({ formErrors: formErrors });    
        return formIsValid;
    }
    categoryId = (event) => {
        this.setState({categoryId :event.target.value});
    }
    subCategoryTitle = (event) => {
        this.setState({subCategoryTitle :event.target.value});
    }
    subDescription = (event) => {
        this.setState({subDescription :event.target.value});
    }
    subMessage = (event) => {
        this.setState({subMessage :event.target.value});
    }
    subPrice = (event) => {
        this.setState({subPrice :event.target.value});
    }
    imageSubChange = (event) => {
        this.setState({subImage :event.target.files[0]});
    }
    formBuilderData = () => {
        setTimeout(() => {
        var form = window.sessionStorage.getItem('formData')
        var formBuilder = JSON.stringify(form);
        console.log(formBuilder);
        this.setState({formBuilderData : formBuilder});
        window.sessionStorage.removeItem('formData');
        }, 500);
    }

    /* Function calling for adding new Service Sub-category */
    submitSubCategory = (e) => {
        e.preventDefault();
        if (this.handleFormValidation()) {
            const formData = new FormData(); 
            
            formData.append('image', 
            this.state.subImage, 
            //   this.state.subImage.name 
            );
            formData.append('categoryId', this.state.categoryId);
            formData.append('title', this.state.subCategoryTitle);
            formData.append('description', this.state.subDescription);
            formData.append('message', this.state.subMessage);
            formData.append('price', this.state.subPrice);
            formData.append('jsonForm', this.state.formBuilderData);
            
            fetch('/api/api/v1/addSubCategory ', {
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
                
            })
        }
    }

    /* Removing selected Sub-category */
    deleteSubmitSubCategory = (e) => {
        e.preventDefault();
        this.setState({toastMessage : false});
            fetch('/api/api/v1/deleteSubCategory ', {
                method: 'POST',
                headers: {
                    // 'Access-Control-Allow-Origin': '*',
                    // "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                    // 'Authorization': '',
                    // 'x-api-key': '', 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    subCategoryId: this.state.deleteSubCatId
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

    /* Redirecting to edit particular sub-category */
    edit = (item) => {
        this.props.history.push({
            pathname: `/editSubCategory`,
            state: {
                title: item.title,
                desc: item.description,
                message: item.message,
                price: item.price,
                // image: item.image,
                subCategoryId: item.id,
                categoryId: item.catId,
                form: item.jsonForm
            }
        })
    };

    render() {
        const { subCategoryTitleErr, subDescriptionErr, subImageErr, subMessageErr, editsubCategoryTitleErr } = this.state.formErrors;
        const { loading, categories, subCategories } = this.state;
        if ( loading || categories.length === 0 || subCategories.length === 0 ) 
        return  <div className="spinner-section">
                    <div className="overlay">
                        <div className="overlay__inner">
                            <div className="overlay__content">
                                <span className="spinner"></span>
                            </div>
                        </div>
                    </div>
                </div>
        const search = subCategories.filter((row) => row.title.toLowerCase().indexOf(this.state.select.toLowerCase()) > -1 
        );
        return(
            <div className="container create-category">
                <div className="content">
                    <AdminNav />
                    <div className="modal-btn"><span className="btn btn-primary" data-toggle="modal" data-target="#AddSubCategory">Add Sub Category</span></div>
                    <form className="">
                        <div className="modal category-modal fade" id="AddSubCategory">
                            <div className="modal-dialog modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Add New Sub Category</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="form-row">
                                            <div className="form-group col-sm-12">
                                                <label htmlFor="category" className="required">Select Category</label>
                                                <select className="form-control" id="" onChange={this.categoryId.bind(this)}>
                                                    <option value="default">Select Category...</option>
                                                    {
                                                        categories.map(option =>
                                                        <option key={option.id} value={option.id}>{option.title}</option>
                                                        )
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-sm-12">
                                                <label htmlFor="category" className="required">Add Sub Category</label>
                                                <input type="text" id={subCategoryTitleErr ? ' showError' : ''} className="form-control" id="category" name="category" value={this.state.subCategoryTitle} disabled="" required="" onChange={this.subCategoryTitle.bind(this)}/>
                                                {subCategoryTitleErr && <div style={{ color: "red", paddingBottom: 10 }}>{subCategoryTitleErr}</div> }
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-sm-12">
                                                <label htmlFor="description" className="required">Add Description</label>
                                                <textarea type="text" id={subDescriptionErr ? ' showError' : ''} className="form-control" id="description" name="description" value={this.state.subDescription} required="" onChange={this.subDescription.bind(this)}></textarea>
                                                {subDescriptionErr && <div style={{ color: "red", paddingBottom: 10 }}>{subDescriptionErr}</div> }
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-sm-12">
                                                <label htmlFor="description" className="required">Add Message</label>
                                                <textarea type="text" id={subMessageErr ? ' showError' : ''} className="form-control" id="description" name="description" value={this.state.subMessage} required="" onChange={this.subMessage.bind(this)}></textarea>
                                                {subMessageErr && <div style={{ color: "red", paddingBottom: 10 }}>{subMessageErr}</div> }
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-sm-12">
                                                <label htmlFor="category" className="required">Add Price</label>
                                                <input type="number" className="form-control" value={this.state.subPrice} onChange={this.subPrice.bind(this)}/>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-sm-12">
                                                <label htmlFor="category" className="required">Add Image</label>
                                                <input type="file" id={subImageErr ? ' showError' : ''} className="form-control" accept=".png, .jpeg, .jpg" onChange={this.imageSubChange.bind(this)} />
                                                {subImageErr && <div style={{ color: "red", paddingBottom: 10 }}>{subImageErr}</div> }
                                            </div>
                                        </div>
                                        <FormBuilder click={this.formBuilderData}/>
                                    </div>
                                    <div className="modal-footer">
                                    <button type="button" className="btn btn-primary" onClick={this.submitSubCategory.bind(this)}>
                                        Save changes
                                    </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <label className="header">Sub Category</label>
                        <div className="search-box">
                            Search: <input type="text" value={this.state.select} onChange={(e) => this.setState({select : e.target.value})} />
                        </div>
                        <div className="card">
                            <table className="table portal-table">
                                <thead>
                                    <tr>
                                        <th>
                                            Title
                                        </th>
                                        <th>
                                            Description
                                        </th>
                                        <th>
                                            Message
                                        </th>
                                        <th>
                                            Price
                                        </th>
                                        <th>
                                            Image
                                        </th>
                                        <th>
                                        
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    search.map(item =>
                                    <tr key={item.id} className="sub-cat">
                                        <td>
                                            {item.title}
                                        </td>
                                        <td>
                                            {item.description}
                                        </td>
                                        <td className="">
                                            {item.message}
                                        </td>
                                        <td className="">
                                            {item.price}
                                        </td>
                                        <td className="subCat-img">
                                            <img src={item.image} alt={item.title} />
                                        </td>
                                        <td className="save-button">
                                            <button type="button" className="btn btn-primary edit"  onClick={() => this.edit(item)}>
                                                <FontAwesomeIcon icon="edit" color="#000"/>
                                            </button>
                                        </td>
                                        <td>
                                            <button type="button" className="btn btn-primary delete" onClick={() => this.setState({deleteSubCatId : item.id , toastMessage : true})}>
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







                    {/* <form className="">
                        <section>
                            <label className="header">Sub Category</label>
                            <div className="form-row">
                                <div className="form-group col-sm-12">
                                    <label htmlFor="category" className="required">Select Category</label>
                                    <select name="address_country" className="form-control" id="address_country" data-live-search="true" autoComplete="billing country" data-live-search-style="startsWith" onChange={this.categoryId.bind(this)}>
                                        <option value="default">Select Category...</option>
                                        {
                                            categories.map(option =>
                                            <option key={option.id} value={option.id}>{option.title}</option>
                                            )
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-sm-12">
                                    <label htmlFor="category" className="required">Add Sub Category</label>
                                    <input type="text" id={subCategoryTitleErr ? ' showError' : ''} className="form-control" id="category" name="category" value={this.state.subCategoryTitle} disabled="" required="" onChange={this.subCategoryTitle.bind(this)}/>
                                    {subCategoryTitleErr && <div style={{ color: "red", paddingBottom: 10 }}>{subCategoryTitleErr}</div> }
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-sm-12">
                                    <label htmlFor="description" className="required">Add Description</label>
                                    <textarea type="text" id={subDescriptionErr ? ' showError' : ''} className="form-control" id="description" name="description" value={this.state.subDescription} required="" onChange={this.subDescription.bind(this)}></textarea>
                                    {subDescriptionErr && <div style={{ color: "red", paddingBottom: 10 }}>{subDescriptionErr}</div> }
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-sm-12">
                                    <label htmlFor="description" className="required">Add Message</label>
                                    <textarea type="text" id={subMessageErr ? ' showError' : ''} className="form-control" id="description" name="description" value={this.state.subMessage} required="" onChange={this.subMessage.bind(this)}></textarea>
                                    {subMessageErr && <div style={{ color: "red", paddingBottom: 10 }}>{subMessageErr}</div> }
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-sm-12">
                                    <label htmlFor="category" className="required">Add Price</label>
                                    <input type="number" className="form-control" value={this.state.subPrice} onChange={this.subPrice.bind(this)}/>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-sm-12">
                                    <label htmlFor="category" className="required">Add Image</label>
                                    <input type="file" id={subImageErr ? ' showError' : ''} className="form-control" onChange={this.imageSubChange.bind(this)} />
                                    {subImageErr && <div style={{ color: "red", paddingBottom: 10 }}>{subImageErr}</div> }
                                </div>
                            </div>
                            <div className="text-right mt-3">
                                <button type="button" className="btn btn-primary" onClick={this.submitSubCategory.bind(this)}>
                                Save changes</button>
                            </div>
                        </section>
                        <section>
                            <label className="header">Edit Sub Category</label>
                            <div className="form-row">
                                <div className="form-group col-sm-12">
                                    <label htmlFor="category" className="required">Select Sub Category</label>
                                    <select name="address_country" className="form-control" id="address_country" data-live-search="true" autoComplete="billing country" data-live-search-style="startsWith" onChange={this.editsubcategoryId.bind(this)}>
                                        <option value="default">Select Sub Category...</option>
                                        {
                                            subCategories.map(option =>
                                            <option key={option.id} data-id={option.catId} value={option.id}>{option.title}</option>
                                            )
                                        }
                                    </select>
                                </div>
                            </div>
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
                                    <textarea type="text" className="form-control" id="description" name="description" value={this.state.editsubDescription} required="" onChange={this.editsubDescription.bind(this)}></textarea>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-sm-12">
                                    <label htmlFor="description" className="required">Add New Message</label>
                                    <textarea type="text" className="form-control" id="description" name="description" value={this.state.editsubMessage} required="" onChange={this.editsubMessage.bind(this)}></textarea>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-sm-12">
                                    <label htmlFor="category" className="required">Add New Price</label>
                                    <input type="number" className="form-control" value={this.state.editsubPrice} onChange={this.editsubPrice.bind(this)}/>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-sm-12">
                                    <label htmlFor="category" className="required">Add New Image</label>
                                    <input type="file" className="form-control" onChange={this.editimageSubChange.bind(this)} />
                                </div>
                            </div>
                            <div className="text-right mt-3">
                                <button type="button" className="btn btn-primary" onClick={this.editsubmitSubCategory.bind(this)}>
                                    Save changes
                                </button>
                            </div>
                        </section>
                        <section>
                            <label className="header">Delete Sub Category</label>
                            <div className="form-row">
                                <div className="form-group col-sm-12">
                                    <label htmlFor="category" className="required">Select Sub Category</label>
                                    <select name="address_country" className="form-control" id="address_country" data-live-search="true" autoComplete="billing country" data-live-search-style="startsWith" onChange={this.editsubcategoryId.bind(this)}>
                                        <option value="default">Select Sub Category...</option>
                                        {
                                            subCategories.map(option =>
                                            <option key={option.id} data-id={option.catId} value={option.id} >{option.title}</option>
                                            )
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="text-right mt-3">
                                <button type="button" className="btn btn-primary" onClick={this.deleteSubmitSubCategory.bind(this)}>
                                Save changes</button>
                            </div>
                        </section>
                    </form> */}
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
                                    <button className="btn btn-primary" onClick={this.deleteSubmitSubCategory.bind(this)}>Yes</button>
                                </Toast.Body>
                            </Toast>
                        </div>
                    </div>
            </div>
        )
    }
}
export default SubCategory;