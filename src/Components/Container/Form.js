import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Alert from 'react-bootstrap/Alert'

import SideBar from './SideBar';
import Navigation from './Navigation';


class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            apiData: null,
            arrForm:[],
            requestId:'',
            text:'',
            sideMenuOpen: false,
            current: {},
            data: [],
            files: [],
            fileName: [],
            show: false,
            apiMessage:'',
            alertStatus:'',
            reqTitle: '',
            errMessage:''
        }
    }

    componentDidMount () {
        const {dataForm, requestId, title} = (this.props.location && this.props.location.state) || {};
        const form = JSON.parse(dataForm);
        const formnew = JSON.parse(form);
        this.setState({arrForm : formnew, requestId : requestId, reqTitle : title});

        
        const newArrForm = formnew.map(arr => ({...arr, input : ''}));
        // console.log("newArrForm",newArrForm);
        this.setState({
            arrForm: newArrForm,
        });
    };

    /* Sidebar Toggeling for mobile view */
    sideBarToggle = () => {
        this.setState((prevState) => {
            return { sideMenuOpen: !prevState.sideMenuOpen };
        });
        if (this.state.sideMenuOpen) {
            document.body.classList.remove('scroll-stop');
        }
        else {
            document.body.classList.add('scroll-stop');
        }
    };

    /* Calling Api for uploading Attachments for form */
    submitChanges = (e) => {
        e.preventDefault();
            
        const files = this.state.files;
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append(`file[${i}]`, files[i])
        }
        if (files.length != 0) {
          fetch('/api/api/v1/uploadDocument', {
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
              // console.log(res.result);
              if (res.status_code === 200){
                  const {arrForm} = this.state;
                  const newValue = arrForm.findIndex(item => item.type == 'file');
                  let newArray = [...arrForm];
                  newArray[newValue] = {...newArray[newValue], input: res.result};
                  this.setState({
                      arrForm: newArray,
                  });
                  // console.log('after image',this.state.arrForm);
                  this.setState({ errMessage : ''});
                  this.formSubmit();
              }
          })
        }
        else {
          this.setState({ errMessage : 'Please upload attactments'});
        }
      };
    
    /* Calling Api for submitting the User filled form back to Admin */
    formSubmit = () => {
        const stringJson = JSON.stringify(this.state.arrForm);
        // console.log(stringJson);
        const formData = new FormData();

        formData.append('requestId', this.state.requestId);
        formData.append('jsonForm', stringJson);

        fetch('/api/api/v1/userRequestForm', {
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
            console.log(res.result);
            if (res.status === 200){
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
    };
    
    /* Handling files(attachments) on uploading */
    handleFiles = (event) => {
       this.setState({files : event.target.files, fileName : event.target.files[0].name});
       console.log(this.state.files);
       const files = this.state.files;
        for (let i = 0; i < files.length; i++) {
            this.setState({fileName : files[i].name});
        }

    };

    /* Dynamically handling the information filled by user */
    onChange = (e, key, type = "single") => {
    
        const {arrForm} = this.state;
        // console.log(arrForm)
        if (type === "single") {
            const newValue = arrForm.findIndex(item => item.name == key);
            let newArray = [...arrForm];
            newArray[newValue] = {...newArray[newValue], input: e.target.value};
            this.setState({
                arrForm: newArray,
            });
        }
        else {
            const newValue = arrForm.findIndex(item => item.name == key);
            let newArray = [...arrForm];
            let found = this.state[key]
                ? this.state[key].find(d => d === e.target.value)
                : false;
        
            if (found) {
                let data = this.state[key].filter(d => {
                return d !== found;
                });
                newArray[newValue] = {...newArray[newValue], input: data};
            } else {
                console.log("found", key, this.state[key]);
                let others = this.state[key] ? [...this.state[key]] : [];
                newArray[newValue] = {...newArray[newValue], input: [e.target.value, ...others]};
            }
            
            this.setState({
                arrForm: newArray,
            });
        }
        // console.log("arrForm",this.state.arrForm);
        // if(newValue) return this.setState(this.state.map(item => {
        //   if (item.name == key) {
        //     return item.res ? { ...item, res: e.target.value } : { ...item, res: e.target.value};
        //   }
        //   return item;
        // })
        // );
        //console.log(`${key} changed ${e.target.value} type ${type}`);
        if (type === "single") {
          this.setState(
            {
              [key]: e.target.value
            },
            () => {}
          );
        } else {
          // Array of values (e.g. checkbox): TODO: Optimization needed.
          let found = this.state[key]
            ? this.state[key].find(d => d === e.target.value)
            : false;
    
          if (found) {
            let data = this.state[key].filter(d => {
              return d !== found;
            });
            this.setState({
              [key]: data
            });
          } else {
            console.log("found", key, this.state[key]);
            // this.setState({
            //   [key]: [e.target.value, ...this.state[key]]
            // });
            let others = this.state[key] ? [...this.state[key]] : [];
            this.setState({
              [key]: [e.target.value, ...others]
            });
          }
        }
      };
    
      /* Dynamically building the form getting for particular Service */
      renderForm = () => {

        let {arrForm, fileName} = this.state;
    
        let formUI = arrForm.map((m, i) => {
          let key = m.name;
          let type = m.type || "text";
          let name = m.name;
          let value = m.name;
          let label = m.label;
          let target = key;
          value = this.state[target] || "";
    
          let input = (
            <input
            //   {...props}
              className="form-input"
              type={type}
              key={key}
              name={name}
              value={value}
              onChange={e => {
                this.onChange(e, target);
              }}
            />
          );

          if(type === "file") {
            return(
            <div key={key} className="form-group">
                <label className="form-label">{label}</label>
                <input className="form-input" type={type} name={name} accept=".png, .pdf, .jpeg, .jpg, .docx" onChange={this.handleFiles} multiple/>
                <p style={{color : "red"}}>{this.state.errMessage}</p>
            </div>
            )
          }  
          if (type == "radio-group") {
            input = m.values.map((o, i) => {
                let checked = o.value == value;
              return (
                <React.Fragment key={"fr" + o.label}>
                    <div className="radio-btn">
                        <input
                            // {...props}
                            className="form-input"
                            type="radio"
                            key={i}
                            id={i}
                            name={m.name}
                            // checked={checked}
                            value={o.value}
                            onChange={e => {
                            this.onChange(e, m.name);
                            }}
                        />
                        <label htmlFor={o.label} key={"ll" + i}>{o.label}</label>
                    </div>
                </React.Fragment>
              );
            });
            input = <div className="form-group-radio">{input}</div>;
          }
    
          if (type == "select") {
            input = m.values.map(o => {
              let checked = o.value == value;
              //console.log("select: ", o.value, value);
              return (
                <option
                //   {...props}
                  className="form-input"
                  key={o.value}
                  value={o.value}
                >
                  {o.value}
                </option>
              );
            });
    
            //console.log("Select default: ", value);
            input = (
              <select
                value={value}
                onChange={e => {
                  this.onChange(e, m.name);
                }}
              >
                {input}
              </select>
            );
          }
    
          if (type == "checkbox-group") {
            input = m.values.map((o, i) => {
              //let checked = o.value == value;
              let checked = false;
              if (value && value.length > 0) {
                checked = value.indexOf(o.value) > -1 ? true : false;
              }
              //console.log("Checkbox: ", checked);
              return (
                <React.Fragment key={"cfr" + o.label}>
                    <div className="checkboxes">
                        <input
                            // {...props}
                            className="form-input"
                            type="checkbox"
                            key={i}
                            id={i}
                            name={o.label}
                            checked={checked}
                            value={o.value}
                            onChange={e => {
                            this.onChange(e, m.name, "multiple");
                            }}
                        />
                        <label htmlFor={o.label} key={"ll" + i}>{o.label}</label>
                    </div>
                </React.Fragment>
              );
            });
    
            input = <div className="form-group-checkbox">{input}</div>;
          }
    
          return (
            <div key={"g" + key} className="form-group">
              <label className="form-label" key={"l" + key} htmlFor={key}>
                {m.label}
              </label>
              {input}
            </div>
          );
        });
        return formUI;
      };

    render(){
        const {arrForm, errMessage} = this.state;
        
        let sideClass = 'Container'
        if (this.state.sideMenuOpen) {
            sideClass = 'Container sidebar-open'
        };

        return(
            <div className={sideClass}>
                <SideBar />
                <div className="dashboard col">
                    <Navigation menuButton={this.sideBarToggle} />
                    <div className="content">
                      <div className="back">
                        <Link to="/requests">
                            <i className="fas fa-angle-left" aria-hidden="true"></i>
                            Requests
                        </Link>
                      </div>
                        <form className="dynamic-form container" onSubmit={this.submitChanges.bind(this)}>
                          <label className="form-header">{this.state.reqTitle}</label>
                          {this.renderForm()}
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary" data-toggle="modal">
                                    Save changes
                                </button>
                            </div>
                        </form>
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
export default Form;