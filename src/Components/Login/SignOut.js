import React from 'react';
import { Link } from "react-router-dom";

import './Login.scss';

const SignOut = () => {
    
  return (
      <div className="main-content d-flex align-item-center">
        <div className="container-fluid">
            <div className="navbar navbar-public">
                <a href="/" className="navbar-brand">
                    <img src="../../images/Embassy_Logo_png_NMDS_1_square_Blue_1.png"  alt="Company Logo" />
                </a>
            </div>
            <main className="content">
                <div className="container container-xs text-center">
                    <h1 className="mb-4">Have a great day!</h1>
                    <p className="text-muted mb-5">You have signed out successfully.</p>
                    <Link to="/login"><span>Sign back in</span></Link>
                </div>
            </main>
        </div>
    </div>
    )
  };
  export default SignOut;
