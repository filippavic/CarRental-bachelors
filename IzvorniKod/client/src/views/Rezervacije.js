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
  Container,
  Button,
  Modal,
  Alert
} from "reactstrap";
// core components
import UserHeader2 from "../components/Headers/UserHeader2.js";
import RentCard from "../components/UserPage/RentCard.js";


class Rezervacije extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
      currentReservations: [],
      isFetching: false,
      cancelModalOpen: false,
      sifnajam: null,
      failAlert: false
    };
  }

  static propTypes = {
    auth: PropTypes.object.isRequired
  }

  componentDidMount() {
    this.setState({ currentReservations: this.state.currentReservations, isFetching: true });
    axios.get(`/api/user_page/activerents/${this.props.auth.user.sifkorisnik}`).then(res => {
			const rents = res.data;
			this.setState({ currentReservations: rents, isFetching: false });
		});
  }
  
  //otvara modal za potvrdu
  toggleCancelReserve = (sifnajam) => {
    this.toggleModal();
    this.setState({ sifnajam: sifnajam });
  }

  toggleModal = () => {
    this.setState({
      cancelModalOpen: !this.state.cancelModalOpen
    });
  };

  //ponistavanje najma
  cancelReserve = () => {
    try{
      axios.delete(`/api/user_page/${this.state.sifnajam}`);
      this.setState({ currentReservations: this.state.currentReservations.filter(reservation => reservation.sifnajam !== this.state.sifnajam) });
      this.toggleModal();
    }
    catch (e){
      this.setState({failAlert: true});
      this.toggleModal();
    }
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
        { this.state.failAlert ? (<Alert color="danger">Dogodila se pogreška.</Alert>) : null }
        <Modal
              className="modal-dialog-centered modal-danger"
              contentClassName="bg-gradient-danger"
              isOpen={this.state.cancelModalOpen}
            >
              <div className="modal-header">
                <h6 className="modal-title" id="modal-title-notification">
                  Poništavanje rezervacije
                </h6>
                <button
                  aria-label="Close"
                  className="close"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => this.toggleModal()}
                >
                  <span aria-hidden={true}>×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="py-3 text-center">
                  <i className="ni ni-fat-remove ni-3x" />
                  <h4 className="heading mt-4">Ovim ćete poništiti rezervaciju.</h4>
                  <p>
                    Jeste li sigurni?
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <Button className="btn-white" color="default" type="button" onClick={() => this.cancelReserve()}>
                  Poništi
                </Button>
                <Button
                  className="text-white ml-auto"
                  color="link"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => this.toggleModal()}
                >
                  Odustani
                </Button>
              </div>
            </Modal>

        <UserHeader2 isFetching={this.state.isFetching} reservations={this.state.currentReservations}/> 
        {/* Page content */}
        
        <Container className="mt--7" fluid>
          {this.state.currentReservations && this.state.currentReservations.map (reservation => (
              <RentCard key={reservation.sifnajam} reservation={reservation} cancelReserve={(sifnajam) => this.toggleCancelReserve(sifnajam)}/>
            ))}
        </Container>
      </>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {})(Rezervacije);
