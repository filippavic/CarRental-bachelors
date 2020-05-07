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
  Alert,
  Col,
  Row,
  Button
} from "reactstrap";
// react component for creating dynamic tables

import AdminVehicleHeader from "../components/Headers/AdminVehicleHeader.js";
import AdminVehicleTableRow from "../components/AdminPage/AdminVehicleTableRow";
import VehicleDetailsModal from "../components/AdminPage/VehicleDetailsModal.js";
import AddVehicleModal from "../components/AdminPage/AddVehicleModal.js";

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
              sifVozilo: null,
              isAddModalOpen: false
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

    //zatvaranje fail alerta
    onFailDismiss = (e) => {
      this.setState({msgFail: null});
    };

    //zatvaranje success alerta
    onSuccessDismiss = (e) => {
      this.setState({msgSuccess: null});
    };

    //otvaranje/zatvaranje prozora s detaljima
    toggleModal = (e) => {
      e.preventDefault();
      this.setState({isModalOpen: !this.state.isModalOpen});
    };

    //detalji o vozilu
    openDetails = (value) => {
      this.setState({sifVozilo: value}, function () {this.setState({isModalOpen: true})})
    }

    //otvaranje/zatvaranje prozora za dodavanje vozila
    toggleAddModal = (e) => {
      e.preventDefault();
      this.setState({isAddModalOpen: !this.state.isAddModalOpen});
    };

    //dodavanje novog vozila
    addNewVehicle = (newVehicle) => {
      //headers
      const config = {
        headers: {
            'Content-Type': 'application/json'
        }
      }

      const body = JSON.stringify(newVehicle);

      axios.post('/api/admin_page/newvehicle', body, config)
      .then(res => {
        if(res.status === 200){
          this.setState({msgSuccess: "Vozilo uspješno dodano"});

          //ponovno dohvacanje vozila
          this.setState({ vehicles: this.state.vehicles, isFetching: true });
          axios.get(`/api/admin_page/vehicles/`).then(res => {
              const vehicles = res.data;
              let sortedVehicles = orderBy(vehicles, 'sifvozilo', 'asc');
            this.setState({ vehicles: sortedVehicles, isSortedAscending: true, isFetching: false});
          });
        }
        else{
          throw Error;
        }       
      })
      .catch(err => {
          this.setState({msgFail: "Registracija već postoji"})
      });

      this.setState({isAddModalOpen: false});
    };


  render() {
    return (
      <>
        {this.state.isAddModalOpen ? (
          <AddVehicleModal isModalOpen={this.state.isAddModalOpen} toggleModal={this.toggleAddModal} addNewVehicle={(newVehicle) => this.addNewVehicle(newVehicle)}/>
        ) : null}  
        {this.state.isModalOpen ? (
          <VehicleDetailsModal sifVozilo={this.state.sifVozilo} isModalOpen={this.state.isModalOpen} toggleModal={this.toggleModal}/>
        ) : null}
        <AdminVehicleHeader brvozila={this.state.vehicles.length}/>
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Alert color="danger" isOpen={this.state.msgFail} toggle={this.onFailDismiss}>{this.state.msgFail}</Alert>
          <Alert color="success" isOpen={this.state.msgSuccess} toggle={this.onSuccessDismiss}>{this.state.msgSuccess}</Alert>
          {/* Table */}
          <div className="col">
            <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                        <Col xs="8">
                        <h3 className="mb-0">Vozila u vlasništvu</h3>
                        </Col>
                        <Col className="text-right" xs="4">
                          <Button color="primary" onClick={e => this.toggleAddModal(e)} size="sm">
                          Novo vozilo
                          </Button>
                        </Col>
                    </Row>             
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
