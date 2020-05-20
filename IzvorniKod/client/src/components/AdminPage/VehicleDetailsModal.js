//Detaljne informacije o vozilu

import React from 'react'
import axios from 'axios';
import ReactLoading from 'react-loading';
import Select from 'react-select';
import orderBy from 'lodash/orderBy';

// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    Form,
    Modal,
    Row,
    Col,
    Button,
    Input,
    Alert,
    FormGroup
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


class VehicleDetailsModal extends React.Component{

    constructor(props) {
		super(props);
		this.state = {
            information: [],
            isFetching: false,
            prikupljeno: false,
            status : '',
            registracija: '',
            registracijaBefore: '',
            editMode: false,
            msg: null,
            sifmotor: null,
            sifmjenjac: null,
            potrosnja: null,
            sifproizvodac: null,
            sifmodel: null
        };
        this.proizvodaci = [];
        this.modeli = [];
        this.motori = [];
        this.mjenjaci = [];
    }


    //ucitavanje detalja o vozilu
    componentDidMount(){
        this.setState({isFetching: true});
        axios.get(`/api/admin_page/vehicleinfo/${this.props.sifVozilo}`).then(res => {
            const data = res.data;

            if(data.sifstatus == 1){
                this.setState({prikupljeno: true, status: 'Iznajmljeno'});
            }
            else{
                this.setState({prikupljeno: false, status: 'U podružnici'});
            }
            let model = { label: data.nazivmodel, value: data.sifmodel};
            let motor = { label: data.nazivvrstamotor, value: data.sifvrstamotor};
            let mjenjac = { label: data.nazivvrstamjenjac, value: data.sifvrstamjenjac};

            this.setState({ information: data, registracija: data.registratskaoznaka, registracijaBefore: data.registratskaoznaka, 
                sifmotor: motor, sifmjenjac: mjenjac, potrosnja: data.potrosnja, 
                sifproizvodac: data.sifproizvodac, sifmodel: model, isFetching: false });
        });
        axios.get(`/api/admin_page/vehicleoptions/`).then(res => {
            const data = res.data;
            let sortedProizvodaci = orderBy(data.manuf, 'label', 'asc');
            this.setState({ proizvodaci: sortedProizvodaci, motori: data.engines, mjenjaci: data.transmissions, lokacije: data.locations });
        });
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value});
    };  

    startEditMode = e => {
        e.preventDefault();
        this.setState({editMode: true});
    };

    //funkcija za odabir motora
    handleEngineSelect = sifmotor => {
        this.setState({ sifmotor });
    };

    //funkcija za odabir mjenjaca
    handleTransmSelect = sifmjenjac => {
        this.setState({ sifmjenjac });
    };

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

    finishEdit = e => {
        e.preventDefault();

        //headers
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        if(this.state.registracijaBefore && this.state.registracija !== this.state.registracijaBefore){
            //promijenjena registracija

            this.setState({msg: null});
            
            let registrationData = {
                sifvozilo: this.state.information.sifvozilo,
                registracija: this.state.registracija
            }
        
            const body = JSON.stringify(registrationData);
        
            axios.post('/api/admin_page/changeregistration', body, config)
            .then(res => {
                if(res.status === 200){
                    //this.setState({editMode: false});
                }    
            })
            .catch(err => {
                this.setState({msg: "Registracija već postoji"})
            });
        }

        const newVehicleData = {
            sifvozilo: this.state.information.sifvozilo,
            sifmodel: this.state.sifmodel.value,
            sifmjenjac: this.state.sifmjenjac.value,
            sifmotor: this.state.sifmotor.value,
            potrosnja: this.state.potrosnja
        };

        const body = JSON.stringify(newVehicleData);
    
        axios.post('/api/admin_page/updatevehicle', body, config)
        .then(res => {
            if(res.status === 200){
                this.setState({editMode: false});
                this.setState({isFetching: true});
                axios.get(`/api/admin_page/vehicleinfo/${this.props.sifVozilo}`).then(res => {
                    const data = res.data;

                    if(data.sifstatus == 1){
                        this.setState({prikupljeno: true, status: 'Iznajmljeno'});
                    }
                    else{
                        this.setState({prikupljeno: false, status: 'U podružnici'});
                    }

                    let model = { label: data.nazivmodel, value: data.sifmodel};
                    let motor = { label: data.nazivvrstamotor, value: data.sifvrstamotor};
                    let mjenjac = { label: data.nazivvrstamjenjac, value: data.sifvrstamjenjac};
                    
                    this.setState({ information: data, registracija: data.registratskaoznaka, registracijaBefore: data.registratskaoznaka, 
                        sifmotor: motor, sifmjenjac: mjenjac, potrosnja: data.potrosnja, 
                        sifproizvodac: data.sifproizvodac, sifmodel: model, isFetching: false });
                });
            }    
        })
        .catch(err => {
            this.setState({msg: "Dogodila se pogreška"})
        });
    };

 
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
                        <h3 className="mb-0">Detalji o vozilu {this.state.information.registratskaoznaka}</h3>
                        </Col>
                        <Col className="text-right" xs="4">
                        {this.state.editMode ? (
                            <Button color="primary" onClick={e => this.finishEdit(e)} size="sm">
                            Spremi
                            </Button>
                        ) : (
                            <Button color="primary" onClick={e => this.startEditMode(e)} size="sm" >
                            Uredi
                            </Button>
                        )}
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
                        <h6 className="heading-small text-muted mb-4">
                            Osnovno
                        </h6>
                        <Row>
                            <Col lg="3">
                                <img className="car-img" draggable="false" alt={this.state.information.nazivmodel} src={this.state.information.urlslika}/>
                            </Col>
                            {this.state.editMode ? (
                                <>
                                <Col lg="3">
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
                                        defaultValue={{ label: this.state.information.nazivproizvodac, value: this.state.sifproizvodac }}
                                        onChange={this.handleManufSelect}
                                        />
                                </FormGroup>
                                </Col>
                                <Col lg="3">
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
                                        defaultValue={this.state.sifmodel}
                                        onChange={this.handleModelSelect}
                                        />
                                </FormGroup>
                                </Col>
                                </>
                            ) : (
                                <Col lg="6">
                                <label
                                className="form-control-label"
                                >
                                Model
                                </label>
                                {this.state.isFetching ? (
                                    <ReactLoading type="bubbles" color="#8E8E93" height={'10%'} width={'10%'} />
                                ) : 
                                (<h2>{this.state.information.nazivproizvodac} {this.state.information.nazivmodel}</h2>)}     
                                </Col>
                            )}
                            
                            <Col lg="3">
                                <label
                                className="form-control-label"
                                >
                                Registracija
                                </label>
                                {this.state.isFetching ? (
                                    <ReactLoading type="bubbles" color="#8E8E93" height={'10%'} width={'10%'} />
                                ) : null}
                                {!this.state.isFetching && this.state.editMode ? (
                                    <Input
                                    className="form-control-alternative"
                                    defaultValue={this.state.registracija}
                                    id="input-first-name"
                                    type="text"
                                    name="registracija"
                                    onChange={this.onChange}
                                    />
                                ) : (
                                    <h2>{this.state.registracija}</h2>
                                )}
                            </Col>
                        </Row>

                        <hr className="my-4" />
                        <h6 className="heading-small text-muted mb-4">
                        Detalji o modelu
                        </h6>

                        <Row>
                            <Col lg="3">
                                <label
                                className="form-control-label"
                                >
                                Vrsta
                                </label>
                                {this.state.isFetching ? (
                                    <ReactLoading type="bubbles" color="#8E8E93" height={'10%'} width={'10%'} />
                                ) : 
                                (<h3>{this.state.information.nazivvrstamodel}</h3>)}      
                            </Col>
                            <Col lg="3">
                                <label
                                className="form-control-label"
                                >
                                Motor
                                </label>
                                {this.state.isFetching ? (
                                    <ReactLoading type="bubbles" color="#8E8E93" height={'10%'} width={'10%'} />
                                ) : null}
                                {this.state.editMode ? (
                                    <Select
                                    styles={reactSelectStyles}
                                    placeholder="Motor"
                                    options={this.state.motori}
                                    defaultValue={this.state.sifmotor}
                                    onChange={this.handleEngineSelect}
                                    />
                                ) : (
                                    <h3>{this.state.information.nazivvrstamotor}</h3>
                                )}
                            </Col>
                            <Col lg="3">
                                <label
                                className="form-control-label"
                                >
                                Mjenjač
                                </label>
                                {this.state.isFetching ? (
                                    <ReactLoading type="bubbles" color="#8E8E93" height={'10%'} width={'10%'} />
                                ) : null}
                                {this.state.editMode ? (
                                    <Select
                                    styles={reactSelectStyles}
                                    placeholder="Mjenjač"
                                    options={this.state.mjenjaci}
                                    defaultValue={this.state.sifmjenjac}
                                    onChange={this.handleTransmSelect}
                                    />
                                ) : (
                                    <h3>{this.state.information.nazivvrstamjenjac}</h3>
                                )}
                            </Col>
                            <Col lg="3">
                                <label
                                className="form-control-label"
                                >
                                Potrošnja
                                </label>
                                {this.state.isFetching ? (
                                    <ReactLoading type="bubbles" color="#8E8E93" height={'10%'} width={'10%'} />
                                ) : null}
                                {!this.state.isFetching && this.state.editMode ? (
                                    <Input
                                    className="form-control-alternative"
                                    defaultValue={this.state.potrosnja}
                                    id="input-potrosnja"
                                    type="number"
                                    name="potrosnja"
                                    onChange={this.onChange}
                                    />
                                ) : (
                                    <h3>{this.state.information.potrosnja} l/100km</h3>
                                )}
                            </Col>
                        </Row>

                        <hr className="my-4" />
                        <h6 className="heading-small text-muted mb-4">
                        Status vozila
                        </h6>

                        <Row>
                            <Col lg="5">
                                <label
                                className="form-control-label"
                                >
                                {this.state.prikupljeno ? ("Zadnja lokacija") : ("Lokacija")}
                                </label>
                                {this.state.isFetching ? (
                                    <ReactLoading type="bubbles" color="#8E8E93" height={'10%'} width={'10%'} />
                                ) : 
                                (<h3>{this.state.information.ulica} {this.state.information.kucnibroj}, {this.state.information.nazivmjesto}</h3>)}      
                            </Col>
                            <Col lg="3">
                                <label
                                className="form-control-label"
                                >
                                Status
                                </label>
                                {this.state.isFetching ? (
                                    <ReactLoading type="bubbles" color="#8E8E93" height={'10%'} width={'10%'} />
                                ) : 
                                (<h3>{this.state.status}</h3>)}
                            </Col>
                        </Row>

                    </div>
                      <div className="text-center">
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </div>
            </Modal>
        )
    }
}

export default VehicleDetailsModal;
