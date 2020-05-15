import React, { Component } from 'react';
import axios from 'axios';
import Chart from "chart.js";
import { Bar } from "react-chartjs-2";
import shuffle from 'lodash/shuffle'

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
    parseOptions,
    chartExample2
} from "../../variables/charts.js";

import ReactLoading from 'react-loading';


export class AdminLocationGraph extends Component {
  constructor(props){
    super(props);
    this.state = {
        isFetching: false,
        colors: ["#81d2e3", "#b6d884", "#fff68f", "#f9b48a", "	#f497aa", "#dd87b8"],
        pickupLocationData: {
            labels: [],
            datasets: [
              {
                label: "Podružnice - prikupljanje",
                data: [],
                barThickness: 'flex',
                maxBarThickness: 40,
                backgroundColor: []
              }
            ]
        },
        dropoffLocationData: {
            labels: [],
            datasets: [
              {
                label: "Podružnice - vraćanje",
                data: [],
                barThickness: 'flex',
                maxBarThickness: 40,
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
    this.setState({ pickupLocationData: this.state.pickupLocationData, dropoffLocationData: this.state.dropoffLocationData, isFetching: true });
    
    axios.get(`/api/admin_page/pickuplocationgraph/`).then(res => {
      const data = res.data;
      let mjesta = [];
      let lokacije = [];
      data && data.map (entry => {
        mjesta.push(entry.nazivmjesto);
        lokacije.push(entry.ukupno);
      });
      let pickupLocationData = {
        labels: mjesta,
        datasets: [
          {
            label: "Podružnice - prikupljanje",
            data: lokacije,
            backgroundColor: shuffle(this.state.colors)
          }
        ]
      };
      this.setState({ pickupLocationData: pickupLocationData });
        });
    
    axios.get(`/api/admin_page/dropofflocationgraph/`).then(res => {
        const data = res.data;
        let mjesta = [];
        let lokacije = [];
        data && data.map (entry => {
            mjesta.push(entry.nazivmjesto);
            lokacije.push(entry.ukupno);
        });
        let dropoffLocationData = {
            labels: mjesta,
            datasets: [
            {
                label: "Podružnice - vraćanje",
                data: lokacije,
                backgroundColor: shuffle(this.state.colors)
            }
            ]
        };
        this.setState({ dropoffLocationData: dropoffLocationData, isFetching: false });
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
                        Popularnost podružnica
                      </h6>
                      <h4 className="mb-0">Broj prikupljanja</h4>
                    </div>
                    <div className="col">
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="chart">
                    {this.state.isFetching ? (<ReactLoading type="bubbles" color="#8E8E93" margin={'auto'} height={'10%'} width={'10%'} />) : null}
                    <Bar
                      data={this.state.pickupLocationData}
                      options={chartExample2.options}
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
                        Popularnost podružnica
                      </h6>
                      <h4 className="mb-0">Broj vraćanja</h4>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="chart">
                    {this.state.isFetching ? (<ReactLoading type="bubbles" color="#8E8E93" margin={'auto'} height={'10%'} width={'10%'} />) : null}
                    <Bar
                      data={this.state.dropoffLocationData}
                      options={chartExample2.options}
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

export default AdminLocationGraph