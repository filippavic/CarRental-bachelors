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
import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// core components
import AdminNavbar from "../components/Navbars/AdminNavbar.js";
import Sidebar from "../components/Sidebar/Sidebar.js";

import userRoutes from "../userRoutes.js";

class User extends React.Component {

    static propTypes = {
        auth: PropTypes.object.isRequired
    }

    componentDidUpdate(e) {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
        this.refs.mainContent.scrollTop = 0;
    }
    getRoutes = userRoutes => {
        return userRoutes.map((prop, key) => {
        if (prop.layout === "/user") {
            return (
            <Route
                path={prop.layout + prop.path}
                component={prop.component}
                key={key}
            />
            );
        } else {
            return null;
        }
        });
    };
    getBrandText = path => {
        for (let i = 0; i < userRoutes.length; i++) {
        if (
            this.props.location.pathname.indexOf(
                userRoutes[i].layout + userRoutes[i].path
            ) !== -1
        ) {
            return userRoutes[i].name;
        }
        }
        return "Brand";
    };



  render() {
    return (
      <>
        <Sidebar
          {...this.props}
          routes={userRoutes}
          logo={{
            innerLink: "/user/rezervacije",
            imgSrc: require("../assets/img/brand/argon-react.png"),
            imgAlt: "..."
          }}
        />
        <div className="main-content" ref="mainContent">
          <AdminNavbar
            {...this.props}
            brandText={this.getBrandText(this.props.location.pathname)}
            userInfo={this.props.auth.user}
          />
          <Switch>
            {this.getRoutes(userRoutes)}
            <Redirect from="*" to="/user/rezervacije" />
          </Switch>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
    auth: state.auth
  });

export default connect(mapStateToProps, {})(User);