//Modal za dodavanje novog vozila

import React from 'react'
import axios from 'axios';
import Select from 'react-select';
import orderBy from 'lodash/orderBy';

// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    Modal,
    Row,
    Col,
    Alert
  } from "reactstrap";


//stil selection drop-down menija
const reactSelectStyles = {
    control: (base, state) => ({
        ...base,
        background: "#ffffff",
        borderRadius: "0.375rem",
        border: "0",
        boxShadow: "0 1px 3px rgba(50, 50, 93, 0.15), 0 1px 0 rgba(0, 0, 0, 0.02)",
        height: "calc(2.75rem + 2px)",
        marginBottom: "1.5rem",
        cursor: "pointer",
        fontSize: "0.875rem",
        "&:hover": {
            boxShadow: "0 1.5px 3.5px rgba(50, 50, 93, 0.2), 0 1.5px 0 rgba(0, 0, 0, 0.05)"
        }
      }),
    placeholder: (defaultStyles) => {
        return {
            ...defaultStyles,
            color: '#ADB5BD',
        }
    },
    option: (styles, { isFocused, isSelected }) => {
        return {
            ...styles,
            backgroundColor: isSelected ? 'rgba(192, 72, 72, 0.4)' : isFocused ? 'rgba(192, 72, 72, 0.4)' : null,
            color: 'black',          
            ':active': {
                ...styles[':active'],
                backgroundColor:  'rgba(192, 72, 72, 0.6)',
            },
        };
    }
}

var moment = require('moment');

class AddVehicleModal extends React.Component{

    constructor(props) {
		super(props);
		this.state = {
            sifproizvodac: null,
            sifmodel: null,
            registracija: null,
            siflokacija: null,
            msg: null
        };
        this.proizvodaci = [];
        this.modeli = [];
        this.lokacije = [];
    }

    //ucitavanje popisa proizvodaca
    componentDidMount(){
        axios.get(`/api/admin_page/manufacturers/`).then(res => {
            const data = res.data;
            let sortedProizvodaci = orderBy(data, 'label', 'asc');
            this.setState({ proizvodaci: sortedProizvodaci });
        });
        axios.get(`/api/admin_page/locationselect/`).then(res => {
            const data = res.data;
            this.setState({ lokacije: data });
        });
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value});
    }

    //funkcija za odabir proizvodaca
    handleManufSelect = sifproizvodac => {
        this.setState({ sifproizvodac });
        axios.get(`/api/admin_page/models/${sifproizvodac.value}`).then(res => {
            const data = res.data;
            let sortedModeli = orderBy(data, 'label', 'asc');
            this.setState({ modeli: sortedModeli });
        });
    };

    //funkcija za odabir modela
    handleModelSelect = sifmodel => {
        this.setState({ sifmodel });
    };

    //funkcija za odabir lokacije
    handleLocationSelect = siflokacija => {
        this.setState({ siflokacija });
    };

    onSubmit = e => {
        e.preventDefault();
    
        //slanje podataka za dodavanje novog vozila
        const { sifmodel, siflokacija } = this.state;
       
        var registracija = null;
        if (this.state.registracija){
            registracija = this.state.registracija.toUpperCase();
        }

        if (!this.state.registracija || !sifmodel || !siflokacija || !registracija){
            this.setState({msg: 'Potrebno je ispuniti sva polja'});
        }
        else{
            this.setState({msg: null});
            var datumvrijeme = moment().format();

            //vozilo object
            const newVehicle = {
            sifmodel: sifmodel.value,
            siflokacija: siflokacija.value,
            registracija,
            datumvrijeme
            };
        
            this.props.addNewVehicle(newVehicle);
        }

      }

    render() {
        return (
            <Modal
              className="modal-dialog-centered"
              size="lg"
              isOpen={this.props.isModalOpen}
              toggle={(e) => this.props.toggleModal(e)}
            >
              <div className="modal-body p-0">
                <Card className="bg-secondary shadow border-0">
                    <CardHeader className="bg-white border-0">
                    <Row className="align-items-center">
                        <Col xs="8">
                        <h3 className="mb-0">Novo vozilo</h3>
                        </Col>
                        <Col className="text-right" xs="4">
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={(e) => this.props.toggleModal(e)}
                            >
                            <span aria-hidden={true}>×</span>
                            </button>
                        </Col>
                    </Row>
                    </CardHeader>
                  <CardBody>
                    { this.state.msg ? (<Alert color="danger">{this.state.msg}</Alert>) : null }
                    <Form role="form">
                    <div className="pl-lg-4">
                        <Row>
                            <Col lg="6">
                            <FormGroup>
                                    <label
                                    className="form-control-label"
                                    >
                                    Proizvođač
                                    </label>
                                    <Select
                                    styles={reactSelectStyles}
                                    placeholder="Proizvođač"
                                    options={this.state.proizvodaci}
                                    value={this.state.sifproizvodac}
                                    onChange={this.handleManufSelect}
                                    />
                            </FormGroup>
                            </Col>
                            <Col lg="6">
                            <FormGroup>
                                    <label
                                    className="form-control-label"
                                    >
                                    Model
                                    </label>
                                    <Select
                                    styles={reactSelectStyles}
                                    placeholder="Model"
                                    options={this.state.modeli}
                                    value={this.state.sifmodel}
                                    onChange={this.handleModelSelect}
                                    />
                            </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg="6">
                            <FormGroup>
                                <label
                                className="form-control-label"
                                >
                                Registracija
                                </label>
                                <Input
                                className="form-control-alternative"
                                id="input-registracija"
                                placeholder="Registracija"
                                type="text"
                                name="registracija"
                                onChange={this.onChange}
                                />
                                <label className="h6"> npr. ZG1234AB</label>
                            </FormGroup>
                            </Col>
                            <Col lg="6">
                            <FormGroup>
                                    <label
                                    className="form-control-label"
                                    >
                                    Početna podružnica
                                    </label>
                                    <Select
                                    styles={reactSelectStyles}
                                    placeholder="Početna podružnica"
                                    options={this.state.lokacije}
                                    value={this.state.siflokacija}
                                    onChange={this.handleLocationSelect}
                                    />
                            </FormGroup>
                            </Col>
                        </Row>
                        </div>
                      <div className="text-center">
                        <Button
                          className="my-4"
                          color="primary"
                          type="button"
                          onClick={this.onSubmit}
                        >
                          Dodaj vozilo
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </div>
            </Modal>
        )
    }
}

export default AddVehicleModal;
