import { extend } from 'jquery';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class VerifyEmail extends Component {
    constructor(props){
        super(props);
        this.state = {
            token:'',
            invalidToken:'',
            successMsg:'',
            failedMsg:''
        }
    };

    /* Calling Api for posting the user filled info. */
    componentDidMount(){
        const token = this.props.match.params.token;
        // console.log('token', token);
        this.setState({ token : token });
        if(token){
            fetch('/api/api/v1/emailVerify', {
                method: 'POST',
                headers: {
                // 'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: token
                })
            })
            .then((Response) => Response.json())
            .then((res) => {
                // console.log(res);
                if (res.status_code === 200){
                    // console.log('working');
                    const result = <div>
                                        Your Email has been verified. Click here to <Link to="/login">Login</Link>.
                                    </div>
                    this.setState({ successMsg : result });
                }
                else {
                    // console.log('null')
                    this.setState({ successMsg : res.message });
                }
            })
        }
        else{
            return this.setState({invalidToken : 'Invalid'});
        }
    }

    render() {
        return (
            <div className="verify-email container container-xs">
                <div className="logo"><img src="../../images/Embassy_Logo_png_NMDS_1_square_Blue_1.png" alt="Company Logo" /></div>
                    {this.state.successMsg}
                    {this.state.invalidToken}
            </div>
        )
    }
}
export default VerifyEmail;