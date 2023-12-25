/* Component for all Routes related to Admin panel */

import { Route, Switch } from "react-router-dom";
import { ProtectedRouteAdmin } from "../Auth/ProtectedRoute";
import AdminForgotPass from "./AdminForgotPass";
import AdminLogin from "./AdminLogin";
import AdminRequests from "./AdminRequests";
import AdminTickets from "./AdminTickets";
import Category from "./Category";
import SingleUserTicket from "./SingleUserTicket";
import SubCategory from "./SubCategory";

import './Admin.scss';
import EditCategory from "./EditCategory";
import EditSubCategory from "./EditSubCategory";
import RequestForm from "./RequestForm";
import AdminNotifications from "./AdminNotifications";

const AdminRoutes = () => {
    
    return (
      <div className="Admin">
        <Switch>
            <Route path='/adminlogin' component={AdminLogin} />
            <Route path='/forgotpassword' component={AdminForgotPass} />
            <ProtectedRouteAdmin path='/category' component={Category} />
            <Route path='/editCategory' component={EditCategory} />
            <Route path='/subcategory' component={SubCategory} />
            <Route path='/editSubCategory' component={EditSubCategory} />
            <Route path='/admin-requests' component={AdminRequests} />
            <Route path='/request-form' component={RequestForm} />
            <Route path='/admin-tickets' component={AdminTickets} />
            <Route path='/single-user-ticket' component={SingleUserTicket} />
            <Route path='/adminNotifications' component={AdminNotifications} />
          </Switch>
        </div>
    );
  }
  
  export default AdminRoutes;