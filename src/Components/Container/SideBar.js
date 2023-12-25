import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './Container.scss';
import AuthApi from '../Auth/Auth';

const SideBar = () => {
    const session = useContext(AuthApi);
    return (
        <aside className="col sidebar">
            <div className="sidebar-sticky">
                <a href="/portal" className="navbar-brand d-none d-sm-block" data-pjax="">
                {/* <img src="logo-white.png" alt="" width="100%"/> */}
                </a>
                <ul className="nav flex-column" role="navigation">
                    <li className="nav-item title">Activity</li>
                    <li className="nav-item">
                        <Link to={{
                            pathname:'/dashboard',
                            state:{CurrentUser : session}
                            }} className="nav-link">
                        <span>
                            <FontAwesomeIcon icon="home" />
                            Dashboard
                        </span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/services" className="nav-link">
                        <span>
                            <FontAwesomeIcon icon="concierge-bell" />
                            Services
                        </span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/requests" className="nav-link">
                        <span>
                            <FontAwesomeIcon icon="shopping-cart" />
                            Requests
                        </span>
                        </Link>
                    </li>
                    <li className="nav-item title">Billing</li>
                    <li className="nav-item">
                        <Link to="/dashboard" className="nav-link">
                        <span>
                            <FontAwesomeIcon icon="file-word" />
                            Invoices
                        </span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/dashboard" className="nav-link">
                        <span>
                            <FontAwesomeIcon icon="credit-card" />
                            Payment
                        </span>
                        </Link>
                    </li>
                    <li className="nav-item title">Account</li>
                    <li className="nav-item">
                        <Link to="/affiliate" className="nav-link">
                        <span>
                            <FontAwesomeIcon icon="handshake" />
                            Refer a friend
                        </span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/review" className="nav-link">
                        <span>
                            <FontAwesomeIcon icon="star" />
                            Leave review
                        </span>
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
    );
}
export default SideBar;