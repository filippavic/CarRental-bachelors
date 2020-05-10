//Modal za dodavanje cijene modela

import React from 'react'
import axios from 'axios';
import Select from 'react-select';

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

class AddModelPriceModal extends React.Component{

    constructor(props) {
		super(props);
		this.state = {
            sifproizvodac: null,
            sifmodel: null,
            cijena: null,
            msg: null
        };
        this.proizvodaci = [];
        this.modeli = [];
    }

    //ucitavanje popisa proizvodaca
    componentDidMount(){
        axios.get(`/api/admin_page/manufacturers/`).then(res => {
            const data = res.data;
            this.setState({ proizvodaci: data });
        });
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value});
    }

    //funkcija za odabir proizvodaca
    handleManufSelect = sifproizvodac => {
        this.setState({ sifproizvodac });
        axios.get(`/api/admin_page/newpricemodels/${sifproizvodac.value}`).then(res => {
            const data = res.data;
            this.setState({ modeli: data });
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
    
        //slanje podataka za dodavanje cijene modela
        const { sifmodel, cijena } = this.state;
       
        if (!sifmodel || !cijena){
            this.setState({msg: 'Potrebno je ispuniti sva polja'});
        }
        else{
            this.setState({msg: null});

            //price object
            const newPrice = {
            sifmodel: sifmodel.value,
            cijena
            };
        
            this.props.addNewPrice(newPrice);
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
                        <h3 className="mb-0">Cijena novog modela</h3>
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
                            <Col lg="5">
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
                            <Col lg="5">
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
                            <Col lg="2">
                            <FormGroup>
                                <label
                                className="form-control-label"
                                >
                                Cijena
                                </label>
                                <Input
                                className="form-control-alternative"
                                id="input-cijena"
                                placeholder="Cijena"
                                type="number"
                                name="cijena"
                                onChange={this.onChange}
                                />
                                <label className="h6"> npr. 350</label>
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
                          Dodaj cijenu
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

export default AddModelPriceModal;
