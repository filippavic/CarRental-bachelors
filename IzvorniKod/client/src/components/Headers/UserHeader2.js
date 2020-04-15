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

// reactstrap components
import { Container, Row } from "reactstrap";

import ReactLoading from 'react-loading';

class UserHeader2 extends React.Component {
  render() {
    return (
      <>
        <div className="header bg-gradient-info pb-8 pt-5 pt-md-8" style={{zIndex:"-1"}}>
          <Container fluid>
            <div className="header-body">
              <Row style={{flexDirection:'column', alignItems:"center"}}>
                {this.props.reservations && this.props.reservations.length === 0 ? (<h1 style={{color: '#ffffff'}}>Trenutno nemate aktivne rezervacije.</h1>) : (<h1 style={{color: '#ffffff'}}>Trenutne rezervacije</h1>)}           
                <h4 style={{color: '#ffffff', fontWeight: 300}}>Ovdje možete vidjeti trenutno aktivne rezervacije. Rezervaciju možete poništiti najkasnije tjedan dana prije početka.</h4>
              </Row>
              <Row style={{justifyContent:"center"}}>
                {this.props.isFetching ? (<ReactLoading type="bubbles" color="#FFFFFF" height={'5%'} width={'5%'} />) : null}
              </Row>
            </div>
          </Container>
        </div>
      </>
    );
  }
}

export default UserHeader2;
