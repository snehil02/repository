import { Route, Switch } from "react-router-dom";
import { useEffect, useState } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle, faArrowLeft, faSpinner, faHome, faConciergeBell, faShoppingCart, faStar, faHandshake, faCreditCard, faFileWord,
  faBell, faCheck, faClock, faVideo, faGlobeAsia, faCalendarWeek, faPlaneDeparture, faPlaneArrival, faTicketAlt, faHourglass, faHourglassHalf, faPassport, faTrashAlt, faEdit, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

import './App.scss';
import SelectPortal from "./Components/UserInfo/SelectPortal";
import ReallocateDetails from './Components/UserInfo/ReallocateDetails'
import Dashboard from "./Components/Container/Dashboard";
import Login from './Components/Login/Login'
import Signup from './Components/Login/Signup'
import ForgetPassword from './Components/Login/ForgotPassword'
import Services from "./Components/Container/Services";
import SubService from "./Components/Container/SubService";
import Requests from "./Components/Container/Requests";
import AuthApi from "./Components/Auth/Auth";
import {getSessionCookie} from './Components/Auth/Cookies'
import SignOut from "./Components/Login/SignOut";
import Profile from "./Components/Container/Profile";
import Settings from "./Components/Container/Settings";
import RequestPage from "./Components/Container/RequestPage";
import { CartContext } from "./Components/Container/CartContext";
import Cart from "./Components/Container/Cart";
import Form from "./Components/Container/Form";
import Consultation from "./Components/Container/Consultation";
import HelpDesk from "./Components/Container/HelpDesk";
import Ticket from "./Components/Container/Ticket";
import AllTickets from "./Components/Container/AllTickets";
import Affiliate from "./Components/Container/Affiliate";
import Review from "./Components/Container/Review";
import ProtectedRoute, { ProtectedRouteAdmin } from "./Components/Auth/ProtectedRoute";
import AdminRoutes from "./Components/Admin/AdminRoutes";
import VerifyEmail from "./Components/Login/VerifyEmail";
import firebase, { onMessageListener, getToken } from "./firebase";
import Notifications from "./Components/Container/Notifications";
// import SideBar from "./Components/SideBar";

library.add( faCheckCircle, faArrowLeft, faSpinner, faHome, faConciergeBell, faShoppingCart, faStar, faHandshake, faCreditCard, faFileWord,
    faBell, faCheck, faClock, faVideo, faCalendarWeek, faGlobeAsia, faPlaneDeparture, faPlaneArrival, faTicketAlt, faHourglassHalf, faPassport,
    faTrashAlt, faEdit, faMapMarkerAlt )

const App = () => {

  const [session, setSession] = useState(getSessionCookie());
  const [cart, setCart] = useState([]);

  useEffect(
    () => {
      setSession(getSessionCookie());
    },
    []
  );

  return (
    <div className="App">
      <AuthApi.Provider value={session}>
        <CartContext.Provider value={[cart, setCart]} >
        <Switch>
          <Route exact path='/' component={Login} />
          <Route path='/login' component={Login} />
          <Route path='/logout' component={SignOut} />
          <Route path='/signup' component={Signup} />
          <Route path='/forgot' component={ForgetPassword} />
          <Route path='/select-portal' component={SelectPortal} />
          <Route path='/reallocateDetails' render={(props) => <ReallocateDetails {...props}  />} />
          <ProtectedRoute path='/dashboard' component={Dashboard} />
          <Route path='/services' component={Services} />
          <Route path='/subservices' component={SubService} />
          <Route path='/cart' component={Cart} />
          <Route path='/requests' component={Requests} />
          <Route path='/orders/:requestId' component={RequestPage} />
          <Route path='/profile' component={Profile} />
          <Route path='/settings' component={Settings} />
          <Route path='/form' component={Form} /> 
          <Route path='/consultation' component={Consultation} />
          <Route path='/helpdesk' component={HelpDesk} />
          <Route path='/ticket' component={Ticket} />
          <Route path='/tickets' component={AllTickets} />
          <Route path='/affiliate' component={Affiliate} />
          <Route path='/review' component={Review} />
          <Route path='/verifyEmail/:token' component={VerifyEmail} />
          <Route path='/verifyEmail' component={VerifyEmail} />
          <Route path='/notifications' component={Notifications} />
          <AdminRoutes />
        </Switch>
        </CartContext.Provider>
      </AuthApi.Provider>
    </div>
  );
}

export default App;
