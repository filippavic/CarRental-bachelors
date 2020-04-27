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
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// reactstrap components
import {
  Card,
  CardHeader,
  Table,
  Container
} from "reactstrap";
// react component for creating dynamic tables

// core components
import PastRentHeader from "../components/Headers/PastRentHeader.js";
import UserTableRow from "../components/UserPage/UserTableRow";

import ReactLoading from 'react-loading';

class Povijest extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
      pastReservations: [],
      pastStats: [],
      isFetching: false
    };
  }

  static propTypes = {
    auth: PropTypes.object.isRequired
  }

  componentDidMount() {
    this.setState({ pastReservations: this.state.pastReservations, pastStats: this.state.pastStats, isFetching: true });
    axios.get(`/api/user_page/pastrents/${this.props.auth.user.sifkorisnik}`).then(res => {
			const pastrents = res.data;
			this.setState({ pastReservations: pastrents });
    });
    axios.get(`/api/user_page/paststats/${this.props.auth.user.sifkorisnik}`).then(res => {
      const paststats = res.data;
			this.setState({ pastStats: paststats, isFetching: false });
		});
  }


  render() {
    return (
      <>
        <PastRentHeader isFetching={this.state.isFetching} paststats={this.state.pastStats}/>
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Table */}
          <div className="col">
            <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Prethodni najmovi</h3>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Vozilo</th>
                      <th scope="col">Datum prikupljanja</th>
                      <th scope="col">Datum vraćanja</th>
                      <th scope="col">Lokacija prikupljanja</th>
                      <th scope="col">Lokacija vraćanja</th>
                      <th scope="col">Iznos</th>
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.isFetching ? (<ReactLoading type="bubbles" color="#8E8E93" height={'20%'} width={'20%'} />) : null}
                  {this.state.pastReservations && this.state.pastReservations.map(reservation => (
                    <UserTableRow key={reservation.sifnajam} reservation={reservation}/>))}
                  </tbody>
                </Table>
            </Card>
          </div>
            

        </Container>
      </>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {})(Povijest);
