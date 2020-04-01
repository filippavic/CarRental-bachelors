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
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import { withRouter } from 'react-router-dom';

import ReactDatetime from "react-datetime";

// reactstrap components
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col,
  Alert
} from "reactstrap";

//lokalizacija datuma
var moment = require('moment');
require('moment/locale/hr');

//onemoguci datume
var eighteen = ReactDatetime.moment().subtract( 18, 'year' );
var valid = function( current ){
    return current.isBefore(eighteen);
};

class Register extends React.Component {

  state = {
    ime: '',
    prezime: '',
    datumRod: null,
    mail: '',
    korisnickoIme: '',
    lozinka: '',
    msg: null
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired
  }

  componentDidUpdate(prevProps) {
    //postavljanje/uklanjanje poruke pogreske
    const { error, isAuthenticated } = this.props;
    if(error !== prevProps.error) {
      if(error.id === 'REGISTER_FAIL') {
        this.setState({ msg: error.msg.msg });
      }
      else {
        this.setState({ msg: null });
      }
    }

    //redirect nakon uspjesne registracije
    if(isAuthenticated){
      this.props.history.push("/");
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value});
  };

  onSubmit = e => {
    e.preventDefault();

    //slanje podataka za registraciju
    const { ime, prezime, mail, korisnickoIme, lozinka } = this.state;

    const datumRod =  moment(this.state.datumRod).format("YYYY-MM-DD");

    //user object
    const newUser = {
      ime,
      prezime,
      datumRod,
      mail,
      korisnickoIme,
      lozinka
    };

    this.props.register(newUser);
  }

  render() {
    return (
      <>
        <Col lg="6" md="8">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              { this.state.msg ? (<Alert color="danger">{this.state.msg}</Alert>) : null }
              <div className="text-center text-muted mb-4">
                <small>Registrirajte se</small>
              </div>
              <Form role="form">
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-single-02" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Ime" type="text" name="ime" onChange={this.onChange}/>
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-single-02" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Prezime" type="text" name="prezime" onChange={this.onChange}/>
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-calendar-grid-58" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <ReactDatetime
                      autoComplete='off'
                      inputProps={{placeholder: "Datum rođenja"}}
                      isValidDate={valid}
                      //defaultValue={eighteen}
                      timeFormat={false}
                      onChange={e => this.setState({ datumRod: e })}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Email" type="email" name="mail" autoComplete="new-email" onChange={this.onChange}/>
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-badge" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Korisničko ime" type="text" name="korisnickoIme" autoComplete="off" onChange={this.onChange}/>
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Lozinka" type="password" name="lozinka" autoComplete="new-password" onChange={this.onChange}/>
                  </InputGroup>
                </FormGroup>
                {/* <div className="text-muted font-italic">
                  <small>
                    password strength:{" "}
                    <span className="text-success font-weight-700">strong</span>
                  </small>
                </div> */}
                {/* <Row className="my-4">
                  <Col xs="12">
                    <div className="custom-control custom-control-alternative custom-checkbox">
                      <input
                        className="custom-control-input"
                        id="customCheckRegister"
                        type="checkbox"
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="customCheckRegister"
                      >
                        <span className="text-muted">
                          I agree with the{" "}
                          <a href="#pablo" onClick={e => e.preventDefault()}>
                            Privacy Policy
                          </a>
                        </span>
                      </label>
                    </div>
                  </Col>
                </Row> */}
                <div className="text-center">
                  <Button className="mt-4" color="primary" type="button" onClick={this.onSubmit}>
                    Stvorite račun
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error
});

export default withRouter(connect(
  mapStateToProps,
  { register, clearErrors }
)(Register));
