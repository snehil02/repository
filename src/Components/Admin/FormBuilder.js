import React, { Component, createRef } from 'react';
import $ from "jquery";

import './Admin.scss';

window.jQuery = $;
window.$ = $;

require("jquery-ui-sortable");
require("formBuilder");

var formBuilder;
class FormBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formDataApi : [
        {
          type:"text",
          required:false,
          label:"Text Field",
          className:"form-control",
          name:"text-1609618687596",
          access:false,
          subtype:"text"
        },
        {
          type:"select",
          required:false,
          label:"Select",
          className:"form-control",
          name:"select-1609753921341",
          access:false,
          multiple:false,
          values:[
            {
              label:"Option 1",
              value:"option-1",
              selected:true
            },
            {
              label:"Option 2",
              value:"option-2",
              selected:false
            },
            {
              label:"Option 3",
              value:"option-3",
              selected:false
            }
          ]
        }
      ],
      arr: [],
    }

  }
  
  /* Below functions call to initiate the form-builder */
    fb = createRef();
    componentDidMount() {
        $(function() {
          var fbEditor = document.getElementById("fb-editor");

          var formDataNew = window.sessionStorage.getItem('formData'),
              fbOptions = {};
          if (formDataNew) {
            fbOptions.formDataNew = formDataNew;
          }
          formBuilder = $(fbEditor).formBuilder(fbOptions);

          
        });
        
        var savedd = window.sessionStorage.getItem('formData')
        console.log(savedd);
        this.setState({array: savedd});
        console.log(this.state.array);

    }

    /* Saving the above generated form in session to call from EditSubCategory page */
    jsonData() {
        const result = formBuilder.actions.getData('json');
        if (typeof(Storage) !== "undefined") {
          window.sessionStorage.setItem('formData', result);
          var saved = window.sessionStorage.getItem('formData')
          console.log('save',saved);
        }
        else {
          document.getElementById("sessionResult").innerHTML = "Sorry, your browser does not support Web Storage...";
        }
    }

    render() {
      const {formDataApi, arr} = this.state
      // }
        return (
          <div>
            <label className="header">Generate Form Here</label>
            <div id="fb-editor" ref={this.fb} />
            <button id="getJSON" type="button" onClick={this.jsonData.bind(this)}>
              <a onClick={this.props.click}>Save Form Data</a>
            </button>
            <div id="sessionResult" ></div>
            <div className="Form-data">
              {
                arr.map(item => {
                  if(item.type === "text") {
                    return(
                    <div className="form">
                      <label className="form-field">{item.label}</label>
                      <input type={item.type}
                            name={item.name}
                      />
                    </div>
                    )
                  }
                  if(item.type === "select") {
                    return(
                    <div className="form">
                      <label className="form-field">{item.label}</label>
                      <select required={item.required} className={item.className}>
                        <option>Select an option</option>
                        {item.values.map(val => <option value={val.label}>{val.label}</option>)}
                      </select>
                    </div>
                    )
                  }
                })
              }
            </div>
          </div>
        )
    }
}
export default FormBuilder;