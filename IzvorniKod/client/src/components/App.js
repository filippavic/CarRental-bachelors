/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Provider } from 'react-redux';
import store from '../store';
// import { store, persistor } from '../store';
// import { PersistGate } from 'redux-persist/integration/react';
import { loadUser, loadToken } from "../actions/authActions.js";
import PrivateRoute from "../routing/PrivateRoute";

import "../assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../assets/scss/argon-dashboard-react.scss";
import "../assets/css/custom.css";

import AdminLayout from "../layouts/Admin.js";
import AuthLayout from "../layouts/Auth.js";
import StartLayout from "../layouts/Start.js";
import UserLayout from "../layouts/User.js";


function App() {
	useEffect(() => {
        store.dispatch(loadToken());
		store.dispatch(loadUser());
	}, []);

	return (
		<div className="App">
			<Provider store={store}>
                    <BrowserRouter>
                    <Switch>
                        <PrivateRoute path="/user" component={UserLayout} />
                        <PrivateRoute path="/admin" component={AdminLayout} />
                        <Route path="/auth" render={props => <AuthLayout {...props} />} />
                        <Route path="/" render={props => <StartLayout {...props} />} />
                    </Switch>
                    </BrowserRouter>
            </Provider>
		</div>
	);
}

export default App;