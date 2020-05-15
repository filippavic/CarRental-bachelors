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
  UncontrolledAlert
} from "reactstrap";
// react component for creating dynamic tables

// core components
import AdminRentHeader from "../components/Headers/AdminRentHeader.js";
import AdminRentTableRow from "../components/AdminPage/AdminRentTableRow";
import RentModal from "../components/AdminPage/RentModal.js";

import ReactLoading from 'react-loading';
var moment = require('moment');

class AdminRezervacije extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
      rents: [],
      isFetching: false,
      msgFail: null,
      msgSuccess: null,
      isSortedAscending: null,
      isModalOpen: false,
      sifNajam: null
    };
    this.locations = [];
  }

  static propTypes = {
    auth: PropTypes.object.isRequired
  }

  componentDidMount() {
    this.setState({ rents: this.state.rents, isFetching: true });
    axios.get(`/api/admin_page/rents/`).then(res => {
      const rents = res.data;
      let sortedRents = rents.sort((a, b) => {return moment(a.planiranidatumvrijemeod, 'DD.MM.YYYY. HH:mm') - moment(b.planiranidatumvrijemeod, 'DD.MM.YYYY. HH:mm')});
			this.setState({ rents: sortedRents, isFetching: false});
    });
    this.setState({ isSortedAscending: true });
    axios.get(`/api/start_page/locations/`).then(res => {
      const data = res.data;
			this.setState({ locations: data });
    });
  }

  //sortiranje
  toggleSort = () => {
    if (this.state.isSortedAscending){
        let sortedRents = this.state.rents.sort((a, b) => {return moment(b.planiranidatumvrijemeod, 'DD.MM.YYYY. HH:mm') - moment(a.planiranidatumvrijemeod, 'DD.MM.YYYY. HH:mm')});
        this.setState({rents: sortedRents, isSortedAscending: false})
    }
    else{
      let sortedRents = this.state.rents.sort((a, b) => {return moment(a.planiranidatumvrijemeod, 'DD.MM.YYYY. HH:mm') - moment(b.planiranidatumvrijemeod, 'DD.MM.YYYY. HH:mm')});
      this.setState({rents: sortedRents, isSortedAscending: true})
    }
  }

  //prikupljanje vozila
  setPickedUp = (values) => {
    //headers
    const config = {
      headers: {
          'Content-Type': 'application/json'
      }
    }

    var vrijeme = moment().format();

    let pickupData = {
      sifnajam: values.sifnajam,
      sifvozilo: values.sifvozilo,
      siflokprikupljanja: values.siflokprikupljanja,
      vrijeme: vrijeme
    };

    const body = JSON.stringify(pickupData);

    axios.post('/api/admin_page/pickup', body, config)
      .then(res => {
        if(res.status === 200){
          this.setState({msgSuccess: "Vozilo " + values.registratskaoznaka + " označeno kao prikupljeno"});
          this.setState({ rents: this.state.rents, isFetching: true });
          axios.get(`/api/admin_page/rents/`).then(res => {
            const rents = res.data;
            let sortedRents = rents.sort((a, b) => {return moment(a.planiranidatumvrijemeod, 'DD.MM.YYYY. HH:mm') - moment(b.planiranidatumvrijemeod, 'DD.MM.YYYY. HH:mm')});
			      this.setState({ rents: sortedRents, isFetching: false});
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

  //vracanje vozila - zavrsetak najma
  setFinished = (values) => {
    //headers
    const config = {
      headers: {
          'Content-Type': 'application/json'
      }
    }

    var vrijeme = moment().format();

    let finishData = {
      sifnajam: values.sifnajam,
      sifvozilo: values.sifvozilo,
      siflokvracanja: values.siflokvracanja,
      vrijeme: vrijeme
    };

    const body = JSON.stringify(finishData);

    axios.post('/api/admin_page/finish', body, config)
      .then(res => {
        if(res.status === 200){
          this.setState({msgSuccess: "Vozilo " + values.registratskaoznaka + " označeno kao vraćeno"});
          this.setState({ rents: this.state.rents, isFetching: true });
          axios.get(`/api/admin_page/rents/`).then(res => {
            const rents = res.data;
            let sortedRents = rents.sort((a, b) => {return moment(a.planiranidatumvrijemeod, 'DD.MM.YYYY. HH:mm') - moment(b.planiranidatumvrijemeod, 'DD.MM.YYYY. HH:mm')});
			      this.setState({ rents: sortedRents, isFetching: false});
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

  //otvaranje/zatvaranje prozora
  toggleModal = (e) => {
    e.preventDefault();
    this.setState({isModalOpen: !this.state.isModalOpen});
  };

  //detalji o najmu
  openDetails = (value) => {
    this.setState({sifNajam: value}, function () {this.setState({isModalOpen: true})})
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
        {this.state.isModalOpen ? (
          <RentModal isModalOpen={this.state.isModalOpen} sifNajam={this.state.sifNajam} toggleModal={this.toggleModal}/>
        ) : null}
        <AdminRentHeader isFetching={this.state.isFetching} brnajmova={this.state.rents.length}/>
        {/* Page content */}
        <Container className="mt--7" fluid>
          { this.state.msgFail ? (<UncontrolledAlert color="danger">{this.state.msgFail}</UncontrolledAlert>) : null }
          { this.state.msgSuccess ? (<UncontrolledAlert color="success">{this.state.msgSuccess}</UncontrolledAlert>) : null }
          {/* Table */}
          <div className="col">
            <Card className="shadow">
                <CardHeader className="d-flex justify-content-between border-0">
                  <h3 className="mb-0">Aktivni najmovi</h3>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Vozilo</th>
                      <th scope="col">Ime</th>
                      <th scope="col">Prezime</th>
                      <th scope="col">Planirano od</th>
                      <th scope="col">Planirano do</th>
                      <th scope="col">Prikupljeno</th>
                      <th scope="col">Lok. prik.</th>
                      <th scope="col">Lok. vrać.</th>
                      <th scope="col">Iznos</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.isFetching ? (<><tr><td><ReactLoading type="bubbles" color="#8E8E93" height={'30%'} width={'30%'} /></td></tr></>) : null}
                  {this.state.rents && this.state.rents.map(rent => (
                    <AdminRentTableRow key={rent.sifnajam} rent={rent} setPickedUp={(values) => this.setPickedUp(values)} setFinished={(values) => this.setFinished(values)} openDetails={(value) => this.openDetails(value)}/>))}
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

export default connect(mapStateToProps, {})(AdminRezervacije);
