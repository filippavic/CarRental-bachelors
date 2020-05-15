import React, { Component } from 'react';
import axios from 'axios';
import Chart from "chart.js";
import { Pie } from "react-chartjs-2";

import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Container
} from "reactstrap";

import {
    chartOptions,
    parseOptions
} from "../../variables/charts.js";

import ReactLoading from 'react-loading';


export class AdminVehicleGraph extends Component {
  constructor(props){
    super(props);
    this.state = {
        isFetching: false,
        colors: ["#81d2e3", "#b6d884", "#fff68f", "#f9b48a", "	#f497aa", "#dd87b8"],
        vehicleModelData: {
            labels: [],
            datasets: [
              {
                label: "Popularni modeli",
                data: [],
                backgroundColor: []
              }
            ]
        },
        vehicleTypeData: {
            labels: [],
            datasets: [
              {
                label: "Popularne vrste modela",
                data: [],
                backgroundColor: []
              }
            ]
        }
    };
    if (window.Chart) {
        parseOptions(Chart, chartOptions());
    }
  }

  componentDidMount() {
    this.setState({ vehicleModelData: this.state.vehicleModelData, vehicleTypeData: this.state.vehicleTypeData, isFetching: true });
    
    axios.get(`/api/admin_page/modelgraph/`).then(res => {
      const data = res.data;
      let nazivi = [];
      let modeli = [];
      data && data.map (entry => {
        nazivi.push(entry.nazivmodel);
        modeli.push(entry.ukupno);
      });
      let vehicleModelData = {
        labels: nazivi,
        datasets: [
          {
            label: "Popularni modeli",
            data: modeli,
            backgroundColor: this.state.colors
          }
        ]
      };
      this.setState({ vehicleModelData: vehicleModelData });
        });
    
    axios.get(`/api/admin_page/modeltypegraph/`).then(res => {
        const data = res.data;
        let nazivi = [];
        let vrste = [];
        data && data.map (entry => {
            nazivi.push(entry.nazivvrstamodel);
            vrste.push(entry.ukupno);
        });
        let vehicleTypeData = {
            labels: nazivi,
            datasets: [
            {
                label: "Popularne vrste modela",
                data: vrste,
                backgroundColor: this.state.colors
            }
            ]
        };
        this.setState({ vehicleTypeData: vehicleTypeData, isFetching: false });
            });
  }

  componentWillUnmount() {
    // ispravlja gresku "Can't perform a React state update on an unmounted component"
    this.setState = (state,callback)=>{
        return;
    };
  }


    render() {
        return (
            <>
            <Container >
          <Row>
            <Col xl="6">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Popularni modeli
                      </h6>
                    </div>
                    <div className="col">
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="chart">
                    {this.state.isFetching ? (<ReactLoading type="bubbles" color="#8E8E93" margin={'auto'} height={'10%'} width={'10%'} />) : null}
                    <Pie
                      data={this.state.vehicleModelData}
                      options={{legend: {display: true}}}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl="6">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Popularne vrste modela
                      </h6>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="chart">
                    {this.state.isFetching ? (<ReactLoading type="bubbles" color="#8E8E93" margin={'auto'} height={'10%'} width={'10%'} />) : null}
                    <Pie
                      data={this.state.vehicleTypeData}
                      options={{legend: {display: true}}}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
            </>
        )
    }
}

export default AdminVehicleGraph