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
import axios from 'axios';
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../variables/charts.js";

import ReactLoading from 'react-loading';

import DashboardHeader from "../components/Headers/DashboardHeader.js";

class Index extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      activeNav: 1,
      chartExample1Data: "data1",
      reservationStats: [],
      isResStatsFetching: false,
      mjeseci: ["Sij", "Velj", "Ožu", "Tra", "Svi", "Lip", "Srp", "Kol", "Ruj", "Lis", "Stu", "Pro"],
      isPrihodFetching: false,
      prihodData: {
        labels: [],
        datasets: [
          {
            label: "Prihod",
            data: []
          }
        ]
      },
      isRezervacijeFetching: false,
      rezervacijeData: {
        labels: [],
        datasets: [
          {
            label: "Rezervacije",
            data: [],
            maxBarThickness: 10
          }
        ]
      }
    };
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }

  componentDidMount() {
    //statistika
    this.setState({ reservationStats: this.state.reservationStats, isResStatsFetching: true });
    axios.get(`/api/admin_page/dashboardstats/`).then(res => {
      const resdata = res.data;
			this.setState({ reservationStats: resdata, isResStatsFetching: false });
    });
    
    //podaci za graf prihoda
    this.setState({ prihodData: this.state.prihodData, isPrihodFetching: true });
    axios.get(`/api/admin_page/revenuegraph/`).then(res => {
      const data = res.data;
      let mjeseci = [];
      let prihodi = [];
      data && data.map (entry => {
        mjeseci.push(this.state.mjeseci[entry.mjesec-1]);
        prihodi.push(entry.ukupno);
      });
      let prihodData = {
        labels: mjeseci,
        datasets: [
          {
            label: "Prihod",
            data: prihodi
          }
        ]
      };
      this.setState({ prihodData: prihodData, isPrihodFetching: false });
    });
    
    //podaci za graf rezervacija
    this.setState({ rezervacijeData: this.state.rezervacijeData, isRezervacijeFetching: true });
    axios.get(`/api/admin_page/reservationgraph/`).then(res => {
      const data = res.data;
      let mjeseci = [];
      let rezervacije = [];
      data && data.map (entry => {
        mjeseci.push(this.state.mjeseci[entry.mjesec-1]);
        rezervacije.push(entry.ukupno);
      });
      let rezervacijeData = {
        labels: mjeseci,
        datasets: [
          {
            label: "Rezervacije",
            data: rezervacije,
            maxBarThickness: 10
          }
        ]
      };
      this.setState({ rezervacijeData: rezervacijeData, isRezervacijeFetching: false });
		});
  }


  render() {

    return (
      <>
    
        <DashboardHeader isResStatsFetching={this.state.isResStatsFetching} resStats={this.state.reservationStats} />
   
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="mb-5 mb-xl-0" xl="8">
              <Card className="bg-gradient-default shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-light ls-1 mb-1">
                        Pregled
                      </h6>
                      <h2 className="text-white mb-0">Prihodi</h2>
                    </div>
                    <div className="col">
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  
                  <div className="chart">
                    {this.state.isPrihodFetching ? (<ReactLoading type="bubbles" color="#8E8E93" margin={'auto'} height={'10%'} width={'10%'} />) : null}
                    <Line
                      data={this.state.prihodData}
                      options={chartExample1.options}
                      getDatasetAtEvent={e => console.log(e)}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl="4">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        PREGLED
                      </h6>
                      <h2 className="mb-0">Rezervacije</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  <div className="chart">
                    {this.state.isRezervacijeFetching ? (<ReactLoading type="bubbles" color="#8E8E93" margin={'auto'} height={'10%'} width={'10%'} />) : null}
                    <Bar
                      data={this.state.rezervacijeData}
                      options={chartExample2.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Index;
