import React, { Component } from "react";
import { Link } from "react-router-dom";

class RequestForm extends Component {
 constructor(props) {
     super(props);
     this.state = {
         form: [],
         emptyForm:[],
         title: ''
     }
 };

    /* Filtering out the different forms(user filled and empty forms) */
    componentDidMount() {
        const {emptyForm, userDetailform, formTitle} = (this.props.location && this.props.location.state) || {};
        if(emptyForm) {
            const form = JSON.parse(emptyForm);
            const formnew = JSON.parse(form);
            console.log(formnew);
            this.setState({emptyForm : formnew, title : formTitle});
        }
        else {
            const formnew = JSON.parse(userDetailform);
            console.log(formnew);
            this.setState({form : formnew, title : formTitle});
        }
    };

    /* checking for attachments uploaded by user */
    fileHandle = (fileType) => {
        var type = fileType;
        // console.log(type);
        var validExt = "png, jpeg, jpg";
        var getFileExt = type.split(".").pop();
        var pos = validExt.indexOf(getFileExt);
        if(pos < 0) {
            return <div className="block-button"><a className="button-link" href={fileType} target="_blank" rel="noreferrer">View Attachment</a></div>;
        } else {
            return (
                <div className="images">
                    {/* <label>Image</label> */}
                    <img src={fileType} alt="image" style={{width: "100px"}}/>
                </div>
            );
        };
    };

    render() {
        const {form, emptyForm} = this.state;
        const view = form.length === 0 ? <> 
                            
                                    {
                                        emptyForm.map((item, i) => {
                                        if(item.type === "text") {
                                            return(
                                            <div key={i} className="form-group">
                                                <label className="form-label">{item.label}</label>
                                                <input type={item.type}
                                                        name={item.name}
                                                />
                                            </div>
                                            )
                                        }
                                        if(item.type === "select") {
                                            return(
                                            <div key={i} className="form-group">
                                                <label className="form-label">{item.label}</label>
                                                <select required={item.required} className={item.className}>
                                                    <option>Select an option</option>
                                                    {item.values.map((val, i) => <option key={i} value={val.value}>{val.label}</option>)}
                                                </select>
                                            </div>
                                            )
                                        }
                                        if(item.type === "textarea") {
                                            return(
                                            <div key={i} className="form-group">
                                                <label className="form-label">{item.label}</label>
                                                <textarea type={item.type} name={item.name} required={item.required} className={item.className}>
                                                </textarea>
                                            </div>
                                            )
                                        }
                                        if(item.type === "checkbox-group") {
                                            return(
                                            <div key={i} className="form-group">
                                                <label className="form-label">{item.label}</label>
                                                {item.values.map((val, j) => 
                                                <div key={j} className="checkboxes">
                                                    <input type="checkbox" value={val.value} id={j}/>
                                                    <label htmlFor={j}>{val.label}</label>
                                                </div>
                                                )}
                                            </div>
                                            )
                                        }
                                        if(item.type === "radio-group") {
                                            return(
                                            <div key={i} className="form-group">
                                                <label className="form-label">{item.label}</label>
                                                {item.values.map((val, j) =>
                                                <div key={j} className="radio">
                                                    <input type="radio" value={val.value} id={j}/>
                                                    <label htmlFor={j}>{val.label}</label>
                                                </div>
                                                )}
                                            </div>
                                            )
                                        }
                                        if(item.type === "textarea") {
                                            return(
                                            <div key={i} className="form-group">
                                                <label className="form-label">{item.label}</label>
                                                <input type={item.type} name={item.name} required={item.required} className={item.className} />
                                            </div>
                                            )
                                        }
                                        if(item.type === "date") {
                                            return(
                                            <div key={i} className="form-group">
                                                <label className="form-label">{item.label}</label>
                                                <input type={item.type} name={item.name} required={item.required} className={item.className} />
                                            </div>
                                            )
                                        }
                                        if(item.type === "file") {
                                            return(
                                            <div key={i} className="form-group">
                                                <label className="form-label">{item.label}</label>
                                                <input type={item.type} name={item.name} required={item.required} className={item.className} />
                                            </div>
                                            )
                                        }
                                        if(item.type === "number") {
                                            return(
                                            <div key={i} className="form-group">
                                                <label className="form-label">{item.label}</label>
                                                <input type={item.type} name={item.name} required={item.required} className={item.className} />
                                            </div>
                                            )
                                        }
                                        })
                                    }
                            </> : <>
                            { 
                                form.map((item, i) => {
                                if(item.type === "text") {
                                    return(
                                    <div key={i} className="form-group">
                                        <label className="form-label">{item.label}</label>
                                        <input type={item.type}
                                                name={item.name}
                                                value={item.input}
                                        />
                                    </div>
                                    )
                                }
                                if(item.type === "select") {
                                    return(
                                    <div key={i} className="form-group">
                                        <label className="form-label">{item.label}</label>
                                        <select required={item.required} className={item.className} value={item.input}>
                                            <option>Select an option</option>
                                            {item.values.map((val, i) => <option key={i} value={val.value}>{val.label}</option>)}
                                        </select>
                                    </div>
                                    )
                                }
                                if(item.type === "textarea") {
                                    return(
                                    <div key={i} className="form-group">
                                        <label className="form-label">{item.label}</label>
                                        <textarea type={item.type} name={item.name} required={item.required} value={item.input} className={item.className}>
                                        </textarea>
                                    </div>
                                    )
                                }
                                if(item.type === "checkbox-group") {
                                    return(
                                    <div key={i} className="form-group">
                                        <label className="form-label">{item.label}</label>
                                        {item.input.map((val, j) => 
                                        <div key={j} className="checkboxes">
                                            {/* <input type="checkbox" value={val} id={j} checked/>
                                            <label htmlFor={j}>{val}</label> */}
                                            <ul>
                                                <li>{val}</li>
                                            </ul>
                                        </div>
                                        )}
                                    </div>
                                    )
                                }
                                if(item.type === "radio-group") {
                                    return(
                                    <div key={i} className="form-group">
                                        <label className="form-label">{item.label}</label><br/>
                                        {/* {item.values.map((val, j) =>
                                        <div key={j} className="radio">
                                            <input type="radio" value={val.value} id={j}/>
                                            <label htmlFor={j}>{val.label}</label><br></br>
                                        </div>
                                        )} */}
                                        <ul>
                                            <li>{item.input}</li>
                                        </ul>
                                    </div>
                                    )
                                }
                                if(item.type === "textarea") {
                                    return(
                                    <div key={i} className="form-group">
                                        <label className="form-label">{item.label}</label>
                                        <input type={item.type} name={item.name} required={item.required} className={item.className} />
                                    </div>
                                    )
                                }
                                if(item.type === "date") {
                                    return(
                                    <div key={i} className="form-group">
                                        <label className="form-label">{item.label}</label>
                                        <input type={item.type} name={item.name} required={item.required} className={item.className} value={item.input}/>
                                    </div>
                                    )
                                }
                                if(item.type === "file") {
                                    return(
                                    <div key={i} className="form-group">
                                        
                                        <label className="form-label">{item.label}</label>
                                        {
                                            item.input.map((val, j) =>
                                            <div key={j}>
                                                {this.fileHandle(val)}
                                            </div>
                                            )
                                        }
                                    </div>
                                    )
                                }
                                if(item.type === "number") {
                                    return(
                                    <div key={i} className="form-group">
                                        <label className="form-label">{item.label}</label>
                                        <input type={item.type} name={item.name} required={item.required} className={item.className} value={item.input}/>
                                    </div>
                                    )
                                }
                            })
                            }     
                            </>;
        return (
            <div className="content">
                <div className="back">
                    <Link to="/admin-requests">
                        <i className="fas fa-angle-left" aria-hidden="true"></i>
                        Back
                    </Link>
                </div>
                <div className="dynamic-form container">
                <label className="form-header">{this.state.title}</label>
                    {view}
                </div>
            </div>
        )
    }

}
export default RequestForm;