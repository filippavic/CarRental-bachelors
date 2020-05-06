//Detaljne informacije o vozilu

import React from 'react'
import axios from 'axios';

// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    Form,
    Modal,
    Row,
    Col,
    Collapse,
    Button,
    Input,
    Alert
  } from "reactstrap";


import ReactLoading from 'react-loading';

class VehicleDetailsModal extends React.Component{

    constructor(props) {
		super(props);
		this.state = {
            information: [],
            isFetching: false,
            openedCollapses: [],
            prikupljeno: false,
            status : '',
            registracija: '',
            editMode: false,
            msg: null
        };
        this.options = [];
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
            this.setState({ information: data, registracija: data.registratskaoznaka, isFetching: false });
        });
    }

    collapsesToggle = collapse => {
        let openedCollapses = this.state.openedCollapses;
        if (openedCollapses.includes(collapse)) {
          this.setState({
            openedCollapses: []
          });
        } else {
          this.setState({
            openedCollapses: [collapse]
          });
        }
      };

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value});
    };  

    startEditMode = e => {
        e.preventDefault();
        this.setState({editMode: true});
    };

    finishEdit = e => {
        e.preventDefault();
        if(!this.state.registracija){
            this.setState({msg: 'Ispunite polje s registracijom'});
        }
        else{
            this.setState({msg: null});
            //headers
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            let registrationData = {
                sifvozilo: this.state.information.sifvozilo,
                registracija: this.state.registracija
            }
        
            const body = JSON.stringify(registrationData);
        
            axios.post('/api/admin_page/changeregistration', body, config)
            .then(res => {
                if(res.status === 200){
                    this.setState({editMode: false});
                }    
            })
            .catch(err => {
                this.setState({msg: "Registracija već postoji"})
            });

        }
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
                    <h6 className="heading-small text-muted mb-4">
                        Osnovno
                    </h6>
                    <div className="pl-lg-4">
                        <Row>
                            <Col lg="3">
                                <img className="car-img" draggable="false" alt={this.state.information.nazivmodel} src={this.state.information.urlslika}/>
                            </Col>
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
                        </div>

                        <Card className="card-plain" style={{marginTop: '10px'}}>
                            <CardHeader
                            role="tab"
                            style={{cursor: 'pointer'}}
                            onClick={() => this.collapsesToggle("collapseOne")}
                            aria-expanded={this.state.openedCollapses.includes(
                                "collapseOne"
                            )}
                            >
                            <h5 className="mb-0">Detalji modela...</h5>
                            </CardHeader>
                            <Collapse
                            role="tabpanel"
                            isOpen={this.state.openedCollapses.includes("collapseOne")}
                            >
                            <CardBody>
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
                                    ) : 
                                    (<h3>{this.state.information.nazivvrstamotor}</h3>)}
                                </Col>
                                <Col lg="3">
                                    <label
                                    className="form-control-label"
                                    >
                                    Mjenjač
                                    </label>
                                    {this.state.isFetching ? (
                                        <ReactLoading type="bubbles" color="#8E8E93" height={'10%'} width={'10%'} />
                                    ) : 
                                    (<h3>{this.state.information.nazivvrstamjenjac}</h3>)}
                                </Col>
                                <Col lg="3">
                                    <label
                                    className="form-control-label"
                                    >
                                    Potrošnja
                                    </label>
                                    {this.state.isFetching ? (
                                        <ReactLoading type="bubbles" color="#8E8E93" height={'10%'} width={'10%'} />
                                    ) : 
                                    (<h3>{this.state.information.potrosnja} l/100 km</h3>)}
                                </Col>
                                </Row>
                            </CardBody>
                            </Collapse>
                        </Card>

                        <Card className="card-plain" style={{marginTop: '10px'}}>
                            <CardHeader
                            role="tab"
                            style={{cursor: 'pointer'}}
                            onClick={() => this.collapsesToggle("collapseTwo")}
                            aria-expanded={this.state.openedCollapses.includes(
                                "collapseTwo"
                            )}
                            >
                            <h5 className="mb-0">Status vozila...</h5>
                            </CardHeader>
                            <Collapse
                            role="tabpanel"
                            isOpen={this.state.openedCollapses.includes("collapseTwo")}
                            >
                            <CardBody>
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
                            </CardBody>
                            </Collapse>
                        </Card>
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
