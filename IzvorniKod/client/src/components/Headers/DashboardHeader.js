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

class DashboardHeader extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            rezPostotak: null,
            prihodPostotak: null,
            korisniciPostotak: null,
            rezPostotakPlus: null,
            prihodPostotakPlus: null,
            korisniciPostotakPlus: null
        };
    }

    componentWillReceiveProps(props) {
        if(!props.isResStatsFetching && props.resStats && props.resStats.length !== 0){
            if(props.resStats.brnajmovalast === 0){
                this.setState({ rezPostotak: "-" });
            }
            else{
                this.setState({ rezPostotak: (Math.abs((props.resStats.brnajmovathis/props.resStats.brnajmovalast)-1))*100 });
            }
            if(props.resStats.ukupnolast === 0){
                this.setState({ prihodPostotak: "-" });
            }
            else{
                this.setState({ prihodPostotak: (Math.abs((props.resStats.ukupnothis/props.resStats.ukupnolast)-1)).toFixed(4)*100 });
            }
            if(props.resStats.korisnicilast === 0){
                this.setState({ korisniciPostotak: "-" });
            }
            else{
                this.setState({ korisniciPostotak: (Math.abs((props.resStats.korisnicithis/props.resStats.korisnicilast)-1)).toFixed(4)*100 });
            }
            
            if(props.resStats.brnajmovathis >= props.resStats.brnajmovalast){
                this.setState({rezPostotakPlus: true});
            }
            else{
                this.setState({rezPostotakPlus: false});
            }

            if(props.resStats.ukupnothis >= props.resStats.ukupnolast){
                this.setState({prihodPostotakPlus: true});
            }
            else{
                this.setState({prihodPostotakPlus: false});
            }

            if(props.resStats.korisnicithis >= props.resStats.korisnicilast){
                this.setState({korisniciPostotakPlus: true});
            }
            else{
                this.setState({korisniciPostotakPlus: false});
            }
        }
    }

  render() {

    return (
      <>
        <div className="header bg-gradient-info pb-8 pt-5 pt-md-8" style={{zIndex:"-1"}}>
          <Container fluid>
            <div className="header-body">
              {/* Card stats */}
              <Row>
                <Col lg="6" xl="3">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            Novi korisnici
                          </CardTitle>
                          {this.props.isResStatsFetching ? (<ReactLoading type="bubbles" color="#8E8E93" height={'20%'} width={'20%'} />) : null}
                          <span className="h2 font-weight-bold mb-0">
                            {this.props.resStats.korisnicithis}
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                            <i className="fas fa-users" />
                          </div>
                        </Col>
                      </Row>
                      <p className="mt-3 mb-0 text-muted text-sm">
                        <span className={this.state.korisniciPostotakPlus ? 'text-success mr-2' : 'text-danger mr-2'}>
                          <i className={this.state.korisniciPostotakPlus ? 'fas fa-arrow-up' : 'fas fa-arrow-down'}/> {this.state.korisniciPostotak}%
                        </span>{" "}
                        <span className="text-nowrap">od prošlog mjeseca</span>
                      </p>
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
                            Nove rezervacije
                          </CardTitle>
                          {this.props.isResStatsFetching ? (<ReactLoading type="bubbles" color="#8E8E93" height={'20%'} width={'20%'} />) : null}
                          <span className="h2 font-weight-bold mb-0">
                            {this.props.resStats.brnajmovathis}
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                            <i className="fas fa-car" />
                          </div>
                        </Col>
                      </Row>
                      <p className="mt-3 mb-0 text-muted text-sm">
                        <span className={this.state.rezPostotakPlus ? 'text-success mr-2' : 'text-danger mr-2'}>
                          <i className={this.state.rezPostotakPlus ? 'fas fa-arrow-up' : 'fas fa-arrow-down'}/> {this.state.rezPostotak}%
                        </span>{" "}
                        <span className="text-nowrap">Od prošlog tjedna</span>
                      </p>
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
                            Prihod
                          </CardTitle>
                          {this.props.isResStatsFetching ? (<ReactLoading type="bubbles" color="#8E8E93" height={'20%'} width={'20%'} />) : (<span className="h2 font-weight-bold mb-0">{this.props.resStats.ukupnothis} kn</span>)}
                          
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                            <i className="fas fa-euro-sign" />
                          </div>
                        </Col>
                      </Row>
                      <p className="mt-3 mb-0 text-muted text-sm">
                        <span className={this.state.prihodPostotakPlus ? 'text-success mr-2' : 'text-danger mr-2'}>
                          <i className={this.state.prihodPostotakPlus ? 'fas fa-arrow-up' : 'fas fa-arrow-down'}/> {this.state.prihodPostotak}%
                        </span>{" "}
                        <span className="text-nowrap">Od prošlog tjedna</span>
                      </p>
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

export default DashboardHeader;
