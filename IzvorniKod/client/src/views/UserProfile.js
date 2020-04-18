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
import { changeUserInfo, changeUsername } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';

// reactstrap components
import {
  Alert,
  UncontrolledAlert,
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col
} from "reactstrap";
// core components
import UserHeader from "../components/Headers/UserHeader.js";

var moment = require('moment');
require('moment/locale/hr');

class UserProfile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            ime: this.props.auth.user.ime,
            prezime: this.props.auth.user.prezime,
            datumRod: moment(this.props.auth.user.datumrod).format("DD.MM.YYYY."),
            mail: this.props.auth.user.mail,
            trenKorisnickoIme: this.props.auth.user.korisnickoime,
            novoKorisnickoIme: null,
            novoKorisnickoImeConfirm: null,
            lozinka: null,
            novaLoznika: null,
            sifKorisnik: this.props.auth.user.sifkorisnik,
            editMode: false,
            msg: null,
            usernameChange: false,
            passChange: false,
            msgSuccess: null
        }
    }

    static propTypes = {
        auth: PropTypes.object.isRequired,
        error: PropTypes.object.isRequired,
        changeUserInfo: PropTypes.func.isRequired,
        changeUsername: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired
    }

    componentDidUpdate(prevProps) {
        //postavljanje/uklanjanje poruke pogreske
        const { error } = this.props;
        if(error !== prevProps.error) {
          if(error.id === 'CHANGE_FAIL') {
            this.setState({ msg: error.msg.msg });
          }
          else {
            this.setState({ msg: null });
          }
        }
    
      }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value});
    };

    onChangeUsername = e => {
        this.setState({ [e.target.name]: e.target.value, usernameChange: true});
    };

    onChangePass = e => {
        this.setState({ [e.target.name]: e.target.value, passChange: true});
    };

    startEditMode = e => {
        e.preventDefault();
        this.setState({editMode: true});
    };

    finishEdit = e => {
        e.preventDefault();
        this.setState({editMode: false});

        const { ime, prezime, mail, trenKorisnickoIme, novoKorisnickoIme, novoKorisnickoImeConfirm, lozinka, novaLozinka, sifKorisnik } = this.state;

        const datumRod =  moment(this.props.auth.user.datumrod).format("YYYY-MM-DD");

        var korisnickoIme;

        if (novoKorisnickoIme && novoKorisnickoIme !== trenKorisnickoIme){
            korisnickoIme = novoKorisnickoIme;
        }
        else {
            korisnickoIme = trenKorisnickoIme;
        }

        //user object
        const updateUser = {
        ime,
        prezime,
        datumRod,
        mail,
        korisnickoIme,
        lozinka,
        sifKorisnik
        };

        const updateUser2 = {
        ime,
        prezime,
        datumRod,
        mail,
        korisnickoIme,
        sifKorisnik
        };


        if(novoKorisnickoIme && novoKorisnickoImeConfirm && lozinka && novaLozinka){
            //provjera jesu li upisani identicne podaci
            if(lozinka === novaLozinka && novoKorisnickoIme === novoKorisnickoImeConfirm){
            //ako jesu, azuriraj podatke
            this.props.changeUserInfo(updateUser);
            }
            else{
                this.setState({ msg: "Upisani podaci su različiti" });
            }
        }
        else if (lozinka && novaLozinka){
            if(novoKorisnickoIme && !novoKorisnickoImeConfirm){
                this.setState({ msg: "Potvrdite korisničko ime" });
            }
            else if (!novoKorisnickoIme && !novoKorisnickoImeConfirm){
                this.props.changeUserInfo(updateUser);
            }
        }
        else if (novoKorisnickoIme && novoKorisnickoImeConfirm){
            if(novoKorisnickoIme === novoKorisnickoImeConfirm){
                this.props.changeUsername(updateUser2);
            }
            else{
                this.setState({ msg: "Upisana korisnička imena su različita" });
            }
        }
      
    };

    render() {
        return (
        <>
            <UserHeader />
            {/* Page content */}
            <Container className="mt--7" fluid style={{marginBottom: '30px'}}>
            { this.state.msg ? (<Alert color="danger">{this.state.msg}</Alert>) : null }
            { this.state.msgSuccess ? (<UncontrolledAlert color="secondary">{this.state.msgSuccess}</UncontrolledAlert>) : null }
            <Row>
                <Col className="order-xl-1">
                <Card className="bg-secondary shadow">
                    <CardHeader className="bg-white border-0">
                    <Row className="align-items-center">
                        <Col xs="8">
                        <h3 className="mb-0">Moj račun</h3>
                        </Col>
                        <Col className="text-right" xs="4">
                        {this.state.editMode ? (
                            <Button color="primary" onClick={e => this.finishEdit(e)} size="sm">
                            Spremi promjene
                            </Button>
                        ) : (
                            <Button color="primary" onClick={e => this.startEditMode(e)} size="sm" >
                            Uredi podatke
                            </Button>
                        )}
                        </Col>
                    </Row>
                    </CardHeader>
                    <CardBody>
                    <Form>
                        <h6 className="heading-small text-muted mb-4">
                        Korisničke informacije
                        </h6>
                        <div className="pl-lg-4">
                        <Row>
                            <Col lg="6">
                            <FormGroup>
                                <label
                                className="form-control-label"
                                htmlFor="input-first-name"
                                >
                                Ime
                                </label>
                                <Input
                                className="form-control-alternative"
                                defaultValue={this.state.ime}
                                id="input-first-name"
                                placeholder="Ime"
                                type="text"
                                name="ime"
                                onChange={this.onChange}
                                disabled={!this.state.editMode}
                                />
                            </FormGroup>
                            </Col>
                            <Col lg="6">
                            <FormGroup>
                                <label
                                className="form-control-label"
                                htmlFor="input-last-name"
                                >
                                Prezime
                                </label>
                                <Input
                                className="form-control-alternative"
                                defaultValue={this.state.prezime}
                                id="input-last-name"
                                placeholder="Prezime"
                                type="text"
                                name="prezime"
                                onChange={this.onChange}
                                disabled={!this.state.editMode}
                                />
                            </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg="6">
                            <FormGroup>
                                <label
                                className="form-control-label"
                                htmlFor="input-birthday"
                                >
                                Datum rođenja
                                </label>
                                <Input
                                className="form-control-alternative"
                                defaultValue={this.state.datumRod}
                                id="input-birthday"
                                placeholder="Datum rođenja"
                                type="text"
                                disabled
                                />
                            </FormGroup>
                            </Col>
                            <Col lg="6">
                            <FormGroup>
                                <label
                                className="form-control-label"
                                htmlFor="input-email"
                                >
                                E-mail adresa
                                </label>
                                <Input
                                className="form-control-alternative"
                                defaultValue={this.state.mail}
                                id="input-email"
                                placeholder="E-mail adresa"
                                type="text"
                                disabled
                                />
                            </FormGroup>
                            </Col>
                        </Row>
                        </div>
                        <hr className="my-4" />
                        {/* Address */}
                        <h6 className="heading-small text-muted mb-4">
                        Ostale informacije
                        </h6>
                        <div className="pl-lg-4">
                        <Row>
                        <Col lg="6">
                            <FormGroup>
                                <label
                                className="form-control-label"
                                htmlFor="input-username"
                                >
                                Korisničko ime
                                </label>
                                <Input
                                className="form-control-alternative"
                                defaultValue={this.state.trenKorisnickoIme}
                                id="input-username"
                                placeholder="Username"
                                type="text"
                                name="novoKorisnickoIme"
                                onChange={this.onChangeUsername}
                                disabled={!this.state.editMode}
                                />
                            </FormGroup>
                        </Col>
                        {this.state.usernameChange ? (
                            <Col lg="6">
                            <FormGroup>
                                <label
                                className="form-control-label"
                                htmlFor="input-username"
                                >
                                Potvrdi novo korisničko ime
                                </label>
                                <Input
                                className="form-control-alternative"
                                id="input-username"
                                placeholder="Username"
                                type="text"
                                name="novoKorisnickoImeConfirm"
                                onChange={this.onChange}
                                />
                            </FormGroup>
                        </Col>
                        ) : null}
                        </Row>
                        <Row>
                            <Col lg="6">
                                <FormGroup>
                                <label
                                className="form-control-label"
                                htmlFor="input-password"
                                >
                                Lozinka
                                </label>
                                <Input
                                className="form-control-alternative"
                                id="input-password"
                                placeholder="Lozinka"
                                type="password"
                                name="lozinka"
                                onChange={this.onChangePass}
                                disabled={!this.state.editMode}
                                />
                                </FormGroup>
                            </Col>
                            {this.state.passChange ? (
                                <Col lg="6">
                                <FormGroup>
                                    <label
                                    className="form-control-label"
                                    htmlFor="input-password"
                                    >
                                    Potvrdi novu lozinku
                                    </label>
                                    <Input
                                    className="form-control-alternative"
                                    id="input-password"
                                    placeholder="Lozinka"
                                    type="password"
                                    name="novaLozinka"
                                    onChange={this.onChange}
                                    />
                                </FormGroup>
                                </Col>
                            ) : null}       
                            </Row>
                        </div>
                    </Form>
                    </CardBody>
                </Card>
                </Col>
            </Row>
        </Container>
        </>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    error: state.error
  });
  
  export default connect(mapStateToProps, { changeUserInfo, changeUsername, clearErrors })(UserProfile);
