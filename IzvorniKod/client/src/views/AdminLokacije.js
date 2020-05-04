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
import { connect, ReactReduxContext } from 'react-redux';
import PropTypes from 'prop-types';

// reactstrap components
import {
  Card,
  CardHeader,
  Table,
  Container,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Alert,
  UncontrolledAlert
} from "reactstrap";
// react component for creating dynamic tables

// core components
import AdminLocationHeader from "../components/Headers/AdminLocationHeader.js";
import AdminLocationTableRow from "../components/AdminPage/AdminLocationTableRow";

import ReactLoading from 'react-loading';

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
      isSortedAscending: null
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
          this.setState({msgSuccess: "Status podružnice upješno promijenjen."});

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
          this.setState({msgFail: "Došlo je do pogreške, pokušajte ponovno"})
      });
 
    
  }


  render() {
    return (
      <>
        <AdminLocationHeader isFetching={this.state.isFetching && this.state.isNotActiveFetching} brlokacija={this.state.locations.length + this.state.notactive.length} braktivnih={this.state.locations.length}/>
        {/* Page content */}
        <Container className="mt--7" fluid>
          { this.state.msgFail ? (<UncontrolledAlert color="danger">{this.state.msgFail}</UncontrolledAlert>) : null }
          { this.state.msgSuccess ? (<UncontrolledAlert color="success">{this.state.msgSuccess}</UncontrolledAlert>) : null }
          {/* Table - aktivne */}
          <div className="col">
            <Card className="shadow">
                <CardHeader className="d-flex justify-content-between border-0">
                  <h3 className="mb-0">Aktivne podružnice</h3>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Šifra podružnice</th>
                      <th scope="col">Ulica</th>
                      <th scope="col">Kućni broj</th>
                      <th scope="col">Poštanski broj</th>
                      <th scope="col">Mjesto</th>
                      <th scope="col">Država</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.isFetching ? (<><ReactLoading type="bubbles" color="#8E8E93" height={'20%'} width={'20%'} /></>) : null}
                  {this.state.locations && this.state.locations.map(location => (
                    <AdminLocationTableRow key={location.siflokacija} location={location} isActive={true} changeLocationStatus={(values) => this.changeLocationStatus(values)}/>))}
                  </tbody>
                </Table>
            </Card>
          </div>

          {/* Table - neaktivne */}
          <div className="col" style={{marginTop: '50px'}}>
            <Card className="shadow">
                <CardHeader className="d-flex justify-content-between border-0">
                  <h3 className="mb-0">Neaktivne podružnice</h3>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Šifra podružnice</th>
                      <th scope="col">Ulica</th>
                      <th scope="col">Kućni broj</th>
                      <th scope="col">Poštanski broj</th>
                      <th scope="col">Mjesto</th>
                      <th scope="col">Država</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.isNotActiveFetching ? (<><ReactLoading type="bubbles" color="#8E8E93" height={'20%'} width={'20%'} /></>) : null}
                  {this.state.notactive && this.state.notactive.map(location => (
                    <AdminLocationTableRow key={location.siflokacija} location={location} isActive={false} changeLocationStatus={(values) => this.changeLocationStatus(values)}/>))}
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

export default connect(mapStateToProps, {})(AdminLokacije);
