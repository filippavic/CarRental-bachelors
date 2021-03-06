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
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/authActions';

// reactstrap components
import {
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col
} from "reactstrap";

class AdminNavbar extends React.Component {

  static propTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired
  }

  render() {
    const { isAuthenticated } = this.props.auth;

    return (
      <>
        <Navbar
          className="navbar-top navbar-horizontal navbar-dark"
          expand="md"
        >
          <Container className="px-4">
            <NavbarBrand to="/" tag={Link}>
              <h2 style={{color: "white", textTransform:"none"}}>Rent-a-car</h2>
            </NavbarBrand>
            <button className="navbar-toggler" id="navbar-collapse-main">
              <span className="navbar-toggler-icon" />
            </button>
            <UncontrolledCollapse navbar toggler="#navbar-collapse-main">
              <div className="navbar-collapse-header d-md-none">
                <Row>
                  <Col className="collapse-brand" xs="6">
                    <Link to="/">
                      <h2 >Rent-a-car</h2>
                    </Link>
                  </Col>
                  <Col className="collapse-close" xs="6">
                    <button
                      className="navbar-toggler"
                      id="navbar-collapse-main"
                    >
                      <span />
                      <span />
                    </button>
                  </Col>
                </Row>
              </div>
              <Nav className="ml-auto" navbar>
                {isAuthenticated ? null : (
                  <NavItem>
                    <NavLink
                      className="nav-link-icon"
                      to="/auth/register"
                      tag={Link}
                    >
                      <i className="ni ni-circle-08" />
                      <span className="nav-link-inner--text">Registracija</span>
                    </NavLink>
                  </NavItem>
                )
                }
                {isAuthenticated ? null : (
                  <NavItem>
                    <NavLink
                      className="nav-link-icon"
                      to="/auth/login"
                      tag={Link}
                    >
                      <i className="ni ni-key-25" />
                      <span className="nav-link-inner--text">Prijava</span>
                    </NavLink>
                  </NavItem>
                )
                }
                {isAuthenticated && this.props.userInfo && this.props.userInfo.sifvrstakorisnik === 1 ? (
                  <NavItem>
                    <NavLink className="nav-link-icon" to="/user" tag={Link}>
                      <i className="ni ni-app" />
                      <span className="nav-link-inner--text">Upravlja??ka plo??a</span>
                    </NavLink>
                  </NavItem>
                ) : null
                }
                {isAuthenticated && this.props.userInfo && this.props.userInfo.sifvrstakorisnik === 2 ? (
                  <NavItem>
                    <NavLink className="nav-link-icon" to="/admin" tag={Link}>
                      <i className="ni ni-app" />
                      <span className="nav-link-inner--text">Upravlja??ka plo??a</span>
                    </NavLink>
                  </NavItem>
                ) : null
                }
                {isAuthenticated ? (
                  <NavItem>
                    <NavLink className="nav-link-icon" onClick={this.props.logout} href="#">
                      <i className="ni ni-button-power" />
                      <span className="nav-link-inner--text">Odjava</span>
                    </NavLink>
                  </NavItem>
                ) : null
                }                              
              </Nav>
            </UncontrolledCollapse>
          </Container>
        </Navbar>
      </>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(AdminNavbar);
