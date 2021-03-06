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
  Container,
  Row,
  Col,
  Button,
  UncontrolledAlert
} from "reactstrap";
// react component for creating dynamic tables

// core components
import AdminLocationHeader from "../components/Headers/AdminLocationHeader.js";
import AdminLocationTableRow from "../components/AdminPage/AdminLocationTableRow";
import AdminLocationGraph from "../components/AdminPage/AdminLocationGraph.js";

import ReactLoading from 'react-loading';
import LocationModal from "../components/AdminPage/LocationModal.js";
import ChangeLocationModal from "../components/AdminPage/ChangeLocationModal.js";

class AdminLokacije extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
      locations: [],
      isFetching: false,
      notactive: [],
      isNotActiveFetching: false,
      msgFail: null,
      msgSuccess: null,
      isSortedAscending: null,
      isModalOpen: false,
      changeLocationData: null,
      isChangeModalOpen: false
    };
  }

  static propTypes = {
    auth: PropTypes.object.isRequired
  }

  componentDidMount() {
    this.setState({ locations: this.state.locations, isFetching: true });
    axios.get(`/api/admin_page/locations/`).then(res => {
      const locations = res.data;
      let sortedLocations = locations.sort((a, b) => (a.siflokacija - b.siflokacija));
			this.setState({ locations: sortedLocations, isFetching: false});
    });
    this.setState({ isSortedAscending: true });

    this.setState({ notactive: this.state.notactive, isNotActiveFetching: true });
    axios.get(`/api/admin_page/notactivelocations/`).then(res => {
      const locations = res.data;
      let sortedLocations = locations.sort((a, b) => (a.siflokacija - b.siflokacija));
			this.setState({ notactive: sortedLocations, isNotActiveFetching: false});
    });
  }

  //sortiranje
  toggleSort = () => {
    if (this.state.isSortedAscending){
        let sortedLocations = this.state.locations.sort((a, b) => (b.siflokacija - a.siflokacija));
        this.setState({locations: sortedLocations, isSortedAscending: false})
    }
    else{
      let sortedLocations = this.state.locations.sort((a, b) => (a.siflokacija - b.siflokacija));
      this.setState({locations: sortedLocations, isSortedAscending: true})
    }
  }

  //promjena status podruznice
  changeLocationStatus = (values) => {
    //headers
    const config = {
      headers: {
          'Content-Type': 'application/json'
      }
    }

    let locationData = {
      siflokacija: values.siflokacija,
      status: values.isActive ? false : true
    };

    const body = JSON.stringify(locationData);

    axios.post('/api/admin_page/changelocationstatus', body, config)
      .then(res => {
        if(res.status === 200){
          this.setState({msgSuccess: "Status podru??nice uspje??no promijenjen"});

          //ponovno dohvacanje podruznica
          this.setState({ locations: this.state.locations, isFetching: true });
          axios.get(`/api/admin_page/locations/`).then(res => {
            const locations = res.data;
            let sortedLocations = locations.sort((a, b) => (a.siflokacija - b.siflokacija));
            this.setState({ locations: sortedLocations, isFetching: false});
          });
          this.setState({ isSortedAscending: true });

          this.setState({ notactive: this.state.notactive, isNotActiveFetching: true });
          axios.get(`/api/admin_page/notactivelocations/`).then(res => {
            const locations = res.data;
            let sortedLocations = locations.sort((a, b) => (a.siflokacija - b.siflokacija));
            this.setState({ notactive: sortedLocations, isNotActiveFetching: false});
          });
        }
        else{
          throw Error;
        }       
      })
      .catch(err => {
          this.setState({msgFail: "Do??lo je do pogre??ke, poku??ajte ponovno"})
      });  
  }

  //otvaranje/zatvaranje prozora
  toggleModal = (e) => {
    e.preventDefault();
    this.setState({isModalOpen: !this.state.isModalOpen});
  };

  //dodavanje nove podruznice
  addNewLocation = (newLocation) => {
    //headers
    const config = {
      headers: {
          'Content-Type': 'application/json'
      }
    }

    const body = JSON.stringify(newLocation);

    axios.post('/api/admin_page/newlocation', body, config)
    .then(res => {
      if(res.status === 200){
        this.setState({msgSuccess: "Lokacija uspje??no dodana"});

        //ponovno dohvacanje podruznica
        this.setState({ locations: this.state.locations, isFetching: true });
        axios.get(`/api/admin_page/locations/`).then(res => {
          const locations = res.data;
          let sortedLocations = locations.sort((a, b) => (a.siflokacija - b.siflokacija));
          this.setState({ locations: sortedLocations, isFetching: false});
        });
        this.setState({ isSortedAscending: true });

        this.setState({ notactive: this.state.notactive, isNotActiveFetching: true });
        axios.get(`/api/admin_page/notactivelocations/`).then(res => {
          const locations = res.data;
          let sortedLocations = locations.sort((a, b) => (a.siflokacija - b.siflokacija));
          this.setState({ notactive: sortedLocations, isNotActiveFetching: false});
        });

      }
      else{
        throw Error;
      }       
    })
    .catch(err => {
        this.setState({msgFail: "Do??lo je do pogre??ke, poku??ajte ponovno"})
    });

    this.setState({isModalOpen: false});
  }

  //otvaranje prozora za promjenu podataka o lokaciji
  openChangeModal = (locationData) => {
    this.setState({changeLocationData: locationData}, function () {this.setState({isChangeModalOpen: true})})
  };

  //otvaranje/zatvaranje prozora za promjenu podataka o lokaciji
  toggleChangeModal = (e) => {
    e.preventDefault();
    this.setState({isChangeModalOpen: !this.state.isChangeModalOpen});
  }

  //promjena podataka o podruznici
  changeLocation = (changedLocation) => {
    //headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify(changedLocation);

    axios.post('/api/admin_page/changelocation', body, config)
    .then(res => {
      if(res.status === 200){
        this.setState({msgSuccess: "Podaci uspje??no promijenjeni"});

        //ponovno dohvacanje podruznica
        this.setState({ locations: this.state.locations, isFetching: true });
        axios.get(`/api/admin_page/locations/`).then(res => {
          const locations = res.data;
          let sortedLocations = locations.sort((a, b) => (a.siflokacija - b.siflokacija));
          this.setState({ locations: sortedLocations, isFetching: false});
        });
        this.setState({ isSortedAscending: true });

        this.setState({ notactive: this.state.notactive, isNotActiveFetching: true });
        axios.get(`/api/admin_page/notactivelocations/`).then(res => {
          const locations = res.data;
          let sortedLocations = locations.sort((a, b) => (a.siflokacija - b.siflokacija));
          this.setState({ notactive: sortedLocations, isNotActiveFetching: false});
        });

      }
      else{
        throw Error;
      }       
    })
    .catch(err => {
        this.setState({msgFail: "Do??lo je do pogre??ke, poku??ajte ponovno"})
    });

    this.setState({isChangeModalOpen: false});
  };

  componentWillUnmount() {
    // ispravlja gresku "Can't perform a React state update on an unmounted component"
    this.setState = (state,callback)=>{
        return;
    };
  }


  render() {
    return (
      <>
        {this.state.isChangeModalOpen ? (
            <ChangeLocationModal isModalOpen={this.state.isChangeModalOpen} toggleModal={this.toggleChangeModal}
            locationData={this.state.changeLocationData} changeLocation={(changedLocation) => this.changeLocation(changedLocation)}/>
            ) : null}
        <LocationModal isModalOpen={this.state.isModalOpen} toggleModal={this.toggleModal} addNewLocation={(newLocation) => this.addNewLocation(newLocation)}/>
        <AdminLocationHeader isFetching={this.state.isFetching && this.state.isNotActiveFetching} brlokacija={this.state.locations.length + this.state.notactive.length} braktivnih={this.state.locations.length}/>
        {/* Page content */}
        <Container className="mt--7" fluid>
          { this.state.msgFail ? (<UncontrolledAlert color="danger">{this.state.msgFail}</UncontrolledAlert>) : null }
          { this.state.msgSuccess ? (<UncontrolledAlert color="success">{this.state.msgSuccess}</UncontrolledAlert>) : null }
          {/* Table - aktivne */}
          <div className="col">
            <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                        <Col xs="8">
                        <h3 className="mb-0">Aktivne podru??nice</h3>
                        </Col>
                        <Col className="text-right" xs="4">
                          <Button color="primary" onClick={e => this.toggleModal(e)} size="sm">
                          Nova podru??nica
                          </Button>
                        </Col>
                    </Row>             
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">??ifra podru??nice</th>
                      <th scope="col">Ulica</th>
                      <th scope="col">Ku??ni broj</th>
                      <th scope="col">Po??tanski broj</th>
                      <th scope="col">Mjesto</th>
                      <th scope="col">Dr??ava</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.isFetching ? (<><tr><td><ReactLoading type="bubbles" color="#8E8E93" height={'10%'} width={'10%'} /></td></tr></>) : null}
                  {this.state.locations && this.state.locations.map(location => (
                    <AdminLocationTableRow key={location.siflokacija} location={location} isActive={true}
                    changeLocationStatus={(values) => this.changeLocationStatus(values)}
                    openChangeModal={(locationData) => this.openChangeModal(locationData)}/>))}
                  </tbody>
                </Table>
            </Card>
          </div>

          {/* Table - neaktivne */}
          <div className="col" style={{marginTop: '50px'}}>
            <Card className="shadow">
                <CardHeader className="d-flex justify-content-between border-0">
                  <h3 className="mb-0">Neaktivne podru??nice</h3>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">??ifra podru??nice</th>
                      <th scope="col">Ulica</th>
                      <th scope="col">Ku??ni broj</th>
                      <th scope="col">Po??tanski broj</th>
                      <th scope="col">Mjesto</th>
                      <th scope="col">Dr??ava</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.isNotActiveFetching ? (<><tr><td><ReactLoading type="bubbles" color="#8E8E93" height={'10%'} width={'10%'} /></td></tr></>) : null}
                  {this.state.notactive && this.state.notactive.map(location => (
                    <AdminLocationTableRow key={location.siflokacija} location={location} isActive={false}
                    changeLocationStatus={(values) => this.changeLocationStatus(values)}
                    openChangeModal={(locationData) => this.openChangeModal(locationData)}/>))}
                  </tbody>
                </Table>
            </Card>
          </div>

          {/* Statistika */}
          <div className="col" style={{marginTop: '50px'}}>
            <AdminLocationGraph/>
          </div>
            
        </Container>
      </>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {})(AdminLokacije);
