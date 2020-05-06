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
import orderBy from 'lodash/orderBy'

// reactstrap components
import {
  Card,
  CardHeader,
  Table,
  Container,
  UncontrolledAlert
} from "reactstrap";
// react component for creating dynamic tables

import AdminVehicleHeader from "../components/Headers/AdminVehicleHeader.js";
import AdminVehicleTableRow from "../components/AdminPage/AdminVehicleTableRow";
import VehicleDetailsModal from "../components/AdminPage/VehicleDetailsModal.js";

import ReactLoading from 'react-loading';

class AdminVozila extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
              vehicles: [],
              isFetching: false,
              msgFail: null,
              msgSuccess: null,
              isSortedAscending: null,
              isModalOpen: false,
              sifVozilo: null
      };
    }

    static propTypes = {
      auth: PropTypes.object.isRequired
    }

    componentDidMount() {
      this.setState({ vehicles: this.state.vehicles, isFetching: true });
      axios.get(`/api/admin_page/vehicles/`).then(res => {
          const vehicles = res.data;
          let sortedVehicles = orderBy(vehicles, 'sifvozilo', 'asc');
        this.setState({ vehicles: sortedVehicles, isSortedAscending: true, isFetching: false});
      });
    }

    //sortiranje
    sorting = (e) => {
        e.preventDefault();
        let sortby = e.target.getAttribute('sortby');
        let order = this.state.isSortedAscending ? 'desc' : 'asc';
        let sortedVehicles = orderBy(this.state.vehicles, sortby, order);
        this.setState({vehicles: sortedVehicles, isSortedAscending: !this.state.isSortedAscending});  
    }

    //otvaranje/zatvaranje prozora
    toggleModal = (e) => {
      e.preventDefault();
      this.setState({isModalOpen: !this.state.isModalOpen});
    };

    //detalji o vozilu
    openDetails = (value) => {
      this.setState({sifVozilo: value}, function () {this.setState({isModalOpen: true})})
    }


  render() {
    return (
      <>
        {this.state.isModalOpen ? (
          <VehicleDetailsModal sifVozilo={this.state.sifVozilo} isModalOpen={this.state.isModalOpen} toggleModal={this.toggleModal}/>
        ) : null}
        <AdminVehicleHeader brvozila={this.state.vehicles.length}/>
        {/* Page content */}
        <Container className="mt--7" fluid>
          { this.state.msgFail ? (<UncontrolledAlert color="danger">{this.state.msgFail}</UncontrolledAlert>) : null }
          { this.state.msgSuccess ? (<UncontrolledAlert color="success">{this.state.msgSuccess}</UncontrolledAlert>) : null }
          {/* Table */}
          <div className="col">
            <Card className="shadow">
                <CardHeader className="d-flex justify-content-between border-0">
                  <h3 className="mb-0">Vozila u vlasništvu</h3>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th sortby="sifvozilo" style={{cursor: 'pointer'}} onClick={e => this.sorting(e)} scope="col">
                          <span sortby="sifvozilo">Šifra</span>
                          <i sortby="sifvozilo" className="fas fa-sort" />
                      </th>
                      <th sortby="nazivproizvodac" style={{cursor: 'pointer'}} onClick={e => this.sorting(e)} scope="col">
                          <span sortby="nazivproizvodac">Proizvođač</span>
                          <i sortby="nazivproizvodac" className="fas fa-sort" />
                      </th>
                      <th sortby="nazivmodel" style={{cursor: 'pointer'}} onClick={e => this.sorting(e)} scope="col">
                          <span sortby="nazivmodel">Model</span>
                          <i sortby="nazivmodel" className="fas fa-sort" />
                      </th>
                      <th sortby="nazivvrstamodel" style={{cursor: 'pointer'}} onClick={e => this.sorting(e)} scope="col">
                          <span sortby="nazivvrstamodel">Vrsta</span>
                          <i sortby="nazivvrstamodel" className="fas fa-sort" />
                      </th>
                      <th sortby="registratskaoznaka" style={{cursor: 'pointer'}} onClick={e => this.sorting(e)} scope="col">
                          <span sortby="registratskaoznaka">Registracija</span>
                          <i sortby="registratskaoznaka" className="fas fa-sort" />
                      </th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.isFetching ? (<><ReactLoading type="bubbles" color="#8E8E93" height={'20%'} width={'20%'} /></>) : null}
                  {this.state.vehicles && this.state.vehicles.map(vehicle => (
                    <AdminVehicleTableRow key={vehicle.sifvozilo} vehicle={vehicle} openDetails={(value) => this.openDetails(value)}/>))}
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

export default connect(mapStateToProps, {})(AdminVozila);
