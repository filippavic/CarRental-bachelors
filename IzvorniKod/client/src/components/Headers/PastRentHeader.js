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
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

import ReactLoading from 'react-loading';

class PastRentHeader extends React.Component {
    
  render() {
    return (
      <>
        <div className="header bg-gradient-info pb-8 pt-5 pt-md-8" style={{zIndex:"-1"}}>
          <Container fluid>
            <div className="header-body">
              {/* Card stats */}
              <Row className="justify-content-center">
                <Col lg="6" xl="3">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            Ukupno najmova
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            {this.props.isFetching ? (<ReactLoading type="bubbles" color="#8E8E93" height={'20%'} width={'20%'} />) : null}
                            {this.props.paststats.brnajmova}
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                            <i className="fas fa-car" />
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="6" xl="3">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            Ukupan trošak
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            {this.props.isFetching ? (<ReactLoading type="bubbles" color="#8E8E93" height={'20%'} width={'20%'} />) : null}
                            {this.props.paststats.sumaiznos} {this.props.isFetching ? null : "kn"}
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                            <i className="fas fa-dollar-sign" />
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
      </>
    );
  }
}

export default PastRentHeader;
