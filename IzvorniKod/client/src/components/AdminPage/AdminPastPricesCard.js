import React, { Component } from 'react';
import axios from 'axios';
import orderBy from 'lodash/orderBy';

import {
  Card,
  CardHeader,
  CardBody,
  Table,
  Collapse
} from "reactstrap";

import ReactLoading from 'react-loading';

var moment = require('moment');

export class AdminPastPricesCard extends Component {
  constructor(props){
    super(props);
    this.state = {
        openedCollapses: [],
        pastPrices: [],
        dates: "",
        isFetching: false
    };
  }

  componentDidMount() {
      let dates = "";
      const splitDates = (this.props.period.period).split(",");
      var periodPocetak = moment(splitDates[0].substr(1)).format("DD.MM.YYYY.");
      var periodKraj = moment(splitDates[1].slice(0, -1)).format("DD.MM.YYYY.");
      dates = periodPocetak + " - " + periodKraj;
      this.setState({ dates: dates })
  }

  collapsesToggle = collapse => {
    let openedCollapses = this.state.openedCollapses;
    if (openedCollapses.includes(collapse)) {
      this.setState({ openedCollapses: [] });
    } else {
      this.setState({ openedCollapses: [collapse], isFetching: true});
      axios.get(`/api/admin_page/periodpricelist/${this.props.period.period}`).then(res => {
        const data = res.data;
        let sortedData = orderBy(data, 'cijenapodanu', 'asc');
        this.setState({ pastPrices: sortedData, isFetching: false });
    });
    }
};


    render() {
        return (
            <>
            <Card className="card-plain" style={{marginTop: '10px'}}>
                <CardHeader
                    role="tab"
                    style={{cursor: 'pointer'}}
                    onClick={() => this.collapsesToggle(this.props.period.period)}
                    aria-expanded={this.state.openedCollapses.includes(this.props.period.period)}
                >
                <h5 className="mb-0">Prošli cjenik ({this.state.dates})</h5>
                </CardHeader>
                <Collapse
                    role="tabpanel"
                    isOpen={this.state.openedCollapses.includes(this.props.period.period)}
                >
                    <CardBody>
                    <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">Šifra modela</th>
                            <th scope="col">Proizvođač</th>
                            <th scope="col">Model</th>
                            <th scope="col">Cijena po danu</th>
                        <th scope="col" />
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.isFetching ? (<><ReactLoading type="bubbles" color="#8E8E93" height={'20%'} width={'20%'} /></>) : null}
                        {this.state.pastPrices && this.state.pastPrices.map(price => (
                            <>
                            <tr key={price.sifcjenik}>
                              <th scope="row">{price.sifmodel}</th>
                              <td>{price.nazivproizvodac}</td>
                              <td>{price.nazivmodel}</td>
                              <td>{price.cijenapodanu}</td>
                            </tr>
                            </> 
                        ))}
                    </tbody>
                    </Table>
                    </CardBody>
                </Collapse>
            </Card>
            </>
        )
    }
}

export default AdminPastPricesCard